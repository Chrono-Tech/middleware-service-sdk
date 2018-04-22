/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 licenses.
 */

/**
 * Mongoose model. Used to store hashes, which need to be pinned.
 * @module models/accountModel
 * @returns {Object} Mongoose model
 */

const mongoose = require('mongoose');

/**
 * Account model definition
 * @param  {Object} obj Describes account's model
 * @return {Object} Model's object
 */

let model;
const Migration = new mongoose.Schema({
  id: {
    type: String,
    unique: true,
    required: true,
  }
});

module.exports = {
  init: (config)=>{
    model = mongoose.model(`_${config.collectionPrefix}Migration`, Migration);
  },
  get model(){
    return model;
  }
};
