import { download } from "./downloader";
import { isSuitableForDownload } from "./fetcher";

export const downloader = async (
  url: string,
  collectionName: string,
  fileName: string
) => {
  const suitable = await isSuitableForDownload(url, collectionName, fileName);
  if (!suitable) return;
  await download(url, collectionName, fileName);
};
