'use strict';

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Schema = _mongoose2.default.Schema;

var User = new Schema({
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
    userProfilePictureId: String
});

module.exports = _mongoose2.default.model('User', User);
//# sourceMappingURL=userModel.js.map