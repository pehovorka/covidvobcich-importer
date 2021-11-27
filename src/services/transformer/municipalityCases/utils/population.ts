import { MunicipalityCases } from "../../../../types/municipalityCases";
import { municipalitiesPopulation } from "../assets/municipalitiesPopulation";

export const getPopulation = (
  municipalityId: MunicipalityCases["municipalityId"]
): number | undefined => {
  const municipality = municipalitiesPopulation.find(
    (municipality) => municipality.id === municipalityId
  );
  return municipality?.population;
};
