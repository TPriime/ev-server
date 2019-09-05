import mongoose from 'mongoose';

let Schema = mongoose.Schema;

let Election = new Schema({
  electionCode: {
    type: String,
    unique: true,
    required: true
  },
  electionParties: [{
    name: {type: String, required: true},
  }],
  electionName: {
    type: String,
    required: true
  },
  electionDate: {
    type: Date,
    required: true
  },
  electionAvailable: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model('Election', Election)