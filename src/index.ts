import initializeFirebase from "./utils/initializeFirebase";
initializeFirebase();

import { firestore } from "firebase-admin";

import { downloader, DownloadState } from "./services/downloader";
import { db } from "./utils/db";
import {
  isCollectionLocked,
  setCollectionLockedState,
} from "./utils/collectionLock";

(async () => {
  interface File {
    url: string;
    collection: firestore.CollectionReference;
    fileName: string;
  }

  const files: File[] = [
    {
      url: "https://onemocneni-aktualne.mzcr.cz/api/v2/covid-19/obce.csv",
      collection: db.municipalityCases,
      fileName: "municipalityCases.csv",
    },
    {
      url: "https://onemocneni-aktualne.mzcr.cz/api/v2/covid-19/ockovani-geografie.csv",
      collection: db.orpVaccinations,
      fileName: "orpVaccinations.csv",
    },
  ];

  const executionStartedAt = new Date();
  const HOUR = 3600000;

  try {
    for (const file of files) {
      // Check execution time to prevent Cloud Run instance timeout
      if (new Date().getTime() - executionStartedAt.getTime() > HOUR / 2) {
        console.log(
          "Execution of this instance started more than 30 minutes ago. Shutting down..."
        );
        return;
      }

      console.log(
        `🏁🏁🏁 Execution of import flow for ${file.fileName} started! 🏁🏁🏁`
      );
      // TODO:
      // [✓] 1. Check if DB collection is not locked (if it's been more than 1hr since the DB was locked, unlock it and continue)
      if (await isCollectionLocked(file.collection)) continue;
      // [✓] 2. Set DB collection to locked state
      await setCollectionLockedState(file.collection, true);
      // [✓] 3. Check if file is suitable for download
      // [✓] 4. Download the file
      console.log(`Starting to fetch ${file.fileName}...`);
      const downloadState = await downloader(
        file.url,
        file.collection,
        file.fileName
      );
      // [✓] 5. Do not continue with import if no file was downloaded
      if (downloadState !== DownloadState.COMPLETED) {
        await setCollectionLockedState(file.collection, false);
        continue;
      }

      // TODO:
      // [ ] 6. Import from CSV to SQLite
      // [ ] 7. Transform from SQLite to Firestore
      // [ ] 8. Set collectionUpdatedAt date
      // [✓] 9. Set DB collection to unlocked state
      await setCollectionLockedState(file.collection, false);
    }
  } catch (error) {
    console.error(error);
  }
})();
