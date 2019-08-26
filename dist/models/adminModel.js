'use strict';

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Schema = _mongoose2.default.Schema;

var Admin = new Schema({
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
    adminProfilePictureId: String
});

module.exports = _mongoose2.default.model('Admin', Admin);
//# sourceMappingURL=adminModel.js.map