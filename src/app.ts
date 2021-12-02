import initializeFirebase from "./utils/initializeFirebase";
initializeFirebase();

import { firestore } from "firebase-admin";

import {
  collections,
  isCollectionLocked,
  setCollectionLockedState,
  setCollectionUpdatedAt,
  setSourceUpdatedAt,
  storeImporterVersion,
} from "./utils";
import { downloader, DownloadState } from "./services/downloader";
import { orpVaccinationsImporter } from "./services/importer/orpVaccinations";
import { municipalityCasesImporter } from "./services/importer/municipalityCases";
import { municipalityCasesTransformer } from "./services/transformer/municipalityCases";

export default async (): Promise<void> => {
  interface File {
    url: string;
    collection: firestore.CollectionReference;
    fileName: string;
    importerFn?: (fileName: string) => Promise<boolean>;
    transformerFn?: (
      fileName: string,
      collection: firestore.CollectionReference
    ) => Promise<boolean>;
  }

  const files: File[] = [
    {
      url: "https://onemocneni-aktualne.mzcr.cz/api/v2/covid-19/obce.csv",
      collection: collections.municipalityCases,
      fileName: "municipalityCases",
      importerFn: municipalityCasesImporter,
      transformerFn: municipalityCasesTransformer,
    },
    {
      url: "https://onemocneni-aktualne.mzcr.cz/api/v2/covid-19/ockovani-geografie.csv",
      collection: collections.orpVaccinations,
      fileName: "orpVaccinations",
      importerFn: orpVaccinationsImporter,
    },
  ];

  const executionStartedAt = new Date();
  const HOUR = 3600000;

  try {
    for (const file of files) {
      // 1. Check execution time to prevent Cloud Run instance timeout
      if (new Date().getTime() - executionStartedAt.getTime() > HOUR / 2) {
        console.log(
          "Execution of this instance started more than 30 minutes ago. Shutting down..."
        );
        return;
      }

      console.log(
        `🏁🏁🏁 Execution of import flow for ${file.fileName} started! 🏁🏁🏁`
      );
      // 2. Check if DB collection is not locked (if it's been more than 1hr since the DB was locked, unlock it and continue)
      if (await isCollectionLocked(file.collection)) continue;

      // 3. Set DB collection to locked state
      await setCollectionLockedState(file.collection, true);

      // 4. Check if the file is suitable for download (and download it eventually)
      const downloadResult = await downloader(
        file.url,
        file.collection,
        file.fileName
      );

      // 5. Do not continue with import if no file was downloaded
      if (downloadResult.state !== DownloadState.COMPLETED) {
        await setCollectionLockedState(file.collection, false);
        continue;
      }

      // 6. Import from CSV to SQLite
      if (file.importerFn) {
        const importSuccessful = await file.importerFn(file.fileName);
        if (!importSuccessful) return;
      }

      // 7. Transform from SQLite to Firestore
      if (file.transformerFn) {
        const transformationSuccessful = await file.transformerFn(
          file.fileName,
          file.collection
        );
        if (!transformationSuccessful) return;
      }

      // 8. Set sourceUpdatedAt and collectionUpdatedAt dates
      await setSourceUpdatedAt(
        file.collection,
        downloadResult.lastModified ?? new Date("2020-01-01")
      );
      await setCollectionUpdatedAt(file.collection);

      // 9. Set DB collection to unlocked state
      await setCollectionLockedState(file.collection, false);

      await storeImporterVersion();
    }
  } catch (error) {
    console.error(error);
  }
  return;
};
