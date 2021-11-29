import { firestore } from "firebase-admin";
import { download } from "./downloader";
import { isSuitableForDownload } from "./fetcher";

export interface DownloadResult {
  state: DownloadState;
  lastModified?: Date;
  error?: Error;
}

export enum DownloadState {
  COMPLETED = "completed",
  SKIPPED = "skipped",
  FAILED = "failed",
}

export const downloader = async (
  url: string,
  collection: firestore.CollectionReference,
  fileName: string
): Promise<DownloadResult> => {
  console.log(`Starting to fetch ${fileName}...`);

  const suitable = await isSuitableForDownload(url, collection, fileName);
  if (!suitable) return { state: DownloadState.SKIPPED };

  const downloadResult = await download(url, collection, fileName);
  if (downloadResult.error) console.error(downloadResult.error);
  return {
    state: downloadResult.state,
    error: downloadResult.error,
    lastModified: downloadResult.lastModified,
  };
};
