import admin = require("firebase-admin");
import { config } from "../config";

export const isCollectionLocked = async (
  collection: admin.firestore.CollectionReference
): Promise<boolean> => {
  const HOUR = 3600;
  const doc = await collection.doc(config.metadataDocName).get();
  const lockedState: boolean = doc.data()?.locked;
  const lockedUpdatedAt: Date = doc.data()?.lockedUpdatedAt?.toDate();

  if (
    lockedState &&
    (new Date().getTime() - lockedUpdatedAt.getTime()) / 1000 > HOUR
  ) {
    console.log(
      "Collection has been locked for more than one hour. Unlocking now..."
    );
    await setCollectionLockedState(collection, false);
    return false;
  }
  console.log(`Collection is ${lockedState ? "locked 🔒" : "unlocked 🔓"}.`);
  return lockedState;
};

export const setCollectionLockedState = async (
  collection: admin.firestore.CollectionReference,
  state: boolean
): Promise<admin.firestore.WriteResult> => {
  const doc = await collection
    .doc(config.metadataDocName)
    .set({ locked: state, lockedUpdatedAt: new Date() }, { merge: true });
  console.log(
    `Collection locked state was set to ${state ? "locked 🔒" : "unlocked 🔓"}.`
  );
  return doc;
};
