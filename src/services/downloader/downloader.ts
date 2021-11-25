import fs = require("fs");
import os = require("os");
import path = require("path");
import axios from "axios";
import admin = require("firebase-admin");

import { getModifiedDate } from "./utils";

export const download = async (
  url: string,
  collectionName: string,
  fileName: string
): Promise<boolean | Error> => {
  const filePath = path.join(os.tmpdir(), fileName);
  const writer = fs.createWriteStream(filePath);
  const collection = admin.firestore().collection(collectionName);

  return new Promise((resolve, reject) => {
    axios({
      method: "get",
      url: url,
      responseType: "stream",
    })
      .then((response) => {
        // ensure that the user can call `then()` only when the file has
        // been downloaded entirely.

        console.log("Starting new download...");
        response.data
          .pipe(writer)
          .on("error", (error: Error) => {
            writer.close();
            reject(error);
          })
          .on("finish", () => {
            console.log(`🎉 ${fileName} was downloaded successfully!`);
            getModifiedDate(url).then((lastModified) => {
              lastModified = new Date(lastModified);
              collection
                .doc("_modifiedAt")
                .set({ sourceUpdatedAt: lastModified }, { merge: true });
              console.log("Setting sourceUpdatedAt to " + lastModified);
              console.log(filePath);
            });
            resolve(true);
          });
      })
      .catch((error: Error) => {
        reject(error);
      });
  });
};
