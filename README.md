# Parse Server BaaS Template

```mermaid
    graph LR
    A[Parse Server] -- PostgreSQL --> B((Database))
    A -- Application ID & Master Key --> C(API Server Template with Node Express)
    C -- parse module --> A
    C -- send queries --> A

```

* **Parse Server**: This is the core of the Parse Server app. It handles all requests from the Mermaid JS app and interacts with the PostgreSQL database to store and retrieve data.

* **PostgreSQL**: This is the database where all data is stored. Parse Server uses PostgreSQL to store data in a structured format.

* **Application ID and Master Key**: These are two unique identifiers that authenticate requests from the Mermaid JS app. The application ID and master key are generated when you create a Parse Server app.

* **API Server Template with Node**: This is the client-side application that interacts with Parse Server to retrieve, update, or create new data with our custom endpoint. The API Server Template app uses the parse module to communicate with Parse Server.

* **Parse module**: The parse module is a JavaScript library that provides an API for communicating with Parse Server. It simplifies the process of sending queries to Parse Server by handling authentication and error handling.

* **Send queries**: The API Server Template app sends queries to Parse Server using the parse module. For example, a query might retrieve all objects that match a certain criteria, update an existing object, or create a new object.

## To use ParseServer with PostgreSQL

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

## To perform an CRUD Operation in Parse

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
        localhost:3000/classes/SampleClass/

        /// Get certain record
        localhost:3000/classes/SampleClass/<objectId>

        ```

        ```js
        METHOD: POST

        localhost:3000/classes/SampleClass

        /// Sample json body
        {
            "name":"john doe",
            "age":22
        }
        ```

        ```js
        METHOD: PUT

        localhost:3000/classes/SampleClass/<objectId>
        
        /// Sample json body
        {
            "name":"john doe",
            "age":23
        }
        ```

        ```js
        METHOD: DELETE

        localhost:3000/classes/SampleClass/<objectId>
      
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
        localhost:3000/update-sample/    

      

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
        METHOD: PUT

        /// END POINT:
        /// Deleting certain record
        localhost:3000/delete-sample/    

      

        /// Deleting certain record
        const sampleClass = new Parse.Object('SampleClass');
        const objectId = req.params.objectId;
        sampleClass.id = objectId;

        const result = await sampleClass.destroy();
        res.send(result);
        ```

## Issue Encountered

* when using parse-dashboard on deployment, it will make the dashboard as deceptive website. Ongoing issue can be found [here](https://github.com/parse-community/parse-dashboard/issues/2392).

* Temporary Solution: add a standalone webservice that the only thing it will do is to access the dashboard, or simply dont use parse-dashboard anymore and just rely with the datatable.

## Setup Dockerfile and docker compose for parse-server-api ,database, parse-dashboard, and traefik

```mermaid
    graph LR
    A[Parse Server Docker API image] -- Deploy --> E[Docker Container]
    B[Parse Dashboard image] -- Deploy --> E[Docker Container]
    C[PostgreSQL Database image] -- Deploy --> E[Docker Container]
    D[Traefik] -- Deploy --> E[Docker Container]
    E[Docker Container] <--> F
    F[Traefix Host EG. api.hostname or dashboard.hostname] <-- Request/Response --> G[Client]
    G[Client] -- Application ID & Master Key --> F
    G[Client] -- parse module --> F
    G -- send queries --> F
    
```

* Create a `Dockerfile` inside project folder. This will make an image for our node express app. To build it we can simply run `docker build ./` or we can build the image during our docker compose.

    ```docker
    # Set the version of node to be used.
    FROM node:18.12.1

    # Make a working directory on /app path
    WORKDIR /app

    # Copy and install the package.json from local to ./ path
    COPY package*.json ./

    # Run NPM install command
    RUN npm install

    # Copy all local file to ./ path
    COPY .  .

    # Add environment port 
    ENV PORT=3000

    # Expose the port 
    EXPOSE 3000



    # Commands the container on how to run the application 
    CMD ["npm","start"]


    ```

* Create a `docker-compose.yml` inside our project folder. This will create an image of our services all at one and run the container.

    ```yaml
    version: '3.8'

    services:
    parse-server-api:
        build: .
        ports:
        - 3000:3000
        environment:
        - DATABASE_URI=postgres://postgres:samplepassword@db:5432/parse-sdk
        - APP_ID=template_baas_parse
        - MASTER_KEY=MasterKey
        - SERVER_URL=http://localhost:3000/parse # TOFIX: temporaryly use localhost:3000 until finding a better approach for local deployment
        - APP_NAME=Template BaaS Parse
        labels:
        - "traefik.enable=true"
        - "traefik.http.routers.parse-server-api.rule=Host(`api.localhost`)"
        - "traefik.http.routers.parse-server-api.entrypoints=http"
        - "traefik.http.middlewares.parse-https-redirect.redirectscheme.scheme=https"
        - "traefik.http.routers.parse.middlewares=parse-https-redirect"
        - "traefik.http.routers.parse-secure.rule=Host(`api.parse-template.com`)"
        - "traefik.http.routers.parse-secure.entrypoints=https"
        - "traefik.http.routers.parse-secure.tls=true"
        - "traefik.http.services.parse.loadbalancer.server.port=3000"
        depends_on:
        - traefik
        - db
    db:
        image: postgres
        container_name: parse-server-postgres
        environment:
        - POSTGRES_PASSWORD=samplepassword
        - POSTGRES_USER=sampleuser
        - POSTGRES_DB=parse-sdk
        volumes:
        - parse-server-postgres:/var/lib/postgresql/data
        ports:
        - 5432:5432
    parse-dashboard:
        image: parseplatform/parse-dashboard:latest
        environment:
        - PARSE_DASHBOARD_ALLOW_INSECURE_HTTP=1
        command: 
        - parse-dashboard --dev
        ports:
        - "4040:4040"
        volumes:
        - ./config/parse-dashboard-config.json:/src/Parse-Dashboard/parse-dashboard-config.json
        labels:
        - "traefik.enable=true"
        - "traefik.http.routers.parse-dashboard.rule=Host(`dashboard.localhost`)"
        - "traefik.http.routers.parse-dashboard.entrypoints=http"
        - "traefik.http.middlewares.dashboard-https-redirect.redirectscheme.scheme=https"
        - "traefik.http.routers.dashboard.middlewares=dashboard-https-redirect"
        - "traefik.http.routers.dashboard-secure.rule=Host(`dashboard.parse-template.com`)"
        - "traefik.http.routers.dashboard-secure.entrypoints=https"
        - "traefik.http.routers.dashboard-secure.tls=true"
        - "traefik.http.services.dashboard.loadbalancer.server.port=4040"
        depends_on:
        - parse-server-api
        - traefik
    traefik:
        image: traefik:v2.9
        command:
        - "--api.insecure=true"
        - "--providers.docker=true"
        ports:
        - "80:80"
        - "8080:8080"
        - "443:443"
        volumes:
        - "./letsencrypt:/letsencrypt"
        - "/var/run/docker.sock:/var/run/docker.sock:ro"
        restart: unless-stopped
    volumes:
    parse-server-postgres:


    ```

    on running creating a separate service for `parse-dashboard` we create a file on our config folder `config/parse-dashboard-config.json`. This json config will be copied inside the container and will be used as the configuration for our parse dashboard container. We can add as many apps/parse-server for this dashboard. The `serverURL` is pointed in configured host traefik path for our `parse-server-api`.

    ```json
    {
        "apps": [
        {
            "serverURL": "http://api.localhost/parse",
            "appId": "template_baas_parse",
            "masterKey": "MasterKey",
            "appName": "Template BaaS Parse"
        }
        ],
        "users": [
        {
            "user":"admin",
            "pass":"admin1"
        }
        ]
    }
  
    ```

    After setting all up. Run `docker-compose up`. This will create/download a image and run the container.
