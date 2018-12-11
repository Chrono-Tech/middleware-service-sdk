/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 licenses.
 */

const AmqpIn = require('./nodes/AmqpIn'),
  AmqpOut = require('./nodes/AmqpOut'),
  AmqpServer = require('./controllers/AmqpServer');

module.exports = function (RED) {


  RED.nodes.registerType('amqp in', AmqpIn(RED));
  RED.nodes.registerType('amqp out', AmqpOut(RED));
  RED.nodes.registerType('amqp-server', AmqpServer(RED), {
    credentials: {
      user: {type: 'text'},
      password: {type: 'password'}
    }
  });
};
