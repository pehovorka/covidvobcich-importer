import { applicationDefault, initializeApp } from "firebase-admin/app";

export default () =>
  initializeApp({
    credential: applicationDefault(),
  });
