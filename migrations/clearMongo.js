'use strict';

module.exports.id = 'clearMongo ' + Date.now();

/**
 * @description tabs flow settings
 * @param done
 */

module.exports.up = function (done) {
  let coll = this.db.collection('noderedstorages');
  coll.remove({}, () => {
    let col = this.db.collection('_migrations');
    col.remove({}, done);
  });
};

module.exports.down = function (done) {
  done();
};
