require('dotenv').config();

const config = require('./config'),
  path = require('path'),
  bunyan = require('bunyan'),
  migrateLocalService = require('./services/local/migrateLocalService'),
  migrateMongoService = require('./services/mongo/migrateMongoService'),
  _ = require('lodash'),
  Promise = require('bluebird'),
  log = bunyan.createLogger({name: 'migrator'});

module.exports.run = async (uri = config.nodered.mongo.uri, folder = config.nodered.migrationsDir, collection = '_migrations') => {

  config.nodered.useLocalStorage ? await migrateLocalService(uri, folder) : await migrateMongoService(uri, folder, collection)


};

require('make-runnable');
