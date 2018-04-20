/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

const when = require('when'),
  controllers = {
    mongo: require('./mongo/nodeRedMongoStorageController'),
    local: require('./local/nodeRedLocalStorageController')
  };

let settings = {};

module.exports = {
  init: (globalSettings) => {
    settings = globalSettings;
    (settings.useLocalStorage ? controllers.local : controllers.mongo).init(globalSettings);
    return when.resolve();

  }, //thumb function

  getFlows: (...params) => (settings.useLocalStorage ? controllers.local : controllers.mongo).getFlows(...params),

  saveFlows: (...params) => (settings.useLocalStorage ? controllers.local : controllers.mongo).saveFlows(...params),

  getCredentials: () => (settings.useLocalStorage ? controllers.local : controllers.mongo).getCredentials(),

  saveCredentials: (...params) => (settings.useLocalStorage ? controllers.local : controllers.mongo).saveCredentials(...params),

  getSettings: () => (settings.useLocalStorage ? controllers.local : controllers.mongo).getSettings(),

  saveSettings: (...params) => (settings.useLocalStorage ? controllers.local : controllers.mongo).saveSettings(...params),

  getSessions: () => (settings.useLocalStorage ? controllers.local : controllers.mongo).getSessions(),

  saveSessions: (...params) => (settings.useLocalStorage ? controllers.local : controllers.mongo).saveSessions(...params),

  getLibraryEntry: (...params) => (settings.useLocalStorage ? controllers.local : controllers.mongo).getLibraryEntry(...params),

  saveLibraryEntry: (...params) => (settings.useLocalStorage ? controllers.local : controllers.mongo).saveLibraryEntry(...params),
};
