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

      const providerPath = redConfig.configprovider === '0' ? redConfig.providerpath :_.get(ctx.settings, 'laborxProvider') || 'http://localhost:30001';

      try {
        let addresses = await request({
          method: 'POST',
          uri: new URL('signin/signature/addresses', providerPath),
          json: true,
          headers: {
            'Authorization': msg.req.headers.authorization
          }
        });
        if (!addresses['address']) 
          throw new Error('not found address from auth response');
        
        msg.addresses = addresses;

        node.send(msg);
      } catch (err) {
        this.error(JSON.stringify(err), msg);
      }
    });
  }

  RED.nodes.registerType('laborx_auth', ExtractCall);
};
