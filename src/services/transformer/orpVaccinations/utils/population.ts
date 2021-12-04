import { OrpVaccinations } from "../../../../types/orpVaccinations";
import { orpPopulation } from "../assets/orpPopulation";

export const getPopulation = (
  orpId: OrpVaccinations["orpId"]
): OrpVaccinations["orpPopulation"] => {
  const orp = orpPopulation.find((orp) => orp.uzisId === orpId);
  return orp?.population;
};
