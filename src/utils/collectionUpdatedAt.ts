import { firestore } from "firebase-admin";

import { config } from "../config";

export const setCollectionUpdatedAt = async (
  collection: firestore.CollectionReference
): Promise<firestore.WriteResult> => {
  const currentDate = new Date();
  const doc = await collection
    .doc(config.metadataDocName)
    .set({ collectionUpdatedAt: currentDate }, { merge: true });
  console.log(`Collection updated at was set to ${currentDate.toString()}.`);
  return doc;
};
