/**
 * Expose an express web server
 * @module middleware-eth-rest
 */

const defaultConfig = require('./config'),
  express = require('express'),
  cors = require('cors'),
  path = require('path'),
  Promise = require('bluebird'),
  _ = require('lodash'),
  mongoose = require('mongoose'),
  RED = require('node-red'),
  http = require('http'),
  migrator = require('./migrate'),
  bodyParser = require('body-parser'),
  factories = require('require-all')({
    dirname: path.join(__dirname, '/factories'),
    filter: /(.+Factory)\.js$/
  });

mongoose.Promise = Promise;

module.exports = {
  config: defaultConfig,
  factories: factories,
  migrator: migrator,
  init: config => {

    config = _.merge(defaultConfig, config);

    mongoose.connect(config.nodered.mongo.uri, {useMongoClient: true});

    require('require-all')({
      dirname: path.join(__dirname, '/models'),
      filter: /(.+Model)\.js$/,
      resolve: Model => {
        return Model.init(config.nodered.mongo);
      }
    });

    config.nodered.nodesDir = _.union(
      _.isString(config.nodered.customNodesDir) ? [config.nodered.customNodesDir] : config.nodered.customNodesDir,
      _.isString(config.nodered.nodesDir) ? [config.nodered.nodesDir] : config.nodered.nodesDir);

    let app = express();
    let httpServer = http.createServer(app);
    app.use(cors());
    app.use(bodyParser.urlencoded({extended: false}));
    app.use(bodyParser.json());

    RED.init(httpServer, config.nodered);
    app.use(config.nodered.httpAdminRoot, RED.httpAdmin);
    app.use(config.nodered.httpNodeRoot, RED.httpNode);

    if (config.nodered.httpServer)
      httpServer.listen(config.rest.port);

    RED.start();

  }
};

