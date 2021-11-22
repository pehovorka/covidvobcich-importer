import { isSuitableForDownload } from "./fetcher";

export const download = async (
  url: string,
  collectionName: string,
  fileName: string
) => {
  await isSuitableForDownload(url, collectionName);
};
