const Promise = require('bluebird'),
  _ = require('lodash'),
  Web3 = require('web3'),
  net = require('net'),
  uniqid = require('uniqid'),
  config = require('../config');

module.exports = function (RED) {
  function ExtractCall (redConfig) {
    RED.nodes.createNode(this, redConfig);
    let node = this;
    this.on('input', async function (msg) {

      const ctx =  node.context().global;
      const web3 = new Web3();

      const method = redConfig.mode === '1' ? _.get(msg, 'payload.method', '') : redConfig.method;
      const params = redConfig.mode === '1' ? _.get(msg, 'payload.params', []) : redConfig.params;
      const providerPath = redConfig.configprovider === '0' ? redConfig.providerpath : _.get(ctx.settings, redConfig.provideroption) || '/tmp/geth.ipc';

      let provider =  /^http/.test(providerPath) ? new Web3.providers.HttpProvider(providerPath) : new Web3.providers.IpcProvider(`${/^win/.test(process.platform) ? '\\\\.\\pipe\\' : ''}${providerPath}`, net);
      web3.setProvider(provider);

      try {
        let response = await Promise.promisify(web3.currentProvider.send)
          .bind(web3.currentProvider)({
            jsonrpc: '2.0',
            method: method,
            params: params,
            id: uniqid()
          }).timeout(10000);

        msg.payload = _.get(response, 'result', {});

        node.send(msg);
      } catch (err) {
        console.log(err);
        this.error(JSON.stringify(err), msg);
      }
    });
  }

  RED.nodes.registerType('web3', ExtractCall);
};
