import mongoose from 'mongoose';

let Schema = mongoose.Schema;

let User = new Schema({
    fullName: {
        type: String, 
        unique: true,
        required: true
    },
    userEmail: {
        type: String, 
        unique: true,
        required: true
    },
    userPassword: {
        type: String, 
        required: true
    },
    userProfilePicture: String,
    userProfilePictureId: String,
    userVerified: {
        type: Boolean,
        default: false
    },
    userCollections: [{type: Schema.Types.ObjectId, ref: 'Collection'}],
});

module.exports = mongoose.model('User', User);