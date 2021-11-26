import admin = require("firebase-admin");

export const db = {
  municipalityCases: admin.firestore().collection("municipalityCases"),
  orpVaccinations: admin.firestore().collection("orpVaccinations"),
};
