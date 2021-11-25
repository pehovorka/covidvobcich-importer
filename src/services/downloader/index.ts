import { download } from "./downloader";
import { isSuitableForDownload } from "./fetcher";

export enum DownloadState {
  COMPLETED = "completed",
  SKIPPED = "skipped",
  FAILED = "failed",
}

export const downloader = async (
  url: string,
  collectionName: string,
  fileName: string
): Promise<DownloadState> => {
  const suitable = await isSuitableForDownload(url, collectionName, fileName);
  if (!suitable) return DownloadState.SKIPPED;

  const downloadResult = await download(url, collectionName, fileName);
  if (downloadResult.error) console.error(downloadResult.error);
  return downloadResult.state;
};
