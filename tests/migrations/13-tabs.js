
module.exports.id = '13.tabs';

const _ = require('lodash'),
  config = require('../config');

/**
 * @description flow tabs update
 * @param done
 */
   

module.exports.up = function (done) {
  let coll = this.db.collection(`${_.get(config, 'nodered.mongo.collectionPrefix', '')}noderedstorages`);
  coll.update({"path":"tabs","type":"flows"}, {
    $set: {"path":"tabs","body":[{"id":"2c9dd332.05334c","type":"tab","label":"address","disabled":false,"info":""},{"id":"11926f6d.95c3e1","type":"tab","label":"events","disabled":false,"info":""}]}
  }, {upsert: true}, done);
};

module.exports.down = function (done) {
  let coll = this.db.collection(`${_.get(config, 'nodered.mongo.collectionPrefix', '')}noderedstorages`);
  coll.remove({"path":"tabs","type":"flows"}, done);
};
