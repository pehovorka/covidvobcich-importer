export interface Orp {
  orpId: number;
  orpName: string;
  orpPopulation?: number;
}

export interface OrpVaccinations extends Orp {
  days: DayVaccinations[];
  vaccineNames: VaccineNames[];
}

export interface DayVaccinations {
  date: string;
  doses: DosesOrder[];
  vaccines: VaccineType[];
}

export interface DosesOrder {
  o: number;
  nd: number;
  td: number;
}

export interface VaccineType {
  v: string;
  nd: number;
  td: number;
}

export interface VaccineNames {
  vaccineId: string;
  vaccineName: string;
}

export interface OrpVaccinationsCsv {
  id: string;
  date: DayVaccinations["date"];
  orpId: OrpVaccinations["orpId"];
  orpName: OrpVaccinations["orpName"];
  regionId: string;
  regionName: string;
  vaccineId: VaccineType["v"];
  vaccineName: string;
  doseOrder: DosesOrder["o"];
  newDoses: DosesOrder["nd"];
}
