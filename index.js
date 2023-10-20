/*
|--------------------------------------------------------------------------
| Main
|--------------------------------------------------------------------------
|
| This is the entry point for the parse instance
|
*/
const express = require("express");
const ParseServer = require("parse-server").ParseServer;

/// load .env
require("dotenv").config();

/// parse server config
const parseServer = new ParseServer({
  databaseURI: process.env.DATABASE_URI,
  appId: process.env.APP_ID,
  masterKey: process.env.MASTER_KEY,
  serverURL: process.env.SERVER_URL,
  publicServerURL: process.env.SERVER_URL,
  masterKeyIps: ["0.0.0.0/0", "::/0"],
  allowClientClassCreation: true,
  allowExpiredAuthDataToken: true,
  encodeParseObjectInCloudFunction: true,
});

/// create express router
const app = express();
app.use(express.json());
app.use("/parse", parseServer.app); // serve the Parse API on the /parse URL prefix

app.get("/", (req, res) => {
  res.send({ alive: true });
});

// sample module
app.post("/create-sample", async (req, res) => {
  const sampleClass = new Parse.Object("SampleClass");
  const sampleName = req.body["name"];
  const sampleAge = req.body["age"];

  sampleClass.set("name", sampleName);
  sampleClass.set("age", sampleAge);
  const result = await sampleClass.save();

  res.send(result);
});
app.get("/get-sample/", async (req, res) => {
  const sampleClass = new Parse.Query("SampleClass");

  const results = await sampleClass.find();

  res.send(results);
});
app.get("/get-sample/:objectId", async (req, res) => {
  const objectId = req.params.objectId;
  const sampleClass = new Parse.Object("SampleClass");
  sampleClass.id = objectId;

  const result = await sampleClass.fetch();

  res.send(result);
});
app.put("/update-sample/:objectId", async (req, res) => {
  const sampleClass = new Parse.Object("SampleClass");
  const objectId = req.params.objectId;
  const sampleUpdatedName = req.body["name"];
  const sampleUpdatedAge = req.body["age"];

  sampleClass.id = objectId;

  sampleClass.set("name", sampleUpdatedName);
  sampleClass.set("age", sampleUpdatedAge);

  const result = await sampleClass.save();
  res.send(result);
});
app.delete("/delete-sample/:objectId", async (req, res) => {
  const sampleClass = new Parse.Object("SampleClass");
  const objectId = req.params.objectId;
  sampleClass.id = objectId;

  const result = await sampleClass.destroy();
  res.send(result);
});

/// start parse server
parseServer.start();
const port = process.env.APP_PARSE_PORT || 4000;
app.listen(port, function () {
  console.log(`Server is running...`);
});
