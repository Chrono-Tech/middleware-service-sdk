
module.exports.id = '11.11926f6d.95c3e1';

const _ = require('lodash'),
  config = require('../config');

/**
 * @description flow 11926f6d.95c3e1 update
 * @param done
 */
   

module.exports.up = function (done) {
  let coll = this.db.collection(`${_.get(config, 'nodered.mongo.collectionPrefix', '')}noderedstorages`);
  coll.update({"path":"11926f6d.95c3e1","type":"flows"}, {
    $set: {"path":"11926f6d.95c3e1","body":[{"id":"f71e4f8.f819fb","type":"http in","z":"11926f6d.95c3e1","name":"events","url":"/events","method":"get","upload":false,"swaggerDoc":"","x":120,"y":217.5,"wires":[["12e2a4a.b20b25b"]]},{"id":"12e2a4a.b20b25b","type":"function","z":"11926f6d.95c3e1","name":"transform params","func":"\nconst factories = global.get('factories');\nconst _ = global.get('_');\n\n\nmsg.payload = _.chain(factories.sm)\n    .values()\n    .map(value => \n      _.chain(value).get('abi')\n        .filter({type: 'event'})\n        .value()\n    )\n    .flattenDeep()\n    .map(ev=>ev.name)\n    .uniq()\n    .value();\n\nreturn msg;","outputs":1,"noerr":0,"x":322.500003814697,"y":217.499998092651,"wires":[["c49a5649.c046a8"]]},{"id":"c49a5649.c046a8","type":"http response","z":"11926f6d.95c3e1","name":"","statusCode":"","x":547.500015258789,"y":216.25000333786,"wires":[]},{"id":"5a97720b.d0cc1c","type":"http in","z":"11926f6d.95c3e1","name":"get event","url":"/events/:event","method":"get","upload":false,"swaggerDoc":"","x":135,"y":401.25,"wires":[["b1cd37e5.74a048"]]},{"id":"26896dec.5a53d2","type":"function","z":"11926f6d.95c3e1","name":"transform params","func":"\nmsg.payload = {\n    model: msg.req.params.event, \n    request: msg.payload.criteria\n};\n\nreturn msg;","outputs":1,"noerr":0,"x":537.5,"y":401.25,"wires":[["5b0b9e21.6451c"]]},{"id":"2858f1ab.675c5e","type":"http response","z":"11926f6d.95c3e1","name":"","statusCode":"","x":956.5,"y":400,"wires":[]},{"id":"b1cd37e5.74a048","type":"query-to-mongo","z":"11926f6d.95c3e1","request_type":"0","name":"query-to-mongo","x":311,"y":402,"wires":[["26896dec.5a53d2"]]},{"id":"5b0b9e21.6451c","type":"mongo","z":"11926f6d.95c3e1","model":"","request":"{}","name":"mongo","mode":"1","requestType":"0","x":757,"y":401,"wires":[["2858f1ab.675c5e"]]},{"id":"5410ef0.54afe1","type":"http response","z":"11926f6d.95c3e1","name":"","statusCode":"","x":777,"y":592,"wires":[]},{"id":"555b9a3a.231ad4","type":"function","z":"11926f6d.95c3e1","name":"transform","func":"\nlet factories = global.get(\"factories\"); \n\nmsg.payload = factories.messages.generic.fail;\n\nif (msg.statusCode == '401')\n    msg.payload = factories.messages.generic.failAuth;\n\nreturn msg;","outputs":1,"noerr":0,"x":561,"y":591,"wires":[["5410ef0.54afe1"]]},{"id":"8823b89d.26e0f8","type":"http in","z":"11926f6d.95c3e1","name":"","url":"/secret","method":"get","upload":false,"swaggerDoc":"","x":130,"y":120,"wires":[["24d020ef.619d2"]]},{"id":"8373b105.48b5d","type":"function","z":"11926f6d.95c3e1","name":"","func":"msg.payload = msg.addresses;\nreturn msg;","outputs":1,"noerr":0,"x":470,"y":120,"wires":[["94e2ed5d.3216e"]]},{"id":"24d020ef.619d2","type":"laborx_auth","z":"11926f6d.95c3e1","name":"laborx_auth","configprovider":"1","providerpath":"http://localhost:3001","x":310,"y":120,"wires":[["8373b105.48b5d"]]},{"id":"94e2ed5d.3216e","type":"http response","z":"11926f6d.95c3e1","name":"","statusCode":"","headers":{},"x":650,"y":120,"wires":[]},{"id":"24961ab5.8f5146","type":"catch","z":"11926f6d.95c3e1","name":"","scope":null,"x":320,"y":600,"wires":[["555b9a3a.231ad4"]]}]}
  }, {upsert: true}, done);
};

module.exports.down = function (done) {
  let coll = this.db.collection(`${_.get(config, 'nodered.mongo.collectionPrefix', '')}noderedstorages`);
  coll.remove({"path":"11926f6d.95c3e1","type":"flows"}, done);
};
