/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 licenses.
 */

const  _ = require('lodash'),
  request = require('request-promise'),
  mongoose = require('mongoose'),
  {URL} = require('url');




module.exports = function (RED) {
  function ExtractCall (redConfig) {
    RED.nodes.createNode(this, redConfig);
    let node = this;

    const connection = _.get(node.context().global,`connections.${redConfig.dbAlias}`) || mongoose;

    const getModel = function (origName) {
      const model = connection.models[origName];
      if (!model) 
        throw new Error('Not find profile in mongo models');
      return model;
    };

    const getAddressesFromLaborx = async (providerPath, msg) => {
      const response = await request({
        method: 'POST',
        uri: new URL('signin/signature/addresses', providerPath),
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

    const isAuth = (msg) => _.get(msg, 'req.headers.authorization');

    this.on('input', async function (msg) {

      const ctx =  node.context().global;
      const profileModel = getModel( _.get(ctx.settings, 'laborx.profileModel'));

      const providerPath = redConfig.configprovider === '0' ? redConfig.providerpath : 
        _.get(ctx.settings, 'laborx.authProvider') || 'http://localhost:3001';
      if (!isAuth(msg)) {
        msg.statusCode = '400';
        return this.error('Not set authorization headers', msg);
      }

      const authorization = _.get(msg, 'req.headers.authorization');
      const params = authorization.split(' ');
      if (params[0] === 'Bearer') {
        msg.addresses =await getAddressesFromMongo(profileModel, params[1]);
        if (msg.addresses) {
          node.send(msg);
          return;
        }
      }

      try {
        let addresses = await getAddressesFromLaborx(providerPath, msg);
        
        msg.addresses = addresses;
        if (params[0] === 'Bearer') 
          await saveAddressesToMongo(profileModel, params[1], addresses);
        node.send(msg);
      } catch (err) {
        msg.statusCode = '401';
        this.error(err, msg);
      }
    });
  }

  RED.nodes.registerType('laborx_auth', ExtractCall);
};
