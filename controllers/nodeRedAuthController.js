const controllers = {
    local: require('./local/nodeRedLocalAuthController'),
    mongo: require('./mongo/nodeRedMongoAuthController')
  },
  when = require('when');

let settings = {};

module.exports = {
  type: 'credentials',
  init: (globalSettings) => {
    settings = globalSettings;
    (settings.useLocalStorage ? controllers.local : controllers.mongo).init(settings);
    return when.resolve();
  },
  users: (...params) => (settings.useLocalStorage ? controllers.local : controllers.mongo).users(...params),
  authenticate: (...params) => (settings.useLocalStorage ? controllers.local : controllers.mongo).authenticate(...params),
  default: function () {
    return when.resolve({anonymous: false});
  }
};
