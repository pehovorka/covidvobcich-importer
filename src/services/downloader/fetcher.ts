import admin = require("firebase-admin");

import { sleep, getModifiedDate } from "./utils";

export const isSuitableForDownload = async (
  fileUrl: string,
  collectionName: string,
  fileName: string
): Promise<boolean> => {
  const collection = admin.firestore().collection(collectionName);

  const isModifiedDateStable = async (): Promise<boolean> => {
    const date1 = await getModifiedDate(fileUrl);
    await sleep(5000);
    const date2 = await getModifiedDate(fileUrl);
    console.log("Stable: ", date1.getTime() === date2.getTime());
    return date1.getTime() === date2.getTime() ? true : false;
  };

  const areDatesEqual = async (): Promise<boolean> => {
    const doc = await collection.doc("_modifiedAt").get();

    if (doc.exists) {
      const storedDate: Date =
        doc.data()?.sourceUpdatedAt.toDate() ?? new Date("2020-01-01");
      const serverDate: Date = await getModifiedDate(fileUrl);

      console.log(
        "StoredDate: ",
        new Date(storedDate.getTime()),
        "ServerDate: ",
        new Date(serverDate.getTime()),
        "equal:",
        storedDate.getTime() === serverDate.getTime()
      );

      return storedDate.getTime() === serverDate.getTime() ? true : false;
    } else {
      console.log(
        "Returning datesEqual = false (_modifiedAt doc doesn't exist in Firestore yet)..."
      );
      return false;
    }
  };

  const equal = await areDatesEqual();
  const stable = await isModifiedDateStable();

  if (!stable)
    console.error(
      `${fileName} is not suitable for download – modified time is changing.`
    );
  if (equal) console.info(`Skipping download of ${fileName} – dates are equal`);

  return !equal && stable;
};
