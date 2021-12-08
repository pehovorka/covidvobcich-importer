import _ = require("lodash");
import {
  DayVaccinations,
  DosesOrder,
  VaccineNames,
  VaccineType,
} from "../../../../types/orpVaccinations";
import {
  DbResult,
  DistinctDate,
  DistinctDoseOrder,
  TotalSum,
} from "../orpVaccinationsTransformer";

export const transform = (
  orpDosesOrderResult: DbResult[],
  orpVaccinesResult: DbResult[],
  distinctDates: DistinctDate[],
  distinctDoseOrders: DistinctDoseOrder[],
  distinctVaccines: VaccineNames[],
  totalDoseOrders: TotalSum,
  totalVaccines: TotalSum
): DayVaccinations[] =>
  _(orpDosesOrderResult)
    .concat(orpVaccinesResult)
    .concat(distinctDates)
    .sortBy("date")
    .groupBy("date")
    .map((objects, key) => ({
      date: key as string,
      doses: _(objects)
        .filter("doseOrder")
        .concat(distinctDoseOrders)
        .unionBy("doseOrder")
        .sortBy("doseOrder")
        .map((doseObj) => ({
          o: doseObj.doseOrder,
          nd: doseObj.newDoses || 0,
          td: (totalDoseOrders[(doseObj.doseOrder || 0).toString()] +=
            doseObj.newDoses || 0),
        }))
        .value() as DosesOrder[],
      vaccines: _(objects)
        .filter("vaccineId")
        .concat(distinctVaccines)
        .unionBy("vaccineId")
        .sortBy("vaccineId")
        .map((vaccineObj) => ({
          v: vaccineObj.vaccineId,
          nd: vaccineObj.newDoses || 0,
          td: vaccineObj.vaccineId
            ? (totalVaccines[vaccineObj.vaccineId] += vaccineObj.newDoses || 0)
            : null,
        }))
        .value() as VaccineType[],
    }))
    .value();
