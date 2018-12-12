/** 
* Copyright 2017–2018, LaborX PTY
* Licensed under the AGPL Version 3 license.
* @author Kirill Sergeev <cloudkserg11@gmail.com>
*/

const config = require('../config'),
  mongoose = require('mongoose'),
  path = require('path'),
  migrator = require('../../index').migrator,
  redInitter = require('../../index').init;

const init = async () => {

  mongoose.connect(config.nodered.mongo.uri, {useMongoClient: true});
  require('require-all')({
    dirname: path.join(__dirname, '../models'),
    filter: /(.+Model)\.js$/,
    resolve: Model => {
      return Model.init(config.nodered.mongo);
    }
  });

  if (config.nodered.autoSyncMigrations)
    await migrator.run(
      config, 
      path.join(__dirname, '../', 'migrations'), null, true);

  redInitter(config);
};
module.exports = init();
