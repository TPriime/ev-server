'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _expressFileupload = require('express-fileupload');

var _expressFileupload2 = _interopRequireDefault(_expressFileupload);

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

var _routes = require('./routes');

var _routes2 = _interopRequireDefault(_routes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import jwt from 'jsonwebtoken';

var app = (0, _express2.default)();
var server = _http2.default.createServer(app);

// defaults
app.use(_express2.default.json({
    limit: _config2.default.bodyLimit
}));

app.use(_express2.default.urlencoded({ extended: false }));
app.use((0, _expressFileupload2.default)({
    createParentPath: true
}));
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-access-token");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS, PATCH");
    next();
});

// api routes v1
app.use('/evoting_api/v1', _routes2.default);

server.listen(_config2.default.port || process.env.port);
console.log('server running on port ' + server.address().port);

exports.default = app;
//# sourceMappingURL=index.js.map