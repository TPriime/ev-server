import mongoose from 'mongoose';

let Schema = mongoose.Schema;

let Election = new Schema({
  electionName: {
    type: String,
    unique: true,
    required: true
  },
  adminEmail: {
    type: String,
    unique: true,
    required: true
  },
  adminPassword: {
    type: String,
    required: true
  },
  adminProfilePicture: String,
  adminProfilePictureId: String,
});

module.exports = mongoose.model('Election', Election);