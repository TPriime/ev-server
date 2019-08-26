'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.hashPassword = exports.decryptPassword = exports.encryptPassword = undefined;

var _crypto = require('crypto');

var _crypto2 = _interopRequireDefault(_crypto);

var _ENV = require('./ENV.json');

var _ENV2 = _interopRequireDefault(_ENV);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var encryptPassword = exports.encryptPassword = function encryptPassword(userPassword) {
    var key = _crypto2.default.createCipher(_ENV2.default.keyOne, _ENV2.default.keyTwo);
    var encryptedPassword = key.update(userPassword, _ENV2.default.charset, _ENV2.default.base);
    encryptedPassword += key.final(_ENV2.default.base);

    return encryptedPassword;
}; //Built-in encryption module
var decryptPassword = exports.decryptPassword = function decryptPassword(encryptedUserPassword) {
    var key = _crypto2.default.createDecipher(_ENV2.default.keyOne, _ENV2.default.keyTwo);
    var decryptedPassword = key.update(encryptedUserPassword, _ENV2.default.base, _ENV2.default.charset);
    decryptedPassword += key.final(_ENV2.default.charset);

    return decryptedPassword;
};

var hashPassword = exports.hashPassword = function hashPassword(userPassword) {
    var encryptedPassword = _crypto2.default.createHash('sha256').update(userPassword).digest(_ENV2.default.base);

    return encryptedPassword;
};
//# sourceMappingURL=passwordMiddleware.js.map