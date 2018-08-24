const express = require("express");
const app = express();

app.get("/", (req, res) => res.send("Hello World!"));
app.get("/decipher", (req, res) => res.send("Hello Decipher!"));

app.listen(1337, () =>
  console.log("Server listening to 1337, metrics exposed on /metrics endpoint")
);

const client = require("prom-client");

const collectDefaultMetrics = client.collectDefaultMetrics;
const Registry = client.Registry;

const register = new Registry();
app.get("/metrics", (req, res) => {
  res.set("Content-Type", register.contentType);
  res.end(register.metrics());
});

// Probe every 5th second.
collectDefaultMetrics({ register, timeout: 5000 });
