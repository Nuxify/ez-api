# EZ API

A Backend-as-a-Service (BaaS) template using Parse Server.

## A. Structure
```mermaid
    graph LR
    A[Parse Server] -- PostgreSQL --> B((Database))
    A -- Application ID & Master Key --> C(API Server Template with Node Express)
    C -- parse module --> A
    C -- send queries --> A

```

* **Parse Server**: This is the core of the Parse Server app. It handles all requests from the API Server Template app and interacts with the PostgreSQL database to store and retrieve data.

* **PostgreSQL**: This is the database where all data is stored. Parse Server uses PostgreSQL to store data in a structured format.

* **Application ID and Master Key**: These are two unique identifiers that authenticate requests from the API Server Template app. The application ID and master key are generated when you create a Parse Server app.

* **API Server Template with Node**: This is the client-side application that interacts with Parse Server to retrieve, update, or create new data with our custom endpoint. The API Server Template app uses the parse module to communicate with Parse Server.

* **Parse module**: The parse module is a JavaScript library that provides an API for communicating with Parse Server. It simplifies the process of sending queries to Parse Server by handling authentication and error handling.

* **Send queries**: The API Server Template app sends queries to Parse Server using the parse module. For example, a query might retrieve all objects that match a certain criteria, update an existing object, or create a new object.

## B. Connect to Database (Only PostgreSQL and MongoDB are supported)

* Install PostgreSQL Locally. [Install here.](https://www.postgresql.org/download/)

* Install NodeJS and NPM. [Install here.](https://nodejs.org/en/)

* In terminal install parse server globally with this command: `npm install -g parse-server`

* In PostgreSQL, create a database and extract the URI of the databse server to be use in parse server. To get the URI of the postgres database. Follow this format:
    `<database_provider>://<username>:<pass>@<host_name>:<port>/<database_name>`

    Example. `postgres://postgres:0000@localhost:5432/octopus_sdk`

* Create file `index.js`: For a full list of available options, run `parse-server --help` or take a look at Parse Server [Configurations](https://parseplatform.org/parse-server/api/master/ParseServerOptions.html).

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

* (OPTIONAL) Parse Server Dashboard configuration. For database GUI.

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

* Now you can navigate to the gui by navigating to `localhost:3000/dashboard`

## C. Calling Parse API from Client

In parse, there are two option in which we can perform a CRUD operation.  **REST API** (default) or you can make you of **Parse SDK** by creating an end point. You can read more on how to perform REST API with parse [here](http://docs.parseplatform.org/rest/guide/) and for Javascript SDK [here](https://github.com/parse-community/Parse-SDK-JS).

* REST API
    1. thing to do when using parse as REST API set the header to

        `X-Parse-Application-Id: APP_ID` and `Content-Type:application/json` (OPTIONAL) for POST and PUT

    2. In mounted parseServerApp path, it is the target for the queries. EG. `/parse` . To perform read, set the method to **GET** and ping `<host_name>:<port>/parse/classes/<target_class>`.
        * host_name: the unique identifier that serves as name of your computer or server
        * port:  number is a number assigned to uniquely identify a connection endpoint
        * classes: by default when using REST API, it will use the tables or classes for parse server.
        * target_class: name of the class you want to target.
        * objectId: id of the record from the database.

        ```js
        METHOD: GET

        /// Get all record
        localhost:3000/parse/classes/SampleClass/

        /// Get certain record
        localhost:3000/parse/classes/SampleClass/<objectId>

        ```

        ```js
        METHOD: POST

        localhost:3000/parse/classes/SampleClass

        /// Sample json body
        {
            "name":"john doe",
            "age":22
        }
        ```

        ```js
        METHOD: PUT

        localhost:3000/parse/classes/SampleClass/<objectId>
        
        /// Sample json body
        {
            "name":"john doe",
            "age":23
        }
        ```

        ```js
        METHOD: DELETE

        localhost:3000/parse/classes/SampleClass/<objectId>
      
        ```

* Parse JS Sdk.

    1. thing to do is to target the class we wish to perform some query. EG. `const sampleClass = new Parse.Query('SampleClass');`

    2. now we have to create an end point with different methods to trigger the different action for the sdk.

       ```js
        METHOD: GET

        /// END POINTS:
        /// Get all record
        localhost:3000/get-sample/    
        localhost:3000/get-sample/<objectId>

      

        /// Getting all record
        const sampleClass = new Parse.Query('SampleClass');

        const results = await sampleClass.find();

        res.send(results);

        /// Getting certain record

        const objectId = req.params.objectId;
        const sampleClass = new Parse.Object('SampleClass');
        sampleClass.id = objectId;

        const result = await sampleClass.fetch();

        res.send(result);

        ```

        ```js
        METHOD: POST

        /// END POINT:
        /// Creating a record
        localhost:3000/create-sample/    

      

        /// Creating a record
        const sampleClass = new Parse.Query('SampleClass');
        const sampleName = req.body['name'];
        const sampleAge = req.body['age'];

        sampleClass.set('name', sampleName);
        sampleClass.set('age', sampleAge);
        const result = await sampleClass.save();

        res.send(result);

        ```

         ```js
        METHOD: PUT

        /// END POINT:
        /// Updating a record
        localhost:3000/update-sample/<objectId>

      

        /// Updating a record
        const sampleClass = new Parse.Object('SampleClass');
        const objectId = req.params.objectId;

        const sampleUpdatedName = req.body['name'];
        const sampleUpdatedAge = req.body['age'];

        sampleClass.id = objectId;

        sampleClass.set('name', sampleUpdatedName);
        sampleClass.set('age', sampleUpdatedAge);

        const result = await sampleClass.save();
        res.send(result);

        ```

        ```js
        METHOD: DELETE

        /// END POINT:
        /// Deleting certain record
        localhost:3000/delete-sample/<objectId>

      

        /// Deleting certain record
        const sampleClass = new Parse.Object('SampleClass');
        const objectId = req.params.objectId;
        sampleClass.id = objectId;

        const result = await sampleClass.destroy();
        res.send(result);
        ```

## D. Known Issues

* when using parse-dashboard on deployment, it will make the dashboard as deceptive website. Ongoing issue can be found [here](https://github.com/parse-community/parse-dashboard/issues/2392).

* Temporary Solution: add a standalone webservice that the only thing it will do is to access the dashboard, or simply dont use parse-dashboard anymore and just rely with the datatable.

Made with ❤️ at [Nuxify](https://nuxify.tech)
