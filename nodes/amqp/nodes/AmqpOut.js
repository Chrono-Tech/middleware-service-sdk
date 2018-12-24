const startNode = require('../services/startNode'),
  _ = require('lodash');

class AmqpOut {

  constructor (node) {

    this.ctx = this.context().global;
    AmqpOut.RED.nodes.createNode(this, node);
    this.topic = _.template(node.topic)({config: this.ctx.settings});
    this.ioType = node.iotype;
    this.noack = node.noack;
    this.durable = node.durable;
    this.ioName = node.ioname;
    this.configName = node.configname || 'rabbit';
    this.server = AmqpOut.RED.nodes.getNode(node.server);
    // set amqp node type initialization parameters
    this.amqpType = 'output';
    startNode(this, AmqpOut.RED);
  }


  _input (msg) { //todo refactor

    if (!msg.payload)
      return;

    if (_.isObject(msg.payload))
      msg.payload = JSON.stringify(msg.payload);


    let topic = _.template(this.topic || msg.topic)({config: this.ctx.settings});

    if (this.ioType === '4') 
      this.server.channel.sendToQueue(this.ioName, Buffer.from(msg.payload));
    else 
      this.server.channel.publish(this.ioName, topic, Buffer.from(msg.payload));
    

  }

  initialize () {
    this.on('input', this._input);
  }

}

module.exports = function (RED) {
  AmqpOut.RED = RED;
  return AmqpOut;
};
