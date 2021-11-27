import initializeFirebase from "./utils/initializeFirebase";
initializeFirebase();

import { firestore } from "firebase-admin";

import { downloader, DownloadState } from "./services/downloader";
import { db } from "./utils/db";
import {
  isCollectionLocked,
  setCollectionLockedState,
} from "./utils/collectionLock";
import { csvToSqliteImporter as municipalityCasesImporter } from "./services/importer/municipalityCases";

(async () => {
  interface File {
    url: string;
    collection: firestore.CollectionReference;
    fileName: string;
    importerFn?: (fileName: string) => Promise<boolean>;
  }

  const files: File[] = [
    {
      url: "https://onemocneni-aktualne.mzcr.cz/api/v2/covid-19/obce.csv",
      collection: db.municipalityCases,
      fileName: "municipalityCases",
      importerFn: municipalityCasesImporter,
    },
    {
      url: "https://onemocneni-aktualne.mzcr.cz/api/v2/covid-19/ockovani-geografie.csv",
      collection: db.orpVaccinations,
      fileName: "orpVaccinations",
    },
  ];

  const executionStartedAt = new Date();
  const HOUR = 3600000;

  try {
    for (const file of files) {
      // [✓] 1. Check execution time to prevent Cloud Run instance timeout
      if (new Date().getTime() - executionStartedAt.getTime() > HOUR / 2) {
        console.log(
          "Execution of this instance started more than 30 minutes ago. Shutting down..."
        );
        return;
      }

      console.log(
        `🏁🏁🏁 Execution of import flow for ${file.fileName} started! 🏁🏁🏁`
      );
      // [✓] 2. Check if DB collection is not locked (if it's been more than 1hr since the DB was locked, unlock it and continue)
      if (await isCollectionLocked(file.collection)) continue;
      // [✓] 3. Set DB collection to locked state
      await setCollectionLockedState(file.collection, true);
      // [✓] 4. Check if file is suitable for download
      // [✓] 5. Download the file
      console.log(`Starting to fetch ${file.fileName}...`);
      const downloadState = await downloader(
        file.url,
        file.collection,
        file.fileName
      );
      // [✓] 6. Do not continue with import if no file was downloaded
      if (downloadState !== DownloadState.COMPLETED) {
        await setCollectionLockedState(file.collection, false);
        continue;
      }

      // [✓] 7. Import from CSV to SQLite
      if (file.importerFn) await file.importerFn(file.fileName);

      // [ ] 8. Transform from SQLite to Firestore
      // [ ] 9. Set collectionUpdatedAt date
      // [✓] 10. Set DB collection to unlocked state
      await setCollectionLockedState(file.collection, false);
    }
  } catch (error) {
    console.error(error);
  }
})();
