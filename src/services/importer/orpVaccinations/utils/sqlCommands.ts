export const createTable =
  // eslint-disable-next-line no-multi-str
  "CREATE TABLE IF NOT EXISTS orpVaccinations ( \
  id TEXT PRIMARY KEY, \
  date TEXT NOT NULL, \
  orpId INTEGER NOT NULL, \
  orpName TEXT, \
  regionId TEXT, \
  regionName TEXT, \
  vaccineId TEXT NOT NULL, \
  vaccineName TEXT NOT NULL, \
  doseOrder INTEGER NOT NULL, \
  newDoses INTEGER NOT NULL \
)";

export const createIndex =
  // eslint-disable-next-line max-len
  "CREATE INDEX IF NOT EXISTS 'orpId' ON 'orpVaccinations' ('orpId' ASC)";

export const insert = // eslint-disable-next-line no-multi-str
  "INSERT OR REPLACE INTO orpVaccinations VALUES \
(@id, @date, @orpId, @orpName, @regionId, @regionName, \
@vaccineId, @vaccineName, @doseOrder, @newDoses)";
