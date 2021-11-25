import { applicationDefault, initializeApp } from "firebase-admin/app";
import { downloader } from "./services/downloader";

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
      fileName: "municipalityCases.csv",
    },
    {
      url: "https://onemocneni-aktualne.mzcr.cz/api/v2/covid-19/ockovani-geografie.csv",
      collectionName: "orpVaccinations",
      fileName: "orpVaccinations.csv",
    },
  ];

  try {
    for (const file of files) {
      console.log(`🏁 Starting to fetch ${file.fileName}...`);
      await downloader(file.url, file.collectionName, file.fileName);
    }
  } catch (error) {
    console.error(error);
  }
})();
