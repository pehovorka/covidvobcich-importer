export interface OrpVaccinations {
  orpId: number;
  orpName?: string;
  regionId: string;
  regionName?: string;
  days: DayVaccinations[];
}

interface DayVaccinations {
  date: string;
  dosesOrder: DosesOrder[];
  vaccineTypes: VaccineType[];
}

interface DosesOrder {
  doseOrder: number;
  newDoses: number;
  totalDoses: number;
}

interface VaccineType {
  vaccineId: string;
  vaccineName: string;
  newDoses: number;
  totalDoses: number;
}

export interface OrpVaccinationsCsv {
  id: string;
  date: DayVaccinations["date"];
  orpId: OrpVaccinations["orpId"];
  orpName: OrpVaccinations["orpName"];
  regionId: OrpVaccinations["regionId"];
  regionName: OrpVaccinations["regionName"];
  vaccineId: VaccineType["vaccineId"];
  vaccineName: VaccineType["vaccineName"];
  doseOrder: DosesOrder["doseOrder"];
  newDoses: DosesOrder["newDoses"];
}
