'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _express = require('express');

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _userModel = require('../models/userModel');

var _userModel2 = _interopRequireDefault(_userModel);

var _fileTypeValidators = require('../middleware/validators/fileTypeValidators');

var _accessToken = require('../middleware/accessToken');

var _cloudinary = require('../middleware/cloudinary');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

exports.default = function (_ref) {
    var config = _ref.config,
        db = _ref.db;

    var api = (0, _express.Router)();

    // 'evoting_api/v1/users/register' Endpoint to create a new user
    api.post('/register', function () {
        var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(req, res) {
            var mediaFile, isValid, existingUserEmail, existingUserphone, mediaPath, result, data, upload;
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
                            isValid = (0, _fileTypeValidators.validateDisplayPicture)(mediaFile);

                            if (isValid) {
                                _context.next = 7;
                                break;
                            }

                            return _context.abrupt('return', res.status(400).json({ message: "Please upload a valid filetype" }));

                        case 7:
                            _context.prev = 7;
                            _context.next = 10;
                            return _userModel2.default.findOne({ userEmail: req.body.userEmail });

                        case 10:
                            existingUserEmail = _context.sent;

                            if (!existingUserEmail) {
                                _context.next = 13;
                                break;
                            }

                            return _context.abrupt('return', res.status(400).json({ message: 'Email already in use' }));

                        case 13:
                            _context.next = 15;
                            return _userModel2.default.findOne({ phoneNumber: req.body.phoneNumber });

                        case 15:
                            existingUserphone = _context.sent;

                            if (!existingUserphone) {
                                _context.next = 18;
                                break;
                            }

                            return _context.abrupt('return', res.status(400).json({ message: 'Phone number already in use' }));

                        case 18:

                            mediaFile.mv('./tempMedia/' + mediaFile.name); //move the file to a temp storage
                            mediaPath = _path2.default.resolve('./tempMedia/' + mediaFile.name);
                            _context.next = 22;
                            return (0, _cloudinary.addProfilePicture)(mediaPath);

                        case 22:
                            result = _context.sent;

                            if (!result.error) {
                                _context.next = 25;
                                break;
                            }

                            return _context.abrupt('return', res.status(503).json({ message: "Upload was not successful" }));

                        case 25:
                            data = {
                                firstName: req.body.firstName,
                                lastName: req.body.lastName,
                                otherNames: req.body.otherNames,
                                phoneNumber: req.body.phoneNumber,
                                dateOfBirth: req.body.dateOfBirth,
                                gender: req.body.gender,
                                state: req.body.state,
                                lga: req.body.lga,
                                town: req.body.town,
                                maritalStatus: req.body.maritalStatus,
                                occupation: req.body.occupation,
                                userEmail: req.body.userEmail,
                                fingerprint: req.body.fingerprint,
                                userProfilePicture: result.secure_url,
                                userProfilePictureId: result.public_id
                            };
                            _context.next = 28;
                            return _userModel2.default.create(data);

                        case 28:
                            upload = _context.sent;

                            if (upload) {
                                _context.next = 31;
                                break;
                            }

                            return _context.abrupt('return', res.status(401).json({ message: "Registration was not successful" }));

                        case 31:
                            res.json({ message: 'Registration done.', upload: upload });

                            _context.next = 38;
                            break;

                        case 34:
                            _context.prev = 34;
                            _context.t0 = _context['catch'](7);

                            res.status(422).json(_context.t0);
                            console.log(_context.t0);

                        case 38:
                        case 'end':
                            return _context.stop();
                    }
                }
            }, _callee, undefined, [[7, 34]]);
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

    // 'evoting_api/v1/users/:id' Endpoint to get a user
    api.get('/:id', function () {
        var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(req, res) {
            var id, user;
            return regeneratorRuntime.wrap(function _callee3$(_context3) {
                while (1) {
                    switch (_context3.prev = _context3.next) {
                        case 0:

                            (0, _accessToken.validateToken)(req, res);
                            id = req.params.id;
                            _context3.prev = 2;
                            _context3.next = 5;
                            return _userModel2.default.findById(id);

                        case 5:
                            user = _context3.sent;

                            if (user) {
                                _context3.next = 8;
                                break;
                            }

                            return _context3.abrupt('return', res.status(401).json({ message: "No user found" }));

                        case 8:
                            res.json(user);
                            _context3.next = 14;
                            break;

                        case 11:
                            _context3.prev = 11;
                            _context3.t0 = _context3['catch'](2);

                            res.status(422).json({ error: _context3.t0 });

                        case 14:
                        case 'end':
                            return _context3.stop();
                    }
                }
            }, _callee3, undefined, [[2, 11]]);
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

    // 'evoting_api/v1/users/verify/:id' Endpoint to verify user account
    api.put('/verify/:id', function () {
        var _ref7 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(req, res) {
            var id, user;
            return regeneratorRuntime.wrap(function _callee6$(_context6) {
                while (1) {
                    switch (_context6.prev = _context6.next) {
                        case 0:
                            id = req.params.id;
                            _context6.prev = 1;
                            _context6.next = 4;
                            return _userModel2.default.findByIdAndUpdate(id, { userVerified: true });

                        case 4:
                            user = _context6.sent;

                            if (user) {
                                _context6.next = 7;
                                break;
                            }

                            return _context6.abrupt('return', res.status(401).json({ message: "No user found" }));

                        case 7:
                            res.json({ message: 'User verified' });
                            _context6.next = 13;
                            break;

                        case 10:
                            _context6.prev = 10;
                            _context6.t0 = _context6['catch'](1);

                            res.status(422).json({ error: _context6.t0 });

                        case 13:
                        case 'end':
                            return _context6.stop();
                    }
                }
            }, _callee6, undefined, [[1, 10]]);
        }));

        return function (_x11, _x12) {
            return _ref7.apply(this, arguments);
        };
    }());

    return api;
};
//# sourceMappingURL=userController.js.map