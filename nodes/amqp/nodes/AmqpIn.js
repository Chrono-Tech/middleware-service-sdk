const startNode = require('../services/startNode'),
  _ = require('lodash');

class AmqpIn {

  constructor (config) {
    const ctx = this.context().global;
    AmqpIn.RED.nodes.createNode(this, config);
    this.topic = _.template(config.topic)({config: ctx.settings});
    this.ioType = config.iotype;
    this.noack = config.noack;
    this.ioName = config.ioname;
    this.configName = config.configname || 'rabbit';
    this.durableQueue = config.durablequeue;
    this.durableExchange = config.durableexchange;
    this.server = AmqpIn.RED.nodes.getNode(config.server);
    this.amqpType = 'input';

    startNode(this, AmqpIn.RED);
  }

  _Consume (msg) {

    msg.ackMsg = () => {
      this.server.channel.ack(msg);
    };

    msg.nackMsg = () => {
      this.server.channel.nack(msg);
    };

    const topic = msg.fields.routingKey;
    const regex = new RegExp(this.topic);

    this.topic.length === 0 || regex.test(topic) ?
      this.send({ //send to next connected node
        topic: topic,
        payload: msg.content.toString(),
        amqpMessage: msg
      }) : msg.ackMsg();

  }

  async initialize () {

    try {
      this.server.channel.consume(this.queueName, this._Consume.bind(this), {noAck: this.noack === '1'});
      this.status({fill: 'green', shape: 'dot', text: 'connected'});
    } catch (err) {
      this.status({fill: 'red', shape: 'dot', text: 'error'});
      this.error('AMQP input error: ' + err.message);
    }

  };

}


module.exports = function (RED) {
  AmqpIn.RED = RED;
  return AmqpIn;
};