import fs = require("fs");
import os = require("os");
import path = require("path");
import axios from "axios";
import admin = require("firebase-admin");

import { getModifiedDate } from "./utils";
import { DownloadState } from ".";

interface DownloadResult {
  state: DownloadState;
  error?: Error;
}

export const download = async (
  url: string,
  collectionName: string,
  fileName: string
): Promise<DownloadResult> => {
  const filePath = path.join(os.tmpdir(), fileName);
  const writer = fs.createWriteStream(filePath);
  const collection = admin.firestore().collection(collectionName);

  return new Promise<DownloadResult>((resolve, reject) => {
    axios({
      method: "get",
      url: url,
      responseType: "stream",
    })
      .then((response) => {
        console.log("Starting new download...");
        response.data
          .pipe(writer)
          .on("error", (error: Error) => {
            writer.close();
            reject({ state: DownloadState.FAILED, error: error });
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
            resolve({ state: DownloadState.COMPLETED });
          });
      })
      .catch((error: Error) => {
        reject({ state: DownloadState.FAILED, error: error });
      });
  });
};
