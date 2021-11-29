import { firestore } from "firebase-admin";

import { config } from "../config";
import { collections } from ".";

export const storeImporterVersion =
  async (): Promise<firestore.WriteResult> => {
    const version = process.env.npm_package_version;

    const result = await collections.serverInfo
      .doc(config.metadataDocName)
      .set({ importerVersion: version }, { merge: true });

    console.log(`Stored ${version} as importer version.`);
    return result;
  };
