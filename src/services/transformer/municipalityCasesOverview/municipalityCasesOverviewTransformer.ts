import Database = require("better-sqlite3");
import { firestore } from "firebase-admin";
import os = require("os");
import path = require("path");

import {
  MunicipalityCasesCsv,
  MunicipalityCasesOverview,
} from "../../../types/municipalityCases";
import { getPopulation } from "../utils/population";
import { getRelativeCases } from "../utils/relativeCases";
import { storeToFirestore } from "./utils/storeToFirestore";

export const municipalityCasesOverviewTransformer = async (
  fileName: string,
  collection: firestore.CollectionReference
): Promise<boolean> => {
  const dbFilePath = path.join(os.tmpdir(), fileName + ".db");
  const db = new Database(dbFilePath, {});

  const currentMunicipalityCases: MunicipalityCasesCsv[] = db
    .prepare(
      `select * 
      from municipalities 
      join 
        ( 
           select max(date) as maxDate 
           from municipalities 
        ) 
      where date = maxDate
      order by activeCases desc`
    )
    .all();

  const transformedData: MunicipalityCasesOverview[] =
    currentMunicipalityCases.map((municipality) => ({
      id: municipality.municipalityId,
      mn: municipality.municipalityName,
      dn: municipality.districtName,
      d: municipality.date,
      ac: municipality.activeCases,
      nc: municipality.newCases,
      rc: getRelativeCases(
        municipality.activeCases,
        getPopulation(municipality.municipalityId)
      ),
    }));

  try {
    await storeToFirestore(transformedData, collection);
    console.log("🎉 Successfully stored municipality overview to Firestore!");
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};
