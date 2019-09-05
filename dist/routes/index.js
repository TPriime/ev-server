'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _config = require('../config');

var _config2 = _interopRequireDefault(_config);

var _middleware = require('../middleware');

var _middleware2 = _interopRequireDefault(_middleware);

var _db = require('../db');

var _db2 = _interopRequireDefault(_db);

var _userController = require('../controllers/userController');

var _userController2 = _interopRequireDefault(_userController);

var _adminController = require('../controllers/adminController');

var _adminController2 = _interopRequireDefault(_adminController);

var _electionController = require('../controllers/electionController');

var _electionController2 = _interopRequireDefault(_electionController);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = (0, _express2.default)();

// connect to db
(0, _db2.default)(function (db) {
    router.use((0, _middleware2.default)({ config: _config2.default, db: db }));

    // api routes v1
    router.use('/users', (0, _userController2.default)({ config: _config2.default, db: db }));
    router.use('/admins', (0, _adminController2.default)({ config: _config2.default, db: db }));
    router.use('/elections', (0, _electionController2.default)({ config: _config2.default, db: db }));
});

exports.default = router;
//# sourceMappingURL=index.js.map