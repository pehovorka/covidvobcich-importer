import { applicationDefault, initializeApp } from "firebase-admin/app";
import { download } from "./services/downloader";

initializeApp({
  credential: applicationDefault(),
});

(async () => {
  interface File {
    url: string;
    collectionName: string;
    fileName: string;
  }

  const files: File[] = [
    {
      url: "https://onemocneni-aktualne.mzcr.cz/api/v2/covid-19/obce.csv",
      collectionName: "municipalityCases",
      fileName: "municipalityCases",
    },
    {
      url: "https://onemocneni-aktualne.mzcr.cz/api/v2/covid-19/ockovani-geografie.csv",
      collectionName: "orpVaccinations",
      fileName: "orpVaccinations",
    },
  ];

  try {
    for (const file of files) {
      await download(file.url, file.collectionName, file.fileName);
    }
  } catch (error) {
    console.error(error);
  }
})();
