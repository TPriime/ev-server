'use strict';

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Schema = _mongoose2.default.Schema;

var Election = new Schema({
  electionCode: {
    type: String,
    unique: true,
    required: true
  },
  electionParties: [{
    type: String,
    unique: true,
    required: true
  }],
  electionName: {
    type: String,
    required: true
  },
  electionDate: {
    type: String,
    required: true
  }
});

module.exports = _mongoose2.default.model('Election', Election);
//# sourceMappingURL=electionModel.js.map