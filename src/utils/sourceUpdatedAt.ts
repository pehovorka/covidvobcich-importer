import { firestore } from "firebase-admin";

import { config } from "../config";

export const setSourceUpdatedAt = async (
  collection: firestore.CollectionReference,
  date: Date
): Promise<firestore.WriteResult> => {
  const result = await collection
    .doc(config.metadataDocName)
    .set({ sourceUpdatedAt: date }, { merge: true });

  console.log(`Source updated at was set to ${date.toString()}.`);
  return result;
};

export const getSourceUpdatedAt = async (
  collection: firestore.CollectionReference
): Promise<Date | undefined> => {
  const doc = await collection.doc(config.metadataDocName).get();
  if (doc.exists) {
    const storedDate: Date | undefined = doc.data()?.sourceUpdatedAt?.toDate();
    return storedDate;
  }
  return undefined;
};
