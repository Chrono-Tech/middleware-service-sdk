/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

const NodeRedUserModel = require('../../models/nodeRedUserModel'),
  when = require('when'),
  bcrypt = require('bcryptjs');

module.exports = {
  type: 'credentials',
  init: (globalSettings)=>{},
    users: function (username) {
    return when.resolve((async () => {

      let user = await NodeRedUserModel.model.findOne({username: username, isActive: true});

      return user ?
        {username: user.username, permissions: user.permissions} : null;
    })());
  },
  authenticate: function (username, password) {
    return when.resolve((async () => {
      let user = await NodeRedUserModel.model.findOne({username: username, isActive: true});
      return user && bcrypt.compare(password, user.password) ?
        {username: user.username, permissions: user.permissions} : null;

    })());
  },
  default: function () {
    return when.resolve({anonymous: false});
  }
};
