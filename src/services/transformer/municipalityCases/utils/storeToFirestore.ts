import { firestore } from "firebase-admin";

import { MunicipalityCases } from "../../../../types/municipalityCases";

export const storeToFirestore = async (
  chunk: MunicipalityCases[],
  chunkNo: number,
  chunkSize: number,
  collection: firestore.CollectionReference
): Promise<firestore.WriteResult[]> => {
  console.log(
    `Storing municipalities ${chunkNo * chunkSize + 1} (${
      chunk[0].municipalityName
    }) – ${chunkNo * chunkSize + chunk.length} (${
      chunk[chunk.length - 1].municipalityName
    }).`
  );

  const batch = firestore().batch();

  chunk.forEach((doc) => {
    const newDocRef = collection.doc(doc.municipalityId.toString());
    batch.set(newDocRef, doc, {
      merge: true,
    });
  });
  return batch.commit();
};
