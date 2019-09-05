'use strict';

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Schema = _mongoose2.default.Schema;

var ElectionGroup = new Schema({
  groupName: {
    type: String,
    unique: true,
    required: true
  },
  groupDescription: {
    type: String,
    required: true
  },
  electionDate: {
    type: Date,
    required: true
  }
});

module.exports = _mongoose2.default.model('ElectionGroup', ElectionGroup);
//# sourceMappingURL=electionGroupModel.js.map