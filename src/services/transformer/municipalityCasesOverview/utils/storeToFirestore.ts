import { firestore } from "firebase-admin";
import { config } from "../../../../config";

import { MunicipalityCasesOverview } from "../../../../types/municipalityCases";

export const storeToFirestore = async (
  data: MunicipalityCasesOverview[],
  collection: firestore.CollectionReference
): Promise<firestore.WriteResult> => {
  console.log("Storing municipalities overview...");

  const result = await collection
    .doc(config.overviewDocName)
    .set({ municipalityCases: data });

  return result;
};
