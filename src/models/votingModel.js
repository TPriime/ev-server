import mongoose from 'mongoose';  //OT YET DONE

let Schema = mongoose.Schema;

let Votes = new Schema({
  voter: {
    type: String,
    unique: true,
    required: true
  },
  votes: {
    type: String,
    unique: true,
    required: true},
  device: {
    type: String,
    required: true
  },
  adminProfilePicture: String,
  adminProfilePictureId: String,
});

module.exports = mongoose.model('Votes', Votes);