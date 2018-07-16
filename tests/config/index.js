/** 
* Copyright 2017–2018, LaborX PTY
* Licensed under the AGPL Version 3 license.
* @author Kirill Sergeev <cloudkserg11@gmail.com>
*/
const config = require('../../config'),
    path = require('path'),
    _ = require('lodash');

module.exports = _.merge(config, {
    nodered: {
      useLocalStorage: true,
      httpAdminRoot: '/admin',
      migrationsDir: path.join(__dirname, '../migrations'),
    },
    dev: {
      signature: '',
      'nem-address': 'MDFEWRWERWERWREEW',
      'ethereum-public-key': 'af342432',
      'user': 11
    }
});