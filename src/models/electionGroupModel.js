import mongoose from 'mongoose';

let Schema = mongoose.Schema;

let ElectionGroup = new Schema({
  groupName: {
    type: String,
    unique: true,
    required: true
  },
  groupDescription: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('ElectionGroup', ElectionGroup)