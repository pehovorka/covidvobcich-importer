import { firestore } from "firebase-admin";

import { OrpVaccinations } from "../../../../types/orpVaccinations";

export const storeToFirestore = async (
  chunk: OrpVaccinations[],
  chunkNo: number,
  chunkSize: number,
  collection: firestore.CollectionReference
): Promise<firestore.WriteResult[]> => {
  console.log(
    `Storing municipalities ${chunkNo * chunkSize + 1} (${
      chunk[0].orpName
    }) – ${chunkNo * chunkSize + chunk.length} (${
      chunk[chunk.length - 1].orpName
    }).`
  );

  const batch = firestore().batch();

  chunk.forEach((doc) => {
    const newDocRef = collection.doc(doc.orpId.toString());
    batch.set(newDocRef, doc);
  });
  return batch.commit();
};
