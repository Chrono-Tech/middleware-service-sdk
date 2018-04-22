/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 licenses.
 */

const Promise = require('bluebird'),
  _ = require('lodash'),
  path = require('path'),
  ipc = require('node-ipc'),
  uniqid = require('uniqid'),
  config = require('../config');

module.exports = function (RED) {
  function ExtractCall (redConfig) {
    RED.nodes.createNode(this, redConfig);
    let node = this;
    this.on('input', async function (msg) {

      const ctx =  node.context().global;
      const ipcInstance = new ipc.IPC;

      const providerPath = redConfig.configprovider === '0' ? redConfig.providerpath : _.get(ctx.settings, redConfig.provideroption) || '/tmp/bitcoin';
      const parsedPath = path.parse(providerPath);


      Object.assign(ipcInstance.config, {
        id: uniqid(),
        socketRoot: `${parsedPath.dir}/`,
        retry: 1500,
        sync: true,
        silent: true,
        unlink: false,
        maxRetries: 3
      });

      let method = redConfig.mode === '1' ? _.get(msg, 'payload.method', '') : redConfig.method;
      let params = redConfig.mode === '1' ? _.get(msg, 'payload.params', []) : redConfig.params;

      try {


        await new Promise((res, rej) => {
          ipcInstance.connectTo(parsedPath.base, () => {
            ipcInstance.of[parsedPath.base].on('connect', res);
            ipcInstance.of[parsedPath.base].on('error', rej);
          });
        }).timeout(5000);

        msg.payload = await new Promise((res, rej) => {
          ipcInstance.of[parsedPath.base].on('message', data => data.error ? rej(data.error) : res(data.result));
          ipcInstance.of[parsedPath.base].emit('message', JSON.stringify({
              method: method,
              params: params
            })
          );
        }).timeout(30000);

        ipcInstance.disconnect(parsedPath.base);
        node.send(msg);
      } catch (err) {
        ipcInstance.disconnect(parsedPath.base);
        this.error(JSON.stringify(err), msg);
      }

    });
  }

  RED.nodes.registerType('bcoin', ExtractCall);
};
