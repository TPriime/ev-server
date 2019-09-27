'use strict';

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//OT YET DONE

var Schema = _mongoose2.default.Schema;

var lga_data = new Schema({
  LGA: {
    type: String,
    required: true
  },
  State: {
    type: String,
    required: true
  },
  FC: {
    type: String,
    required: true
  },
  SD: {
    type: String,
    required: true
  }
}, { collection: 'lga_data' });

module.exports = _mongoose2.default.model('lga_data', lga_data);
//# sourceMappingURL=lgaModel.js.map