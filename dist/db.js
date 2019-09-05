"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _mongoose = require("mongoose");

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var mongoUrl = process.env.MONGODB_URI || "mongodb://localhost:27017/evoting";

exports.default = function (callback) {
    var db = _mongoose2.default.connect(mongoUrl, { useNewUrlParser: true, useCreateIndex: true });
    callback(db);
};
//# sourceMappingURL=db.js.map