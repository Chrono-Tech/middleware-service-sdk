/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 licenses.
 */

const  _ = require('lodash'),
  request = require('request-promise'),
  mongoose = require('mongoose');

const getAddressesFromLaborx = async (providerPath, msg) => {
  const response = await request({
    method: 'POST',
    uri: providerPath + '/signin/signature/chronomint',
    json: true,
    headers: {
      'Authorization': msg.req.headers.authorization
    }
  });
  if (!_.get(response, 'addresses')) 
    throw new Error('not found addresses from auth response ' + response);
  return response.addresses;
};

const getAddressesFromMongo = async (profileModel, token) => {
  const profile = await profileModel.findOne({token});
  if (profile) 
    return profile.addresses;
  return null;
};

const saveAddressesToMongo = async (profileModel, token, addresses) => {
  await profileModel.findOneAndUpdate({token}, {$set: {addresses}}, {
    upsert: true,
    setDefaultsOnInsert: true
  });
};

const isAuth = (msg) => { return _.get(msg.req, 'headers.authorization', '') !== ''; };

const isToken = (nameToken) => { 
  return nameToken === 'Bearer';
};

module.exports = function (RED) {
  function ExtractCall (redConfig) {
    RED.nodes.createNode(this, redConfig);
    let node = this;

    const ctx =  node.context().global;
    const useCache = _.get(ctx.settings, 'laborx.useCache') || true;

    let dbAlias, tableName, connection;
    if (useCache) {
      dbAlias = _.get(ctx.settings, 'laborx.dbAlias') || 'accounts';
      tableName = _.get(ctx.settings, 'laborx.profileModel') || 'ctxProfile';
      connection = _.get(
        ctx,
        `connections.primary.${dbAlias}`
      ) || mongoose;
    }
    
    const providerPath = redConfig.configprovider === '0' ? redConfig.providerpath : 
      _.get(ctx.settings, 'laborx.authProvider') || 'http://localhost:3001/api/v1/security';

    this.on('input', async  (msg) => {
      let models, origName, profileModel;
      if (useCache) {
        models = (connection).modelNames();
        origName = _.find(models, m => m.toLowerCase() === tableName.toLowerCase());
        if (!origName) {
          msg.error = {message: 'not right profileModel'};
          return this.error('not found profileModel in connections', msg);
        }
        profileModel = connection.models[origName];
      }

      if (!isAuth(msg)) {
        msg.statusCode = '400';
        return this.error('Not set authorization headers', msg);
      }

      const authorization = _.get(msg, 'req.headers.authorization');
      const params = authorization.split(' ');
      if (useCache && isToken(params[0])) {
        msg.addresses = await getAddressesFromMongo(profileModel, params[1]);
        if (msg.addresses) 
          return node.send(msg);
      }

      try {
        let addresses = await getAddressesFromLaborx(providerPath, msg);
        msg.addresses = addresses;
        if (useCache && isToken(params[0])) 
          await saveAddressesToMongo(profileModel, params[1], addresses);
      } catch (err) {
        msg.statusCode = '401';
        msg.error = err;
        return this.error('ERROR', msg);
      }

      node.send(msg);
    });
  }

  RED.nodes.registerType('laborx_auth', ExtractCall);
};
