import express = require("express");
import app from "./app";
import { config } from "./config";

const server = express();

server.post("/", (req, res) => {
  app();
  res.send(`Execution has started!`);
});

const port = config.port || 8080;
server.listen(port, () => {
  console.log(
    `App is listetning on port ${port} for Cloud Scheduler invocations!`
  );
});
