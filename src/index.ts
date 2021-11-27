import express = require("express");
import app from "./app";
import { config } from "./config";

const server = express();

server.post("/", async (req, res) => {
  await app();
  res.send(`Execution has finished!`);
});

const port = config.port || 8080;
server.listen(port, () => {
  console.log(
    `App is listetning on port ${port} for Cloud Scheduler invocations!`
  );
});
