import mongoose from 'mongoose';  //OT YET DONE

let Schema = mongoose.Schema;

let lga_data = new Schema({
  LGA: {
    type: String,
    required: true
  },
  State: {
    type: String,
    required: true
  },
  FC: {
    type: String,
    required: true
  },
  SD:{
    type: String,
    required: true
  }
},{collection: 'lga_data'});

module.exports = mongoose.model('lga_data', lga_data);