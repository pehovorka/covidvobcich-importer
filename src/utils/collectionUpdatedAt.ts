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

export const getCollectionUpdatedAt = async (
  collection: firestore.CollectionReference
): Promise<Date | undefined> => {
  const doc = await collection.doc(config.metadataDocName).get();
  if (doc.exists) {
    const storedDate: Date | undefined = doc
      .data()
      ?.collectionUpdatedAt?.toDate();
    return storedDate;
  }
  return undefined;
};
