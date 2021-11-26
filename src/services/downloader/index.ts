import { firestore } from "firebase-admin";
import { download } from "./downloader";
import { isSuitableForDownload } from "./fetcher";

export enum DownloadState {
  COMPLETED = "completed",
  SKIPPED = "skipped",
  FAILED = "failed",
}

export const downloader = async (
  url: string,
  collection: firestore.CollectionReference,
  fileName: string
): Promise<DownloadState> => {
  const suitable = await isSuitableForDownload(url, collection, fileName);
  if (!suitable) return DownloadState.SKIPPED;

  const downloadResult = await download(url, collection, fileName);
  if (downloadResult.error) console.error(downloadResult.error);
  return downloadResult.state;
};
