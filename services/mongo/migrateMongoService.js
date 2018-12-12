/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 licenses.
 */

require('dotenv').config();

const mm = require('mongodb-migrations'),
  path = require('path'),
  bunyan = require('bunyan'),
  _ = require('lodash'),
  requireAll = require('require-all'),
  clearMongoMigration = require('../../migrations/clearMongo'),
  Promise = require('bluebird'),
  log = bunyan.createLogger({name: 'migrator'});


const clearMigrations = async (uri, collection) => {
  let migrator = new mm.Migrator({
    url: uri,
    collection: collection
  }, (level, message) => log.info(level, message));

  migrator.add(clearMongoMigration);
  await Promise.promisifyAll(migrator).migrateAsync();
  migrator.dispose();
};

module.exports = async (uri, folder, collection, clearMongo) => {

  const migrations = _.values(
    requireAll({
      dirname: path.resolve(folder),
      recursive: false,
      filter: /(.+)\.js$/
    })
  );

  if (clearMongo)
    await clearMigrations(uri, collection);

  const migrator = new mm.Migrator({
    url: uri,
    directory: 'migrations',
    collection: collection
  }, (level, message) => log.info(level, message));

  const filteredMigrations = _.sortBy(
    migrations, item => parseInt(item.id.split('.')[0])
  );

  migrator.bulkAdd(filteredMigrations);
  await Promise.promisifyAll(migrator).migrateAsync();
  migrator.dispose();
};

require('make-runnable');
