import {
  MunicipalityCases,
  MunicipalityCasesCsv,
} from "../../../../types/municipalityCases";

export const transform = (
  municipality: MunicipalityCasesCsv[]
): MunicipalityCases => {
  return {
    municipalityId: municipality[0].municipalityId,
    municipalityName: municipality[0].municipalityName,
    regionId: municipality[0].regionId,
    regionName: municipality[0].regionName,
    districtId: municipality[0].districtId,
    districtName: municipality[0].districtName,
    orpId: municipality[0].orpId,
    orpName: municipality[0].orpName,
    days: municipality.map((day) => {
      return {
        d: day.date,
        ac: day.activeCases,
        nc: day.newCases,
        nc65: day.newCases65,
        nc7d: day.newCases7Days,
        nc14d: day.newCases14Days,
      };
    }),
  };
};
