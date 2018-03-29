'use strict';

const migrationModel = require('../../models/migrationModel');
const nodeRedStorageModel = require('../../models/nodeRedStorageModel');
const nodeRedUserModel = require('../../models/nodeRedUserModel');

module.exports = function () {
    migrationModel.model.remove();
    nodeRedStorageModel.model.remove();
    nodeRedUserModel.model.remove();
}