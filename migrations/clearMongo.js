'use strict';

module.exports.id = '0.0.clearMongo ' + Date.now();

/**
 * @description tabs flow settings
 * @param done
 */

module.exports.up = function (done) {
  this.db.collection('noderedstorages').remove({}, () => {
    this.db.collection('noderedusers').remove({}, () => {
      this.db.collection('_migrations').remove({}, done);
    });
  });
};

module.exports.down = function (done) {
  done();
};
