/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

module.exports = (flow, id) => {

  return `
module.exports.id = '${id}';

const _ = require('lodash'),
  config = require('../config');

/**
 * @description flow ${flow.path} update
 * @param done
 */
   

module.exports.up = function (done) {
  let coll = this.db.collection(\`\${_.get(config, 'nodered.mongo.collectionPrefix', '')}noderedstorages\`);
  coll.update(${JSON.stringify({path: flow.path, type: 'flows'})}, {
    $set: ${JSON.stringify(flow)}
  }, {upsert: true}, done);
};

module.exports.down = function (done) {
  let coll = this.db.collection(\`\${_.get(config, 'nodered.mongo.collectionPrefix', '')}noderedstorages\`);
  coll.remove(${JSON.stringify({path: flow.path, type: 'flows'})}, done);
};
`;

};
