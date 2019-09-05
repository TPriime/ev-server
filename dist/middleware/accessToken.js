'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.checkPartiesUnique = exports.validateToken = exports.setToken = undefined;

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var secret = "theamazingevoting";

var setToken = exports.setToken = function setToken(payload) {
    var TOKENTIME = 60 * 60 * 24 * 30; // expires in 30 days
    var token = _jsonwebtoken2.default.sign({ payload: payload }, secret, {
        expiresIn: TOKENTIME
    });

    return token;
};

var verifyToken = function verifyToken(accessToken) {
    var output = void 0;
    _jsonwebtoken2.default.verify(accessToken, secret, function (e, decoded) {
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

var checkPartiesUnique = exports.checkPartiesUnique = function checkPartiesUnique(partiesArr) {
    partiesArr = partiesArr.sort(function (a, b) {
        return a.name > b.name ? 1 : -1;
    });
    var results = [];
    for (var i = 0; i <= partiesArr.length - 1; i++) {
        if (i === partiesArr.length - 1) {
            results.push(partiesArr[i]);
        } else {
            if (partiesArr[i + 1].name !== partiesArr[i].name) {
                results.push(partiesArr[i]);
            }
        }
    }
    return results;
};
//# sourceMappingURL=accessToken.js.map