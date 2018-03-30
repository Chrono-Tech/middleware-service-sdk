'use strict';

const migrationModel = require('../../models/migrationModel');
const nodeRedStorageModel = require('../../models/nodeRedStorageModel');
const nodeRedUserModel = require('../../models/nodeRedUserModel');

module.exports = function () {
    migrationModel.model.remove().exec();
    nodeRedStorageModel.model.remove().exec();
    nodeRedUserModel.model.remove().exec();
}