import Database = require("better-sqlite3");
import { firestore } from "firebase-admin";
import os = require("os");
import path = require("path");

import {
  MunicipalityCases,
  MunicipalityCasesCsv,
} from "../../../types/municipalityCases";
import { storeToFirestore, transform } from "./utils";

export const sqliteToFirestoreTransformer = async (
  fileName: string,
  collection: firestore.CollectionReference
): Promise<boolean> => {
  const dbFilePath = path.join(os.tmpdir(), fileName + ".db");
  const db = new Database(dbFilePath, {});

  const municipalityIds: MunicipalityCases["municipalityId"][] = db
    .prepare(
      "SELECT DISTINCT municipalityId from municipalities WHERE municipalityId != ''"
    )
    .all()
    .map((municipality) => municipality.municipalityId);

  const selectMunicipality = db.prepare(
    "SELECT * FROM municipalities WHERE municipalityId = ?"
  );

  let batch: MunicipalityCases[] = [];
  let batchNo = 0;
  const BATCH_SIZE = 100;

  for (const municipalityId of municipalityIds) {
    const municipality: MunicipalityCasesCsv[] =
      selectMunicipality.all(municipalityId);

    municipality.sort((a, b) => {
      return a.date > b.date ? 1 : -1;
    });

    batch.push(transform(municipality));

    if (batch.length === BATCH_SIZE) {
      try {
        await storeToFirestore(batch, batchNo, BATCH_SIZE, collection);
        batch = [];
        batchNo += 1;
      } catch (error) {
        console.error(error);
        return false;
      }
    }
  }

  try {
    await storeToFirestore(batch, batchNo, BATCH_SIZE, collection);
    console.log(
      `🎉 Successfully stored ${
        batchNo * BATCH_SIZE + batch.length
      } municipalities to Firestore!`
    );
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};
