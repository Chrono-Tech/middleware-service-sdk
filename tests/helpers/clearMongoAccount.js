'use strict';

const migrationModel = require('../../models/migrationModel');
const nodeRedStorageModel = require('../../models/nodeRedStorageModel');
const nodeRedUserModel = require('../../models/nodeRedUserModel');

module.exports = function () {
    migrationModel.model.collection.drop();
    nodeRedStorageModel.model.collection.drop();
    nodeRedUserModel.model.collection.drop();
}