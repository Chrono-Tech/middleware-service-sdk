const AmqpServer = require('../controllers/AmqpServer'),
  exchangeTypes = require('../factories/exchangeTypes'),
  _ = require('lodash');

module.exports = async (node, RED) => {

  if (!node.server)
    node.server = new (AmqpServer(RED))({servermode: '1', configname: node.configName});

  const ctx = node.context().global;
  node.status({fill: 'green', shape: 'ring', text: 'connecting'});

  try {
    await node.server.claimConnection();

    const serviceName = _.get(ctx.settings, node.configName + '.serviceName');

//    node.queue = node.server.connection.declareQueue(`${serviceName}.${node.id}`, {durable: node.durableQueue === '1'});
    node.queueName = node.ioType === '4' ? node.ioName : `${serviceName}.${node.id}`;

    await node.server.channel.assertQueue(node.queueName, {durable: node.durableQueue === '1'});

    if (node.ioType !== '4') {
      node.server.channel.assertExchange(node.ioName, exchangeTypes[node.ioType], {durable: node.durableExchange === '1'});
      await node.server.channel.bindQueue(node.queueName, node.ioName, node.topic);

    }

    node.status({fill: 'green', shape: 'dot', text: 'connected'});
    node.initialize();
  } catch (err) {
    node.status({fill: 'red', shape: 'dot', text: 'connect error'});
    node.error('AMQP ' + node.amqpType + ' node connect error: ' + err.message);
  }

  node.on('close', async function () {
    try {
      await node.server.freeConnection();
      node.status({fill: 'red', shape: 'ring', text: 'disconnected'});
    } catch (err) {
      await node.server.freeConnection();
      node.status({fill: 'red', shape: 'dot', text: 'disconnect error'});
      node.error('AMQP ' + node.amqpType + ' node disconnect error: ' + err.message);
    }
  });

};
