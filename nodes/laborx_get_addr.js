/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 licenses.
 */

const  _ = require('lodash');

module.exports = function (RED) {
  function ExtractAddr (redConfig) {
    RED.nodes.createNode(this, redConfig);
    let node = this;

    this.on('input', async function (msg) {

      const message = JSON.parse(msg.payload);
      if (!message[redConfig['addr']]) {
        if(msg.amqpMessage)
          msg.amqpMessage.ackMsg();
        throw new Error('not right name param in laborx auth created/deleted amqp message - skip it');
      }

      msg.payload= {address: message[redConfig['addr']]};
      node.send(msg);
    });
  }

  RED.nodes.registerType('laborx_get_addr', ExtractAddr);
};
