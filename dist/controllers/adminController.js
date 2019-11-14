'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _express = require('express');

var _adminModel = require('../models/adminModel');

var _adminModel2 = _interopRequireDefault(_adminModel);

var _passwordMiddleware = require('../middleware/passwordMiddleware');

var _accessToken = require('../middleware/accessToken');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

exports.default = function (_ref) {
    var config = _ref.config,
        db = _ref.db;

    var api = (0, _express.Router)();

    // '/evoting_api/v1/admins/register' Endpoint to create a new admin
    api.post('/register', function () {
        var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(req, res) {
            var encryptedPassword, data, existingAdminEmails, admin;
            return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            encryptedPassword = (0, _passwordMiddleware.hashPassword)(req.body.adminPassword);
                            data = {
                                adminName: req.body.adminName,
                                adminEmail: req.body.adminEmail,
                                adminPassword: encryptedPassword
                            };
                            _context.next = 4;
                            return _adminModel2.default.findOne({ adminEmail: data.adminEmail });

                        case 4:
                            existingAdminEmails = _context.sent;

                            if (!existingAdminEmails) {
                                _context.next = 7;
                                break;
                            }

                            return _context.abrupt('return', res.status(400).json({ message: 'Email already in use' }));

                        case 7:
                            _context.prev = 7;
                            _context.next = 10;
                            return _adminModel2.default.create(data);

                        case 10:
                            admin = _context.sent;

                            if (admin) {
                                _context.next = 13;
                                break;
                            }

                            return _context.abrupt('return', res.status(401).json({ message: "Admin Registration was not successful" }));

                        case 13:

                            res.json({ message: 'Admin Registration done.', admin: admin });
                            _context.next = 19;
                            break;

                        case 16:
                            _context.prev = 16;
                            _context.t0 = _context['catch'](7);

                            res.status(422).json({ error: _context.t0 });

                        case 19:
                        case 'end':
                            return _context.stop();
                    }
                }
            }, _callee, undefined, [[7, 16]]);
        }));

        return function (_x, _x2) {
            return _ref2.apply(this, arguments);
        };
    }());

    // 'evoting_api/v1/admins/login' Endpoint to login a admin
    api.post('/login', function () {
        var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(req, res) {
            var result, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, admin, encryptedPassword, payload, token;

            return regeneratorRuntime.wrap(function _callee2$(_context2) {
                while (1) {
                    switch (_context2.prev = _context2.next) {
                        case 0:
                            _context2.prev = 0;
                            _context2.next = 3;
                            return _adminModel2.default.find({ adminEmail: req.body.adminEmail });

                        case 3:
                            result = _context2.sent;

                            if (!(result.length === 0)) {
                                _context2.next = 6;
                                break;
                            }

                            return _context2.abrupt('return', res.status(401).json({ message: "Email/Password is Incorrect" }));

                        case 6:
                            _iteratorNormalCompletion = true;
                            _didIteratorError = false;
                            _iteratorError = undefined;
                            _context2.prev = 9;
                            _iterator = result[Symbol.iterator]();

                        case 11:
                            if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
                                _context2.next = 22;
                                break;
                            }

                            admin = _step.value;
                            encryptedPassword = (0, _passwordMiddleware.hashPassword)(req.body.adminPassword);

                            if (!(admin.adminPassword !== encryptedPassword)) {
                                _context2.next = 16;
                                break;
                            }

                            return _context2.abrupt('return', res.status(401).json({ message: "Email/Password is Incorrect" }));

                        case 16:
                            payload = {
                                id: admin._id
                            };
                            token = (0, _accessToken.setToken)(payload);


                            res.json({
                                authenticated: true,
                                adminId: admin._id,
                                admin: admin,
                                token: token
                            });

                        case 19:
                            _iteratorNormalCompletion = true;
                            _context2.next = 11;
                            break;

                        case 22:
                            _context2.next = 28;
                            break;

                        case 24:
                            _context2.prev = 24;
                            _context2.t0 = _context2['catch'](9);
                            _didIteratorError = true;
                            _iteratorError = _context2.t0;

                        case 28:
                            _context2.prev = 28;
                            _context2.prev = 29;

                            if (!_iteratorNormalCompletion && _iterator.return) {
                                _iterator.return();
                            }

                        case 31:
                            _context2.prev = 31;

                            if (!_didIteratorError) {
                                _context2.next = 34;
                                break;
                            }

                            throw _iteratorError;

                        case 34:
                            return _context2.finish(31);

                        case 35:
                            return _context2.finish(28);

                        case 36:
                            _context2.next = 41;
                            break;

                        case 38:
                            _context2.prev = 38;
                            _context2.t1 = _context2['catch'](0);

                            res.status(422).json({ error: _context2.t1 });

                        case 41:
                        case 'end':
                            return _context2.stop();
                    }
                }
            }, _callee2, undefined, [[0, 38], [9, 24, 28, 36], [29,, 31, 35]]);
        }));

        return function (_x3, _x4) {
            return _ref3.apply(this, arguments);
        };
    }());

    // 'evoting_api/v1/admins/' Endpoint to see all admins, admin only
    api.get('/', function () {
        var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(req, res) {
            var admins;
            return regeneratorRuntime.wrap(function _callee3$(_context3) {
                while (1) {
                    switch (_context3.prev = _context3.next) {
                        case 0:
                            (0, _accessToken.validateToken)(req, res);

                            _context3.prev = 1;
                            _context3.next = 4;
                            return _adminModel2.default.find();

                        case 4:
                            admins = _context3.sent;

                            if (!(admins.length === 0)) {
                                _context3.next = 7;
                                break;
                            }

                            return _context3.abrupt('return', res.status(401).json({ message: "No admin found" }));

                        case 7:
                            res.json(admins);
                            _context3.next = 13;
                            break;

                        case 10:
                            _context3.prev = 10;
                            _context3.t0 = _context3['catch'](1);

                            res.status(422).json({ error: _context3.t0 });

                        case 13:
                        case 'end':
                            return _context3.stop();
                    }
                }
            }, _callee3, undefined, [[1, 10]]);
        }));

        return function (_x5, _x6) {
            return _ref4.apply(this, arguments);
        };
    }());

    // 'evoting_api/v1/admins/:id' Endpoint to see all admins, admin only
    api.get('/:id', function () {
        var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(req, res) {
            var id, admin;
            return regeneratorRuntime.wrap(function _callee4$(_context4) {
                while (1) {
                    switch (_context4.prev = _context4.next) {
                        case 0:
                            (0, _accessToken.validateToken)(req, res);

                            id = req.params.id;
                            _context4.prev = 2;
                            _context4.next = 5;
                            return _adminModel2.default.findById(id);

                        case 5:
                            admin = _context4.sent;

                            if (admin) {
                                _context4.next = 8;
                                break;
                            }

                            return _context4.abrupt('return', res.status(401).json({ message: "No admin found" }));

                        case 8:
                            res.json(admin);
                            _context4.next = 14;
                            break;

                        case 11:
                            _context4.prev = 11;
                            _context4.t0 = _context4['catch'](2);

                            res.status(422).json({ error: _context4.t0 });

                        case 14:
                        case 'end':
                            return _context4.stop();
                    }
                }
            }, _callee4, undefined, [[2, 11]]);
        }));

        return function (_x7, _x8) {
            return _ref5.apply(this, arguments);
        };
    }());

    // 'evoting_api/v1/admins/update/:id' Endpoint to update any admin parameters
    api.put('/update/:id', function () {
        var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(req, res) {
            var id, adminName, admin;
            return regeneratorRuntime.wrap(function _callee5$(_context5) {
                while (1) {
                    switch (_context5.prev = _context5.next) {
                        case 0:
                            (0, _accessToken.validateToken)(req, res);

                            id = req.params.id;
                            adminName = req.body.adminName; //TODO: how to ensure password is not included here

                            _context5.prev = 3;
                            _context5.next = 6;
                            return _adminModel2.default.findByIdAndUpdate(id, { adminName: adminName });

                        case 6:
                            admin = _context5.sent;

                            if (admin) {
                                _context5.next = 9;
                                break;
                            }

                            return _context5.abrupt('return', res.status(401).json({ message: "No admin found" }));

                        case 9:
                            res.json({ message: 'Update successful' });
                            _context5.next = 15;
                            break;

                        case 12:
                            _context5.prev = 12;
                            _context5.t0 = _context5['catch'](3);

                            res.status(422).json({ error: _context5.t0 });

                        case 15:
                        case 'end':
                            return _context5.stop();
                    }
                }
            }, _callee5, undefined, [[3, 12]]);
        }));

        return function (_x9, _x10) {
            return _ref6.apply(this, arguments);
        };
    }());

    // 'evoting_api/v1/admins/delete/:id' Endpoint to delete any admin
    api.delete('/delete/:id', function () {
        var _ref7 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(req, res) {
            var id, admin;
            return regeneratorRuntime.wrap(function _callee6$(_context6) {
                while (1) {
                    switch (_context6.prev = _context6.next) {
                        case 0:
                            (0, _accessToken.validateToken)(req, res);

                            id = req.params.id;
                            _context6.prev = 2;
                            _context6.next = 5;
                            return _adminModel2.default.findByIdAndDelete(id);

                        case 5:
                            admin = _context6.sent;

                            if (admin) {
                                _context6.next = 8;
                                break;
                            }

                            return _context6.abrupt('return', res.status(401).json({ message: "No admin found" }));

                        case 8:
                            res.json({ message: 'Admin account deleted successfully' });

                            _context6.next = 14;
                            break;

                        case 11:
                            _context6.prev = 11;
                            _context6.t0 = _context6['catch'](2);

                            res.status(422).json({ error: _context6.t0 });

                        case 14:
                        case 'end':
                            return _context6.stop();
                    }
                }
            }, _callee6, undefined, [[2, 11]]);
        }));

        return function (_x11, _x12) {
            return _ref7.apply(this, arguments);
        };
    }());

    return api;
};
//# sourceMappingURL=adminController.js.map