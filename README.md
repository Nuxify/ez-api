# Parse Server BaaS Template

## To use ParseServer with PostgreSQL

- Install PostgreSQL Locally. [Install here.](https://www.postgresql.org/download/)

- Install NodeJS and NPM. [Install here.](https://nodejs.org/en/)

- In terminal install parse server globally with this command: `npm install -g parse-server`

- In PostgreSQL, create a database and extract the URI of the databse server to be use in parse server. To get the URI of the postgres database. Follow this format:
    `<database_provider>://<username>:<pass>@<host_name>:<port>/<database_name>`

    Example. `postgres://postgres:0000@localhost:5432/octopus_sdk`

- Create file `index.js`: For a full list of available options, run `parse-server --help` or take a look at Parse Server [Configurations](https://parseplatform.org/parse-server/api/master/ParseServerOptions.html).

    ```js
    const express = require('express');

    const ParseServer = require('parse-server').ParseServer;

    const parseServer = new ParseServer({
        databaseURI: process.env.DATABASE_URI,
        appId: process.env.APP_ID,
        masterKey: process.env.MASTER_KEY,
        serverURL: process.env.SERVER_URL,
        publicServerURL: process.env.SERVER_URL,
    });

    const app = express();

    // Serve the Parse API on the /parse URL prefix
    const mountPath = process.env.PARSE_MOUNT || '/parse';

    // Serve the Parse API on the /parse URL prefix
    app.use(mountPath, parseServer.app);

   // Start parse server
    parseServer.start();

    const port = process.env.PORT || 3000;


    app.listen(port, function () {
        console.log(`Server is running...`);
    });

    ```

- (OPTIONAL) Parse Server Dashboard configuration. For database GUI.

    ```js
    // Parse dashboard config
    const configDashboard = {
        "apps": [
            {
            "serverURL": process.env.SERVER_URL,
            "appId": process.env.APP_ID,
            "masterKey": process.env.MASTER_KEY,
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

    const dashboard = new ParseDashboard(configDashboard);

    app.use('/dashboard', dashboard);

    ```

- Now you can navigate to the gui by navigating to `localhost:3000/dashboard`
