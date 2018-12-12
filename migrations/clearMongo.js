'use strict';

module.exports.id = '0.0.clearMongo ' + Date.now();

/**
 * @description tabs flow settings
 * @param done
 */

module.exports.up = async function (done) {
  await this.db.collection('noderedstorages').remove({});
  await this.db.collection('noderedusers').remove({});
  await this.db.collection('_migrations').remove({});
  done();
};

module.exports.down = function (done) {
  done();
};
