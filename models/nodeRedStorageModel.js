/**
 * Mongoose model. Used to store node-red data.
 * @module models/nodeRedStorageModel
 * @returns {Object} Mongoose model
 */

const mongoose = require('mongoose');

/**
 * Account model definition
 * @param  {Object} obj Describes node-red storage model
 * @return {Object} Model's object
 */

let model;
const NodeRedStorage = new mongoose.Schema({
  type: {type: String},
  path: {type: String},
  body: {type: mongoose.Schema.Types.Mixed, default: {}},
  meta: {type: mongoose.Schema.Types.Mixed, default: {}}
});


module.exports = {
  init: (config)=>{
    model = mongoose.model(`${config.collectionPrefix}NodeRedStorage`, NodeRedStorage);

  },
  get model(){
    return model;
  }
}
