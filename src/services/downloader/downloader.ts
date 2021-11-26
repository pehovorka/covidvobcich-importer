import fs = require("fs");
import os = require("os");
import path = require("path");
import axios from "axios";
import admin = require("firebase-admin");

import { config } from "../../config";
import { getModifiedDate } from "./utils";
import { DownloadState } from ".";

interface DownloadResult {
  state: DownloadState;
  error?: Error;
}

export const download = async (
  url: string,
  collection: admin.firestore.CollectionReference,
  fileName: string
): Promise<DownloadResult> => {
  const filePath = path.join(os.tmpdir(), fileName);
  const writer = fs.createWriteStream(filePath);

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
                .doc(config.metadataDocName)
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
