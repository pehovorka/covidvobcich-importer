import admin = require("firebase-admin");

export const collections = {
  municipalityCases: admin.firestore().collection("municipalityCases"),
  orpVaccinations: admin.firestore().collection("orpVaccinations"),
};
