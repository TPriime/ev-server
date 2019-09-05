'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.validateToken = exports.setToken = undefined;

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _expressJwt = require('express-jwt');

var _expressJwt2 = _interopRequireDefault(_expressJwt);

var _config = require('../config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var setToken = exports.setToken = function setToken(payload) {
    var TOKENTIME = 60 * 60 * 24 * 30; // expires in 30 days
    var token = _jsonwebtoken2.default.sign({ payload: payload }, _config2.default.secret, {
        expiresIn: TOKENTIME
    });

    return token;
};

var verifyToken = function verifyToken(accessToken) {
    var output = void 0;
    _jsonwebtoken2.default.verify(accessToken, _config2.default.secret, function (e, decoded) {
        if (e) {
            output = false;
        } else {
            output = true;
        }
    });

    return output;
};
var validateToken = exports.validateToken = function validateToken(req, res) {
    var accessToken = req.body.token || req.query.token || req.headers['x-access-token'];

    if (!accessToken) return res.status(407).json({ message: "No token provided" });

    var isTokenValid = verifyToken(accessToken);

    if (isTokenValid === false) return res.status(407).json({ message: "Failed to verify token" });
};
//# sourceMappingURL=accessToken.js.map