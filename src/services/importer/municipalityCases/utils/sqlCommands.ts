export const createTable =
  // eslint-disable-next-line no-multi-str
  "CREATE TABLE IF NOT EXISTS municipalities ( \
  dateCode TEXT PRIMARY KEY, \
  date TEXT NOT NULL, \
  regionId TEXT NOT NULL, \
  regionName TEXT, \
  districtId TEXT NOT NULL, \
  districtName TEXT, \
  orpId INTEGER, \
  orpName TEXT, \
  municipalityId INTEGER NOT NULL, \
  municipalityName TEXT, \
  newCases INTEGER NOT NULL, \
  activeCases INTEGER NOT NULL, \
  newCases65 INTEGER NOT NULL, \
  newCases7Days INTEGER NOT NULL, \
  newCases14Days INTEGER NOT NULL \
)";

export const createIndex =
  // eslint-disable-next-line max-len
  "CREATE INDEX IF NOT EXISTS 'municipalityId' ON 'municipalities' ('municipalityId' ASC)";

export const insert = // eslint-disable-next-line no-multi-str
  "INSERT OR REPLACE INTO municipalities VALUES \
(@dateCode, @date, @regionId, @regionName, \
@districtId, @districtName, @orpId, @orpName, \
@municipalityId, @municipalityName, @newCases, \
@activeCases, @newCases65, @newCases7Days, @newCases14Days)";
