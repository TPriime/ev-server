import mongoose from 'mongoose';

let Schema = mongoose.Schema;

let Election = new Schema({
  electionCode: {
    type: String,
    unique: true,
    required: true
  },
  electionParties: [String],
  electionName: {
    type: String,
    required: true
  },
  electionDate: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Election', Election);