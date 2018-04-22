/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

const when = require('when'),
  _ = require('lodash'),
  fs = require('fs-extra'),
  bcrypt = require('bcryptjs');

let settings = {},
  flows = {};


module.exports = {
  type: 'credentials',
  init: (globalSettings)=>{
    settings = globalSettings;
    flows = fs.readJsonSync('flows.json');
    return when.resolve();
  },
  users: function (username) {
    return when.resolve((async () => {
      let user =  _.chain(flows).get('noderedusers').find({username: username, isActive: true}).value();
      return user ?
        {username: user.username, permissions: user.permissions} : null;
    })());
  },
  authenticate: function (username, password) {
    return when.resolve((async () => {
      let user =  _.chain(flows).get('noderedusers').find({username: username, isActive: true}).value();
      return user && bcrypt.compare(password, user.password) ?
        {username: user.username, permissions: user.permissions} : null;

    })());
  },
  default: function () {
    return when.resolve({anonymous: false});
  }
};
