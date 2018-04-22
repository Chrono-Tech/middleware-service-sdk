/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 licenses.
 */

require('dotenv').config();

const config = require('../../config'),
  path = require('path'),
  fs = require('fs-extra'),
  _ = require('lodash'),
  requireAll = require('require-all');

module.exports = async (uri, folder) => {

  const migrations = _.values(
    requireAll({
      dirname: path.resolve(folder),
      recursive: false,
      filter: /(.+)\.js$/
    })
  );

  const migrationSet = {};

  const collectionInitter = (collectionName, id) => {
    return {
      insert: (data) => {
        migrationSet[collectionName] = migrationSet[collectionName] || [];
        migrationSet[collectionName].push(data);
        migrationSet.migrations = migrationSet.migrations || [];
        migrationSet.migrations.push(id);
      },
      update: (criteria, data) => {
        migrationSet[collectionName] = migrationSet[collectionName] || [];

        let record = _.find(migrationSet[collectionName], criteria);

        if (!record) {
          record = _.chain(criteria).cloneDeep().merge({meta: {}, type: 'flows'}).value();
        }

        _.pull(migrationSet[collectionName], record);
        record = _.chain(record).pick(['path', 'type', 'meta']).merge(data.$set).value();
        migrationSet[collectionName].push(record);
        migrationSet.migrations.push(id);

      }
    }
  };

  for (let migration of migrations)
    migration.up.bind({
      db: {
        collection: (collectionName) => collectionInitter(collectionName, migration.id)
      }
    })();

  await fs.outputJson('flows.json', migrationSet);

};

require('make-runnable');
