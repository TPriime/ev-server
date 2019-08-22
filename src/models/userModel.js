import mongoose from 'mongoose';

let Schema = mongoose.Schema;

let User = new Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    otherNames: {
        type: String,
        required: true
    },
    userEmail: {
        type: String,
        unique: true,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true,
        unique: true
    },
    dateOfBirth: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    lga: {
        type: String,
        required: true
    },
    town: {
        type: String,
        required: true
    },
    maritalStatus: {
        type: String,
        required: true
    },
    occupation: {
        type: String,
        required: true
    },
    fingerprint: {
        type: String,
        required: true
    },
    userProfilePicture: String,
    userProfilePictureId: String,
});

module.exports = mongoose.model('User', User);