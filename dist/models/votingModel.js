'use strict';

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//OT YET DONE

var Schema = _mongoose2.default.Schema;

var Vote = new Schema({
  voter: {
    type: Schema.Types.ObjectId,
    ref: "User",
    unique: true,
    required: true
  },
  votes: [{
    election: { type: String, required: true },
    party: { type: String, required: true }
  }],
  device: {
    type: String,
    required: true
  },
  voteTime: {
    type: Date,
    required: true
  }
});

module.exports = _mongoose2.default.model('Vote', Vote);
//# sourceMappingURL=votingModel.js.map