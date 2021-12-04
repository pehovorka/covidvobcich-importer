import Database = require("better-sqlite3");
import os = require("os");
import fs = require("fs");
import path = require("path");
import csv = require("fast-csv");

import { createTable, createIndex, insert } from "./utils/sqlCommands";

import { MunicipalityCasesCsv } from "../../../types/municipalityCases";

export const municipalityCasesImporter = async (
  fileName: string
): Promise<boolean> => {
  const csvFilePath = path.join(os.tmpdir(), fileName + ".csv");
  const dbFilePath = path.join(os.tmpdir(), fileName + ".db");
  const db = new Database(dbFilePath, {});

  // Create SQLite table if doesn't exist yet
  db.exec(createTable);

  // Create index for municipalityId column
  db.exec(createIndex);

  // Prepare insert row operation
  const insertOperation = db.prepare(insert);

  // Batch insert rows
  const insertMany = db.transaction((municipalities) => {
    for (const municipality of municipalities)
      insertOperation.run(municipality);
  });

  // Insert CSV rows to SQLite DB
  return new Promise((resolve, reject) => {
    let batch: MunicipalityCasesCsv[] = [];
    let batchNo = 0;
    const BATCH_SIZE = 100000;

    console.log("Reading CSV and inserting to SQLite DB...");
    fs.createReadStream(csvFilePath)
      .pipe(csv.parse({ headers: true }))
      .on("data", (row) => {
        batch.push({
          dateCode: `${row.datum}_${row.obec_kod}`,
          date: row.datum,
          regionId: row.kraj_nuts_kod,
          regionName: row.kraj_nazev,
          districtId: row.okres_lau_kod,
          districtName: row.okres_nazev,
          orpId: row.orp_kod,
          orpName: row.orp_nazev,
          municipalityId: row.obec_kod,
          municipalityName: row.obec_nazev,
          newCases: row.nove_pripady,
          activeCases: row.aktivni_pripady,
          newCases65: row.nove_pripady_65,
          newCases7Days: row.nove_pripady_7_dni,
          newCases14Days: row.nove_pripady_14_dni,
        });
        if (batch.length === BATCH_SIZE) {
          insertMany(batch);
          batch = [];
          batchNo += 1;
        }
      })
      .on("end", () => {
        console.log(`The last batch (number ${batchNo}) processed! \
        Number of items: ${batchNo * BATCH_SIZE + batch.length}.`);
        insertMany(batch);
        resolve(true);
      })
      .on("error", (error: Error) => {
        reject(error);
      });
  });
};
