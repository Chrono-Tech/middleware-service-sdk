'use strict';

module.exports.id = '1.05';

/**
 * @description tabs flow settings
 * @param done
 */

module.exports.up = function (done) {
  let coll = this.db.collection(`noderedstorages`);
  coll.insert({
    'meta': {},
    'type': 'flows',
    'path': 'tabs',
    'body': [
      {
        'id': '2c9dd332.05334c',
        'type': 'tab',
        'label': 'address',
        'disabled': false,
        'info': ''
      },
      {
        'id': '11926f6d.95c3e1',
        'type': 'tab',
        'label': 'events',
        'disabled': false,
        'info': ''
      }
    ]
  }, done);
};

module.exports.down = function (done) {
  let coll = this.db.collection(`noderedstorages`);
  coll.remove({
    'type': 'flows',
    'path': 'tabs'
  }, done);
  done();
};
