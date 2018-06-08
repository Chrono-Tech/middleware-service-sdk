# middleware-service-sdk

Middleware service for which expose rest api

### Installation

This module is a part of middleware services. It's library and use it only through node_modules
Write in package.json:
``` 
  "dependencies": {
    "middleware_service.sdk": "github:chronobank/middleware-service-sdk"
```
then 
```
npm i
```

#### About

This module works on the basis of Node-Red. As is known, Node-red is  a programming tool for wiring together hardware devices, APIs and online services. Middleware-service-sdk extends the standard sets of components of Node-red such as.

#### New components

| type of node | name of node | description |
| ------------ | ------------ | ----------- |
| input        | amqp         | AMQP input node. Connects to a server and subscribes to the specified exchange or queue
| output       | amqp         | AMQP output node. Connects to a server and delivers the message payload to the specified exchange or queue
| function     | async function| A JavaScript function block to run against the messages being received by th node
| connectors   | mongo        | single mongoose query connector
| utils        | query to mongo | converts query params to mongo like query

#### How it work

This module uses mongoDB as a database. Module creates 3 collections:  migrations, noderedstorage and  nodereduser.
 
Collection 'migrations' keeps id flows which was subjected to migration.
Collection 'noderedstorages' keeps all created flows.
Collection 'noderedusers' keeps information about an admin.

In order to start a service we tentatively need to add an admin`s record to the noderedusers collection. And after that we can start to work.

After deploying your flow it will save in your project, by default it is a folder 'migration'. Also it saves in a database in the noderedstoreges collection.

After service restart, he will upload earlier created flows.

In the event if you need to import your flows in the another database, there is a migration tool in the service-sdk.

#### Example

Let`s make simple API where we can register our new wallet addresses.

Step by step:

1) add 'http end-point' component - it is our request and name it 'create addr'

![create_addr](resource/created_addr.png)

2) add service-sdk - 'amqp in' component to be connected to the rabbitmq queue/exchange, named it 'post addresses'

![amqp_in](resource/amqp_in.png)

3) add 'function' component for the 'amqp in'

![function_amqp_in](resource/function_for_amqp.png)

4) add 'function' component that will allow us to process the request to add new addresses

![request_handler](resource/Request_handler.png)

5) add service-sdk - 'mongo' component that will save our new record in the mongoDB

![mongo](resource/mongo.png)

6) add 'switch' component that will route messages for respond and event in rabbitmq

7) add 'function' component that will forms the answer for responce

![function_for_responce](resource/function_for_responce.png)

8) add 'function' component that will forms event in rabbitmq

![function_for_amqp](resource/function_for_rabbitmq.png)

9) Finally, add the 'http responce' and 'amqp out' components, where 'http responce' send responce and 'amqp out' send event to rabbitmq

![finally](resource/Finall.png)

10) We can deploy our flow 

##### сonfigure this module

To apply your configuration, send this variables to redInitter in config.nodered
```
const config = require('config');
const redInitter = require('middleware_service.sdk').init;
const migrator = require('middleware_service.sdk').migrator;

 if (config.nodered.autoSyncMigrations)
   await migrator.run(config.nodered.mongo.uri, path.join(__dirname, 'migrations'));

 redInitter(config);
 ```
 
 What variables you need save in config.nodered
 
 ```
     mongo: {
      uri: <String>,
      collectionPrefix: <String>,
    },
    autoSyncMigrations: <Boolean>,
    customNodesDir: [<String>],
    migrationsInOneFile: <Boolean>,
    useLocalStorage: <Boolean>,
    
    migrationsDir: <String>,
    functionGlobalContext: {
      <Context for your functions>
    }
 ```

Below is the expamle configuration:

```
    mongo: {
      uri: process.env.NODERED_MONGO_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/data',
      collectionPrefix: process.env.NODE_RED_MONGO_COLLECTION_PREFIX || '',
    },
    autoSyncMigrations: process.env.NODERED_AUTO_SYNC_MIGRATIONS || true,
    customNodesDir: [path.join(__dirname, '../')],
    migrationsInOneFile: false,
    useLocalStorage: false,
    
    migrationsDir: path.join(__dirname, '../migrations'),
    functionGlobalContext: {
      factories: {
        sm: require('../factories/sc/smartContractsFactory')
      },
      'truffle-contract': require('truffle-contract'),
      connections: {
        primary: mongoose
      },
      settings: {
        mongo: {
          accountPrefix: process.env.MONGO_ACCOUNTS_COLLECTION_PREFIX || process.env.MONGO_COLLECTION_PREFIX || 'eth',
          collectionPrefix: process.env.MONGO_DATA_COLLECTION_PREFIX || process.env.MONGO_COLLECTION_PREFIX || 'eth'
        },
        rabbit: {
          url: process.env.RABBIT_URI || 'amqp://localhost:5672',
          serviceName: process.env.RABBIT_SERVICE_NAME || 'app_eth'
        }
      }
    }

```

License
----
 [GNU AGPLv3](LICENSE)

Copyright
----
LaborX PTY
