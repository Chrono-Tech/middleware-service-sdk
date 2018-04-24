/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 licenses.
 */

require('dotenv').config();

const config = require('./config'),
  migrateLocalService = require('./services/local/migrateLocalService'),
  migrateMongoService = require('./services/mongo/migrateMongoService');

module.exports.run = async (uri = config.nodered.mongo.uri, folder = config.nodered.migrationsDir, collection = '_migrations', useLocalStorage = false) => {

  useLocalStorage ? await migrateLocalService(uri, folder) : await migrateMongoService(uri, folder, collection)
};

require('make-runnable');
