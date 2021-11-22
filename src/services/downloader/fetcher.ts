import axios from "axios";
import admin = require("firebase-admin");

import { sleep } from "./utils/sleep";

export const isSuitableForDownload = async (
  fileUrl: string,
  collectionName: string
): Promise<boolean> => {
  const collection = admin.firestore().collection(collectionName);

  const getModifiedDate = async (): Promise<Date> => {
    const response: string | void = await axios
      .head(fileUrl)
      .then((response) => {
        return response.headers["last-modified"];
      })
      .catch((err) => console.error(err));
    const lastModified: Date = new Date(response || "2020-01-01");

    return lastModified;
  };

  const isModifiedDateStable = async (): Promise<boolean> => {
    const date1 = await getModifiedDate();
    await sleep(5000);
    const date2 = await getModifiedDate();
    console.log("Stable: ", date1.getTime() === date2.getTime());
    return date1.getTime() === date2.getTime() ? true : false;
  };

  const areDatesEqual = async (): Promise<boolean> => {
    const doc = await collection.doc("_modifiedAt").get();

    if (doc.exists) {
      const storedDate: Date =
        doc.data()?.sourceUpdatedAt.toDate() ?? new Date("2020-01-01");
      const serverDate: Date = await getModifiedDate();

      console.log(
        "StoredDate: ",
        storedDate.getTime(),
        "ServerDate: ",
        serverDate.getTime(),
        "equal:",
        storedDate.getTime() === serverDate.getTime()
      );

      return storedDate.getTime() === serverDate.getTime() ? true : false;
    }
    console.log("Returning datesEqual = false (doc doesn't exist)...");
    return false;
  };

  const equal = await areDatesEqual();
  const stable = await isModifiedDateStable();

  if (!stable)
    console.error(
      "Source is not suitable for download – modified time is changing."
    );
  if (equal) console.info("Skipping download – dates are equal");

  return !equal && stable;
};
