/** 
* Copyright 2017–2018, LaborX PTY
* Licensed under the AGPL Version 3 license.
* @author Kirill Sergeev <cloudkserg11@gmail.com>
*/

const config = require('../config/index'),
  path = require('path'),
  migrator = require('../index').migrator,
  _ = require('lodash'),
  redInitter = require('../index').init;

const init = async () => {

  if (config.nodered.autoSyncMigrations)
    await migrator.run(config.nodered.mongo.uri, path.join(__dirname, 'migrations'));

  redInitter(config);
};

module.exports = init();
