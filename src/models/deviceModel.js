import mongoose from 'mongoose';  //OT YET DONE

let Schema = mongoose.Schema;

let Device = new Schema({
  deviceName: {
    type: String,
    unique: true,
    required: true
  },
  releaseDate:{
    type: Date
  },
  currentLocation: {
    type:String
  },
  status:{
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Device', Device);