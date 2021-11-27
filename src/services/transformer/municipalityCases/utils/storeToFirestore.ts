import { firestore } from "firebase-admin";

import { MunicipalityCases } from "../../../../types/municipalityCases";

export const storeToFirestore = async (
  chunk: MunicipalityCases[],
  collection: firestore.CollectionReference
): Promise<firestore.WriteResult[]> => {
  console.log(
    `Storing ${chunk.length} municipalities. First municipality: ${
      chunk[0].municipalityName
    }, last municipality: ${chunk[chunk.length - 1].municipalityName}.`
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
