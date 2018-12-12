/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 * @author Kirill Sergeev <cloudkserg11@gmail.com>
 */
require('dotenv').config();
const config = require('../../config'),
  path = require('path'),
  _ = require('lodash');

module.exports = _.merge(config, {
  mongo: {
    accounts: {
      uri: process.env.MONGO_URI || 'mongodb://localhost:27017/data',
      collectionPrefix: 'sdk'
    },
    data: {
      uri: process.env.MONGO_URI || 'mongodb://localhost:27017/data',
      collectionPrefix: 'sdk',
      useData: 1
    },
    profileModelName: 'profileModel'
  },
  nodered: {
    useLocalStorage: true,
    httpAdminRoot: '/admin',
    migrationsDir: path.join(__dirname, '../migrations'),
    mongo: {
      uri: process.env.MONGO_URI || 'mongodb://localhost:27017/data'
    },
    functionGlobalContext: {
      settings: {
        rabbit: {
          url: process.env.RABBIT_URI || 'amqp://localhost:5672',
          serviceName: process.env.RABBIT_SERVICE_NAME || 'app_sdk'
        },
        laborx: {
          useAuth: true
        }
      }
    }
  },
  rest: {
    auth: true
  },
  dev: {
    proxyPort: 3001,
    signature: 'token123',
    'nem-address': 'MDFEWRWERWERWREEW',
    'ethereum-public-key': 'af342432',
    'user': 11
  }
});
