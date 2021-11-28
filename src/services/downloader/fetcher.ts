import admin = require("firebase-admin");

import { sleep, getModifiedDate } from "./utils";
import { getSourceUpdatedAt } from "../../utils/sourceUpdatedAt";

export const isSuitableForDownload = async (
  fileUrl: string,
  collection: admin.firestore.CollectionReference,
  fileName: string
): Promise<boolean> => {
  const isModifiedDateStable = async (): Promise<boolean> => {
    const date1 = await getModifiedDate(fileUrl);
    await sleep(5000);
    const date2 = await getModifiedDate(fileUrl);
    console.log("Stable: ", date1.getTime() === date2.getTime());
    return date1.getTime() === date2.getTime() ? true : false;
  };

  const areDatesEqual = async (): Promise<boolean> => {
    const storedDate = await getSourceUpdatedAt(collection);

    if (storedDate) {
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
        "Returning datesEqual = false (metadata doc doesn't exist in Firestore yet)..."
      );
      return false;
    }
  };

  const equal = await areDatesEqual();
  if (equal) {
    console.info(`Skipping download of ${fileName} – dates are equal`);
    return false;
  }

  const stable = await isModifiedDateStable();
  if (!stable)
    console.error(
      `${fileName} is not suitable for download – modified time is changing.`
    );

  return stable;
};
