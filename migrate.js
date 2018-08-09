/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 licenses.
 */

require('dotenv').config();

const migrateLocalService = require('./services/local/migrateLocalService'),
  migrateMongoService = require('./services/mongo/migrateMongoService');

module.exports.run = async (
  config = {
    nodered: {
      useLocalStorage: false,
      migrationsInOneFile: true,
      mongo: {uri: ''}
    }
  },
  folder,
  collection = '_migrations'
) => {
  const useLocalStorage = config.nodered.useLocalStorage || false;
  const uri = config.nodered.mongo.uri;
  const clearMongo = config.nodered.migrationsInOneFile || false;
  useLocalStorage ? 
    await migrateLocalService(uri, folder) : 
    await migrateMongoService(uri, folder, collection, clearMongo);
};

require('make-runnable');
