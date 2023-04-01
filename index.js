const express = require('express');

const ParseServer = require('parse-server').ParseServer;
const ParseDashboard = require('parse-dashboard');

// Load .env
require('dotenv').config();

// Parse server config
const parseServer = new ParseServer({
    databaseURI: process.env.DATABASE_URI,
    appId: process.env.APP_ID,
    masterKey: process.env.MASTER_KEY,
    serverURL: process.env.SERVER_URL,
    publicServerURL: process.env.SERVER_URL,
});

// Parse dashboard config
const dashboard = new ParseDashboard({
    "apps": [
        {
            "serverURL": process.env.SERVER_URL,
            "appId": process.env.APP_ID,
            "masterKey": process.env.MASTER_KEY,
            "appName": process.env.APP_NAME,
        }
    ],
    "users": [
        {
            "user": process.env.DASHBOARD_USER || 'admin',
            "pass": process.env.DASHBOARD_PASSWORD || 'admin1'
        },
    ],
});

const app = express();

/// Read request body
app.use(express.json())

// Serve the Parse Dashboard on the /dashboard URL prefix
app.use('/dashboard', dashboard);

// Serve the Parse API on the /parse URL prefix
app.use('/parse', parseServer.app);


// Get all records
app.get('/get-sample/', async (req, res) => {
    const sampleClass = new Parse.Query('SampleClass');

    const results = await sampleClass.find();

    res.send(results);
});

// Get certain records
app.get('/get-sample/:objectId', async (req, res) => {
    const objectId = req.params.objectId;
    const sampleClass = new Parse.Object('SampleClass');
    sampleClass.id = objectId;

    const result = await sampleClass.fetch();

    res.send(result);
});


app.post('/create-sample', async (req, res) => {
    const sampleClass = new Parse.Object('SampleClass');
    const sampleName = req.body['name'];
    const sampleAge = req.body['age'];

    sampleClass.set('name', sampleName);
    sampleClass.set('age', sampleAge);
    const result = await sampleClass.save();

    res.send(result);
});

// Update certain record
app.put('/update-sample/:objectId', async (req, res) => {
    const sampleClass = new Parse.Object('SampleClass');
    const objectId = req.params.objectId;
    const sampleUpdatedName = req.body['name'];
    const sampleUpdatedAge = req.body['age'];

    sampleClass.id = objectId;

    sampleClass.set('name', sampleUpdatedName);
    sampleClass.set('age', sampleUpdatedAge);

    const result = await sampleClass.save();
    res.send(result);

});


// Start parse server
parseServer.start();

const port = process.env.PORT || 3000;


app.listen(port, function () {
    console.log(`Server is running...`);
});