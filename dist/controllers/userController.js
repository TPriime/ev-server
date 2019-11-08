'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _express = require('express');

var _userModel = require('../models/userModel');

var _userModel2 = _interopRequireDefault(_userModel);

var _accessToken = require('../middleware/accessToken');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var uuid4 = require('uuid4');
require('babel-polyfill'); //////////////

exports.default = function (_ref) {
    var config = _ref.config,
        db = _ref.db;

    var api = (0, _express.Router)();

    // 'evoting_api/v1/users/register' Endpoint to create a new user
    api.post('/register', function () {
        var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(req, res) {
            var mediaFile, existingCardID, existingUserEmail, existingUserphone, userid, data, upload;
            return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            (0, _accessToken.validateToken)(req, res);

                            if (req.files) {
                                _context.next = 3;
                                break;
                            }

                            return _context.abrupt('return', res.status(400).json({ message: "No files were uploaded" }));

                        case 3:
                            mediaFile = req.files.userProfilePicture;
                            _context.prev = 4;
                            _context.next = 7;
                            return _userModel2.default.findOne({ cardID: req.body.cardID });

                        case 7:
                            existingCardID = _context.sent;

                            if (!existingCardID) {
                                _context.next = 10;
                                break;
                            }

                            return _context.abrupt('return', res.status(400).json({ message: 'cardID already in use' }));

                        case 10:
                            _context.next = 12;
                            return _userModel2.default.findOne({ userEmail: req.body.userEmail });

                        case 12:
                            existingUserEmail = _context.sent;

                            if (!existingUserEmail) {
                                _context.next = 15;
                                break;
                            }

                            return _context.abrupt('return', res.status(400).json({ message: 'Email already in use' }));

                        case 15:
                            _context.next = 17;
                            return _userModel2.default.findOne({ phoneNumber: req.body.phoneNumber });

                        case 17:
                            existingUserphone = _context.sent;

                            if (!existingUserphone) {
                                _context.next = 20;
                                break;
                            }

                            return _context.abrupt('return', res.status(400).json({ message: 'Phone number already in use' }));

                        case 20:
                            userid = uuid4();
                            data = {
                                userID: userid,
                                cardID: req.body.cardID,
                                firstName: req.body.firstName,
                                lastName: req.body.lastName,
                                otherNames: req.body.otherNames,
                                phoneNumber: req.body.phoneNumber,
                                dateOfBirth: req.body.dateOfBirth,
                                gender: req.body.gender,
                                state: req.body.state,
                                lga: req.body.lga,
                                maritalStatus: req.body.maritalStatus,
                                occupation: req.body.occupation,
                                userEmail: req.body.userEmail,
                                fingerprint: req.body.fingerprint,
                                userProfilePicture: JSON.stringify(mediaFile.data),
                                userProfilePictureId: " "
                            };
                            upload = void 0;
                            _context.prev = 23;
                            _context.next = 26;
                            return _userModel2.default.create(data);

                        case 26:
                            upload = _context.sent;
                            _context.next = 32;
                            break;

                        case 29:
                            _context.prev = 29;
                            _context.t0 = _context['catch'](23);
                            return _context.abrupt('return', res.status(401).json({ message: "Registration was not successful" }));

                        case 32:

                            res.json({ message: 'Registration done.', upload: upload });

                            _context.next = 39;
                            break;

                        case 35:
                            _context.prev = 35;
                            _context.t1 = _context['catch'](4);

                            console.log(_context.t1);
                            res.status(422).json(_context.t1);

                        case 39:
                        case 'end':
                            return _context.stop();
                    }
                }
            }, _callee, undefined, [[4, 35], [23, 29]]);
        }));

        return function (_x, _x2) {
            return _ref2.apply(this, arguments);
        };
    }());

    // 'evoting_api/v1/users' Endpoint to see all users, admin only
    api.get('/', function () {
        var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(req, res) {
            var users;
            return regeneratorRuntime.wrap(function _callee2$(_context2) {
                while (1) {
                    switch (_context2.prev = _context2.next) {
                        case 0:

                            (0, _accessToken.validateToken)(req, res);

                            _context2.prev = 1;
                            _context2.next = 4;
                            return _userModel2.default.find();

                        case 4:
                            users = _context2.sent;

                            if (!(users.length === 0)) {
                                _context2.next = 7;
                                break;
                            }

                            return _context2.abrupt('return', res.status(401).json({ message: "No user found" }));

                        case 7:
                            res.json(users);
                            _context2.next = 13;
                            break;

                        case 10:
                            _context2.prev = 10;
                            _context2.t0 = _context2['catch'](1);

                            res.status(422).json({ error: _context2.t0 });

                        case 13:
                        case 'end':
                            return _context2.stop();
                    }
                }
            }, _callee2, undefined, [[1, 10]]);
        }));

        return function (_x3, _x4) {
            return _ref3.apply(this, arguments);
        };
    }());

    // 'evoting_api/v1/users/id' Endpoint to get a user and search user included!!!
    api.get('/:id', function () {
        var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(req, res) {
            var id, q, result, user;
            return regeneratorRuntime.wrap(function _callee3$(_context3) {
                while (1) {
                    switch (_context3.prev = _context3.next) {
                        case 0:
                            id = req.params.id;

                            if (!(req.params.id === 'search')) {
                                _context3.next = 41;
                                break;
                            }

                            // '/evoting_api/v1/users/search' Endpoint to get a User in the database
                            q = void 0, result = void 0;
                            _context3.prev = 3;

                            if (!req.query.userEmail) {
                                _context3.next = 11;
                                break;
                            }

                            q = req.query.userEmail;
                            _context3.next = 8;
                            return _userModel2.default.find({
                                userEmail: {
                                    $regex: new RegExp(q, 'i')
                                } }, {
                                __v: 0
                            });

                        case 8:
                            result = _context3.sent;
                            _context3.next = 32;
                            break;

                        case 11:
                            if (!req.query.firstName) {
                                _context3.next = 18;
                                break;
                            }

                            q = req.query.firstName;
                            _context3.next = 15;
                            return _userModel2.default.find({
                                firstName: {
                                    $regex: new RegExp(q, 'i')
                                } }, {
                                __v: 0
                            });

                        case 15:
                            result = _context3.sent;
                            _context3.next = 32;
                            break;

                        case 18:
                            if (!req.query.lastName) {
                                _context3.next = 25;
                                break;
                            }

                            q = req.query.lastName;
                            _context3.next = 22;
                            return _userModel2.default.find({
                                lastName: {
                                    $regex: new RegExp(q, 'i')
                                } }, {
                                __v: 0
                            });

                        case 22:
                            result = _context3.sent;
                            _context3.next = 32;
                            break;

                        case 25:
                            if (!(req.query.lastName && req.query.userEmail && req.query.firstName)) {
                                _context3.next = 32;
                                break;
                            }

                            q = req.query.firstName;
                            r = req.query.lastName;
                            p = req.query.userEmail;
                            _context3.next = 31;
                            return _userModel2.default.find({
                                $or: [{ firstName: { $regex: new RegExp(q, 'i') } }, { lastName: { $regex: new RegExp(r, 'i') } }, { userEmail: { $regex: new RegExp(p, 'i') } }]
                            }, {
                                __v: 0
                            });

                        case 31:
                            result = _context3.sent;

                        case 32:
                            if (result.length === 0) res.status(401).json({ message: "No user found" });
                            res.json(result);
                            _context3.next = 39;
                            break;

                        case 36:
                            _context3.prev = 36;
                            _context3.t0 = _context3['catch'](3);

                            res.status(417).json({ message: "Could not find any User                                                                                                                    " });

                        case 39:
                            _context3.next = 53;
                            break;

                        case 41:
                            _context3.prev = 41;
                            _context3.next = 44;
                            return _userModel2.default.findOne({ cardID: id }, { __v: 0 });

                        case 44:
                            user = _context3.sent;

                            if (user) {
                                _context3.next = 47;
                                break;
                            }

                            return _context3.abrupt('return', res.status(401).json({ message: "No user found" }));

                        case 47:

                            res.json(user);
                            _context3.next = 53;
                            break;

                        case 50:
                            _context3.prev = 50;
                            _context3.t1 = _context3['catch'](41);

                            res.status(422).json({ error: "The error" });

                        case 53:
                        case 'end':
                            return _context3.stop();
                    }
                }
            }, _callee3, undefined, [[3, 36], [41, 50]]);
        }));

        return function (_x5, _x6) {
            return _ref4.apply(this, arguments);
        };
    }());

    // 'evoting_api/v1/users/update/:id' Endpoint to update any user parameters
    api.put('/update/:id', function () {
        var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(req, res) {
            var id, _req$body, firstName, lastName, otherNames, dateOfBirth, gender, state, lga, town, maritalStatus, occupation, user;

            return regeneratorRuntime.wrap(function _callee4$(_context4) {
                while (1) {
                    switch (_context4.prev = _context4.next) {
                        case 0:
                            (0, _accessToken.validateToken)(req, res);
                            id = req.params.id;
                            _req$body = req.body, firstName = _req$body.firstName, lastName = _req$body.lastName, otherNames = _req$body.otherNames, dateOfBirth = _req$body.dateOfBirth, gender = _req$body.gender, state = _req$body.state, lga = _req$body.lga, town = _req$body.town, maritalStatus = _req$body.maritalStatus, occupation = _req$body.occupation;
                            _context4.prev = 3;
                            _context4.next = 6;
                            return _userModel2.default.findByIdAndUpdate(id, { firstName: firstName, lastName: lastName, otherNames: otherNames, dateOfBirth: dateOfBirth, gender: gender, state: state, lga: lga, town: town, maritalStatus: maritalStatus, occupation: occupation });

                        case 6:
                            user = _context4.sent;

                            if (user) {
                                _context4.next = 9;
                                break;
                            }

                            return _context4.abrupt('return', res.status(401).json({ message: "No user found" }));

                        case 9:
                            res.json({ message: 'Update successful' });
                            _context4.next = 15;
                            break;

                        case 12:
                            _context4.prev = 12;
                            _context4.t0 = _context4['catch'](3);

                            res.status(422).json({ error: _context4.t0 });

                        case 15:
                        case 'end':
                            return _context4.stop();
                    }
                }
            }, _callee4, undefined, [[3, 12]]);
        }));

        return function (_x7, _x8) {
            return _ref5.apply(this, arguments);
        };
    }());

    // 'evoting_api/v1/users/delete/:id' Endpoint to delete any user
    api.delete('/delete/:id', function () {
        var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(req, res) {
            var id, user;
            return regeneratorRuntime.wrap(function _callee5$(_context5) {
                while (1) {
                    switch (_context5.prev = _context5.next) {
                        case 0:

                            (0, _accessToken.validateToken)(req, res);

                            id = req.params.id;
                            _context5.prev = 2;
                            _context5.next = 5;
                            return _userModel2.default.findByIdAndDelete(id);

                        case 5:
                            user = _context5.sent;

                            if (user) {
                                _context5.next = 8;
                                break;
                            }

                            return _context5.abrupt('return', res.status(401).json({ message: "No user found" }));

                        case 8:
                            res.json({ message: 'User account deleted successfully' });

                            _context5.next = 14;
                            break;

                        case 11:
                            _context5.prev = 11;
                            _context5.t0 = _context5['catch'](2);

                            res.status(422).json({ error: _context5.t0 });

                        case 14:
                        case 'end':
                            return _context5.stop();
                    }
                }
            }, _callee5, undefined, [[2, 11]]);
        }));

        return function (_x9, _x10) {
            return _ref6.apply(this, arguments);
        };
    }());

    return api;
};
//# sourceMappingURL=userController.js.map