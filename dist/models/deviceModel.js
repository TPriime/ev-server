'use strict';

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//OT YET DONE

var Schema = _mongoose2.default.Schema;

var Device = new Schema({
  deviceName: {
    type: String,
    unique: true,
    required: true
  },
  releaseDate: {
    type: Date
  },
  currentLocation: {
    type: String
  },
  status: {
    type: String,
    required: true
  }
});

module.exports = _mongoose2.default.model('Device', Device);
//# sourceMappingURL=deviceModel.js.map