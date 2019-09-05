import mongoose from 'mongoose';

let Schema = mongoose.Schema;

let Admin = new Schema({
    adminName: {
        type: String, 
        default: 'Admin',
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

module.exports = mongoose.model('Admin', Admin);