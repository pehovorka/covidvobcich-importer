import Database = require("better-sqlite3");
import os = require("os");
import fs = require("fs");
import path = require("path");
import csv = require("fast-csv");

import { createTable, createIndex, insert } from "./utils/sqlCommands";

import { OrpVaccinationsCsv } from "../../../types/orpVaccinations";

export const orpVaccinationsImporter = async (
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
  const insertMany = db.transaction((orps) => {
    for (const orp of orps) insertOperation.run(orp);
  });

  // Insert CSV rows to SQLite DB
  return new Promise((resolve, reject) => {
    let batch: OrpVaccinationsCsv[] = [];
    let batchNo = 0;
    const BATCH_SIZE = 100000;

    console.log("Reading CSV and inserting to SQLite DB...");
    fs.createReadStream(csvFilePath)
      .pipe(csv.parse({ headers: true }))
      .on("data", (row) => {
        batch.push({
          id: row.id,
          date: row.datum,
          orpId: row.orp_bydliste_kod,
          orpName: row.orp_bydliste,
          regionId: row.kraj_nuts_kod,
          regionName: row.kraj_nazev,
          vaccineId: row.vakcina_kod,
          vaccineName: row.vakcina,
          doseOrder: row.poradi_davky,
          newDoses: row.pocet_davek,
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
