export interface MunicipalityCases {
  municipalityId: number;
  municipalityName?: string;
  municipalityPopulation?: number;
  regionId: string;
  regionName?: string;
  districtId: string;
  districtName?: string;
  orpId?: number;
  orpName?: string;
  days: DayCases[];
}

interface DayCases {
  d: string;
  ac: number;
  nc: number;
  nc65: number;
  nc7d: number;
  nc14d: number;
}

export interface MunicipalityCasesCsv {
  dateCode?: string;
  date: DayCases["d"];
  regionId: MunicipalityCases["regionId"];
  regionName?: MunicipalityCases["regionName"];
  districtId: MunicipalityCases["districtId"];
  districtName?: MunicipalityCases["districtName"];
  orpId?: MunicipalityCases["orpId"];
  orpName?: MunicipalityCases["orpName"];
  municipalityId: MunicipalityCases["municipalityId"];
  municipalityName?: MunicipalityCases["municipalityName"];
  newCases: DayCases["nc"];
  activeCases: DayCases["ac"];
  newCases65: DayCases["nc65"];
  newCases7Days: DayCases["nc7d"];
  newCases14Days: DayCases["nc14d"];
}
