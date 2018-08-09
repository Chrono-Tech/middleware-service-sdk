/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 licenses.
 */

const  _ = require('lodash'),
  request = require('request-promise'),
  Promise = require('bluebird'),
  mongoose = require('mongoose');


const TIMEOUT = 10000;

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

const findModel = (connection, tableName, msg) => {
  models = (connection).modelNames();
  origName = _.find(models, m => m.toLowerCase() === tableName.toLowerCase());
  if (!origName) {
    msg.error = {message: 'not right profileModel'};
    return this.error('not found profileModel in connections', msg);
  }
  return connection.models[origName];
};

const getAddressesFromMongo = async (profileModel, token) => {
  const profile = await profileModel.findOne({token});
  return _.get(profile, 'addresses', null);
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

const checkAuth = async (msg, useCacheConfig, profileModel, providerPath) => {
  const authorization = _.get(msg, 'req.headers.authorization');
  const params = authorization.split(' ');
  const useCache = (useCacheConfig && isToken(params[0]));
  if (useCache) {
    msg.addresses = await getAddressesFromMongo(profileModel, params[1]);
    if (msg.addresses) 
      return msg;
  }
  
  let addresses = await getAddressesFromLaborx(providerPath, msg);
  msg.addresses = addresses;
  if (useCache) 
    await saveAddressesToMongo(profileModel, params[1], addresses);
  return msg;
}

module.exports = function (RED) {
  function ExtractCall (redConfig) {
    RED.nodes.createNode(this, redConfig);
    let node = this;

    const ctx =  node.context().global;
    const useCacheConfig = _.get(ctx.settings, 'laborx.useCache') || true;

    let dbAlias, tableName, connection;
    if (useCacheConfig) {
      dbAlias = _.get(ctx.settings, 'laborx.dbAlias') || 'profile';
      tableName = _.get(ctx.settings, 'laborx.profileModel') || 'ctxProfile';
      connection = _.get(
        ctx,
        `connections.primary.${dbAlias}`
      ) || mongoose;
    }
    
    this.on('input', async  (msg) => {
      let profileModel;
      if (useCacheConfig) {
        profileModel = findModel(connection, tableName, msg)
      }

      if (!isAuth(msg)) {
        msg.statusCode = '400';
        return this.error('Not set authorization headers', msg);
      }

      const providerPath = redConfig.configprovider === '0' ? redConfig.providerpath : 
        _.get(ctx.settings, 'laborx.authProvider') || 'http://localhost:3001/api/v1/security';

      try {
        await new Promise(async (res) => {
          await checkAuth(msg, useCacheConfig, profileModel, providerPath);
          res();
        }).timeout(TIMEOUT);
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
