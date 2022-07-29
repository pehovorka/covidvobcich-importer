import Database = require("better-sqlite3");
import { firestore } from "firebase-admin";
import os = require("os");
import path = require("path");

import {
  DayVaccinations,
  Orp,
  OrpVaccinations,
  VaccineNames,
} from "../../../types/orpVaccinations";

import {
  getPopulation,
  storeToFirestore,
  transform,
  selectDistinctDoseOrders,
  selectDistinctOrps,
  selectDistinctVaccines,
  selectOrpDosesOrder,
  selectOrpVaccines,
  selectDistinctDates,
} from "./utils";

export interface DistinctDoseOrder {
  doseOrder: number;
}

export interface DistinctDate {
  date: string;
}

export interface DbResult {
  date?: string;
  doseOrder?: number;
  newDoses?: number;
  vaccineId?: string;
  vaccineName?: string;
}

export interface TotalSum {
  [property: string]: number;
}

export const orpVaccinationsTransformer = async (
  fileName: string,
  collection: firestore.CollectionReference
): Promise<boolean> => {
  const dbFilePath = path.join(os.tmpdir(), fileName + ".db");
  const db = new Database(dbFilePath, {});

  // Get all ORPs, vaccine types, dose orders and dates
  const orps: Orp[] = db
    .prepare(selectDistinctOrps)
    .all()
    .map((orp) => ({ orpId: orp.orpId, orpName: orp.orpName }));

  const distinctVaccines: VaccineNames[] = db
    .prepare(selectDistinctVaccines)
    .all();

  const distinctDoseOrders: DistinctDoseOrder[] = db
    .prepare(selectDistinctDoseOrders)
    .all();

  const distinctDates: DistinctDate[] = db.prepare(selectDistinctDates).all();

  // Prepare statements for calls in for loop
  const orpDosesOrderStatement = db.prepare(selectOrpDosesOrder);
  const orpVaccinesStatement = db.prepare(selectOrpVaccines);

  let batch: OrpVaccinations[] = [];
  let batchNo = 0;
  const BATCH_SIZE = 5;

  for (const orp of orps) {
    const orpDosesOrderResult: DbResult[] = orpDosesOrderStatement.all(
      orp.orpId
    );
    const orpVaccinesResult: DbResult[] = orpVaccinesStatement.all(orp.orpId);

    const totalVaccines: TotalSum = {};
    distinctVaccines.forEach(
      (vaccine) => (totalVaccines[vaccine.vaccineId] = 0)
    );

    const totalDoseOrders: TotalSum = {};
    distinctDoseOrders.forEach(
      (vaccine) => (totalDoseOrders[vaccine.doseOrder.toString()] = 0)
    );

    const days: DayVaccinations[] = transform(
      orpDosesOrderResult,
      orpVaccinesResult,
      distinctDates,
      distinctDoseOrders,
      distinctVaccines,
      totalDoseOrders,
      totalVaccines
    );

    const result: OrpVaccinations = {
      orpId: orp.orpId,
      orpName: orp.orpName,
      orpPopulation: getPopulation(orp.orpId) || 0,
      vaccineNames: distinctVaccines,
      days: days,
    };

    batch.push(result);

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
      `🎉 Successfully stored vaccination data about ${
        batchNo * BATCH_SIZE + batch.length
      } ORPs to Firestore!`
    );
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};
