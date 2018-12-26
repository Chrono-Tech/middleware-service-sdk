/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 licenses.
 */

module.exports = function (RED) {
  function ExtractAddr (redConfig) {
    RED.nodes.createNode(this, redConfig);
    let node = this;

    this.on('input', async function (msg) {
      try {
        const message = JSON.parse(msg.payload);
        if (!message[redConfig['addr']]) {
            if (msg.ackMsg)
                msg.ackMsg();
            return node.error(
            'not right name param in laborx auth created/deleted amqp message - skip it', 
            msg
            );
        }
        msg.payload= {address: message[redConfig['addr']]};
        node.send(msg);
      } catch (e) {
        msg.ackMsg();
        return node.error(
          'not right amqp message - skip it', 
          msg
        );
      }
    });
  }

  RED.nodes.registerType('laborx_get_addr', ExtractAddr);
};
