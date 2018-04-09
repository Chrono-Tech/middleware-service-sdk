/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 licenses.
 */

require('dotenv').config();

const mm = require('mongodb-migrations'),
  config = require('./config'),
  path = require('path'),
  bunyan = require('bunyan'),
  _ = require('lodash'),
  requireAll = require('require-all'),
  Promise = require('bluebird'),
  log = bunyan.createLogger({name: 'migrator'});

module.exports.run = async (uri = config.nodered.mongo.uri, folder = config.nodered.migrationsDir, collection = '_migrations') => {

  const migrations = _.values(
    requireAll({
      dirname: path.resolve(folder),
      recursive: false,
      filter: /(.+)\.js$/
    })
  );

  let migrator = new mm.Migrator({
    url: uri,
    test: 123,
    directory: 'migrations',
    collection: collection
  }, (level, message) => log.info(level, message));

  migrator.test = 123;

  const filteredMigrations = _.sortBy(migrations, item => parseInt(item.id.split('.')[0]));

  migrator.bulkAdd(filteredMigrations);
  await Promise.promisifyAll(migrator).migrateAsync();
  migrator.dispose();
};

require('make-runnable');
