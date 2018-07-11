const _ = require('lodash');
const config = require('../../config');
module.exports.id = '4.01';

/**
 * @description flow e415e43d.f10178 update
 * @param done
 */
   

module.exports.up = function (done) {
  let coll = this.db.collection(
    `${_.get(config, 'nodered.mongo.collectionPrefix', '')}noderedstorages`);
  coll.update(
    {"path":'2c9dd332.05334c',"type":"flows"}, {
    $set: {
      "path":'2c9dd332.05334c',"body":[
      {
        "id":"709069ef.19b4f8","type":"http response","z":"e415e43d.f10178",
        "name":"","statusCode":"","headers":{},"x":650,"y":140,"wires":[]
      },{
        "id":"33e00189.e8c52e","type":"http in","z":"e415e43d.f10178","name":"","url":"/secret",
        "method":"get","upload":false,"swaggerDoc":"","x":300,"y":160,"wires":[["3ccb7721.66c2a8"]]
      },{
        "id":"3ccb7721.66c2a8","type":"laborx_auth","z":"e415e43d.f10178","method":"",
        "name":"laborx_auth","configprovider":"1","providerpath":"http://localhost:3001",
        "x":480,"y":180,"wires":[["709069ef.19b4f8"]]
      }]}
  }, {upsert: true}, done);
};

module.exports.down = function (done) {
  let coll = this.db.collection(`${_.get(config, 'nodered.mongo.collectionPrefix', '')}noderedstorages`);
  coll.remove({"path":"e415e43d.f10178","type":"flows"}, done);
};
