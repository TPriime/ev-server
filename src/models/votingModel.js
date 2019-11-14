import mongoose from 'mongoose';  //OT YET DONE

let Schema = mongoose.Schema;

let Vote = new Schema({
  voter: {
    type: Schema.Types.ObjectId,
    ref: "User",
    unique: true,
    required: true
  },
  votes: [{
    election:{type: String, required: true},
    electionCode:{type: String, required: true},
    party:{type: String, required: true}
  }],
  device: {
    type: String,
    required: true
  },
  voteTime:{
    type: Date,
    required: true
  }
});

module.exports = mongoose.model('Vote', Vote);