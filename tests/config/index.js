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
      token: 'token1234',
      'nem-address': 'MDFEWRWERWERWREEW',
      address: 'af342432',
      proxyPort: 3001
    }
});