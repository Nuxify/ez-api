const express = require('express');

const ParseServer = require('parse-server').ParseServer;
const ParseDashboard = require('parse-dashboard');

const databaseUri = 'postgres://postgres:0000@localhost:5432/octopus_sdk';

const appId = process.env.APP_ID || 'myAppId';

if (!databaseUri) {
    console.log('DATABASE_URI not specified, falling back to localhost.');
}

// Parse server config
const config = {
    databaseURI: databaseUri || 'mongodb://localhost:27017/dev',
    appId: appId,
    masterKey: process.env.MASTER_KEY || 'MasterKey', //Add your master key here. Keep it secret!
    serverURL: process.env.SERVER_URL || 'http://localhost:3000/parse', // Don't forget to change to https if needed
    appName: process.env.SERVER_URL ?? 'Octopus',
    publicServerURL: process.env.SERVER_URL || 'http://localhost:3000/parse',
};

// Parse dashboard config
const configDashboard = {
    "apps": [
        {
            "serverURL": process.env.SERVER_URL || 'http://localhost:3000/parse',
            "appId": appId,
            "masterKey": process.env.MASTER_KEY || 'MasterKey',
            "appName": "First Parse server",

        }
    ],
    "users": [
        {
            "user": process.env.DASHBOARD_USER || 'admin',
            "pass": process.env.DASHBOARD_PASSWORD || 'admin1'
        },
    ],
}

const app = express();


const dashboard = new ParseDashboard(configDashboard);

app.use('/dashboard', dashboard);

// Serve the Parse API on the /parse URL prefix
const mountPath = process.env.PARSE_MOUNT || '/parse';

/// parse server api
const api = new ParseServer(config);

const port = process.env.PORT || 3000;

let httpServer = require('http').createServer(app);
httpServer.listen(port);