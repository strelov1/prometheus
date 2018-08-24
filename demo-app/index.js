const client = require("prom-client");
const express = require("express");

const app = express();

const collectDefaultMetrics = client.collectDefaultMetrics;
const Registry = client.Registry;

const register = new Registry();
// Probe every 5th second.
collectDefaultMetrics({ register, timeout: 5000 });

const httpRequestsTotalCounter = new client.Counter({
  name: "http_requests_total",
  help: "metric_help",
  labelNames: ["path", "method"],
  registers: [register]
});

app.get("/", (req, res) => {
  httpRequestsTotalCounter.labels("/", "GET").inc();
  return res.send("Hello World!");
});
app.get("/decipher", (req, res) => {
  httpRequestsTotalCounter.labels("/decipher", "GET").inc();
  return res.send("Hello Decipher!");
});
app.get("/metrics", (req, res) => {
  res.set("Content-Type", register.contentType);
  res.end(register.metrics());
});

app.listen(1337, () =>
  console.log("Server listening to 1337, metrics exposed on /metrics endpoint")
);
