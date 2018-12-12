const amqp = require('amqplib'),
  _ = require('lodash');

class AmqpServer {

  constructor (node) {

    this.ctx = this.context().global;
    AmqpServer.RED.nodes.createNode(this, node);
    this.host = node.host || 'localhost';
    this.port = node.port || '5672';
    this.vhost = node.vhost;
    this.keepAlive = node.keepalive;
    this.useTls = node.usetls;
    this.clientCount = 0;
    this.servermode = node.servermode;
    this.configName = node.configname || 'rabbit';
    this.connection = null;
    this.channel = null;
  }


  async claimConnection () {

    if (this.clientCount !== 0)
      return;

    let urlType = this.useTls ? 'amqps://' : 'amqp://';
    let credentials = _.has(this, 'credentials.user') ? `${this.credentials.user}:${this.credentials.password}@` : '';
    let urlLocation = `${this.host}:${this.port}`;
    if (this.vhost)
      urlLocation += `/${this.vhost}`;

    if (this.keepAlive)
      urlLocation += `?heartbeat=${this.keepAlive}`;

    try {

      const configUrl = _.get(this.ctx.settings, this.configName + '.url');
      const url = this.servermode === '1' ? configUrl : urlType + credentials + urlLocation;
      this.connection = await amqp.connect(url);

      this.connection.on('error', ()=>{});

      this.channel = await this.connection.createChannel();
      this.log('Connected to AMQP server ' + url);
    } catch (e) {
      this.error('AMQP-SERVER error creating topology: ' + e.message);
    }

    this.clientCount++;
  }

  async freeConnection () {
    this.clientCount--;
    if (this.clientCount === 0)
      try {
        await this.connection.close();
        this.connection = null;
        this.log('AMQP server connection ' + this.host + ' closed');
      } catch (e) {
        this.error('AMQP-SERVER error closing connection: ' + e.message);
      }
  }

}


module.exports = function (RED) {
  AmqpServer.RED = RED;
  return AmqpServer;
};