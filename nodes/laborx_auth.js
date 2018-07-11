/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 licenses.
 */

const  _ = require('lodash'),
  request = require('request-promise'),
  {URL} = require('url');

module.exports = function (RED) {
  function ExtractCall (redConfig) {
    RED.nodes.createNode(this, redConfig);
    let node = this;
    this.on('input', async function (msg) {

      const ctx =  node.context().global;

      const providerPath = redConfig.configprovider === '0' ? redConfig.providerpath : 
        _.get(ctx.settings, 'laborx.authProvider') || 'http://localhost:3001';

      if (!_.get(msg, 'req.headers.authorization')) {
        msg.statusCode = '400';
        return this.error('Not set authorization headers', msg);
      }

      try {
        let addresses = await request({
          method: 'POST',
          uri: new URL('signin/signature/addresses', providerPath),
          json: true,
          headers: {
            'Authorization': msg.req.headers.authorization
          }
        });
        if (!_.get(addresses, 'address')) 
          throw new Error('not found addresses from auth response ' + addresses);
        
        msg.addresses = addresses;
        node.send(msg);
      } catch (err) {
        msg.statusCode = '401';
        this.error(err, msg);
      }
    });
  }

  RED.nodes.registerType('laborx_auth', ExtractCall);
};
