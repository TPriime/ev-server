'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _express = require('express');

var _electionGroupModel = require('../models/electionGroupModel');

var _electionGroupModel2 = _interopRequireDefault(_electionGroupModel);

var _accessToken = require('../middleware/accessToken');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

exports.default = function (_ref) {
    var config = _ref.config,
        db = _ref.db;


    var api = (0, _express.Router)();

    // '/evoting_api/v1/electiongroup/create' Endpoint to create a new Election [Auth Required]
    api.post('/create', function () {
        var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(req, res) {
            var existingGroup, data, electionGroup;
            return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            (0, _accessToken.validateToken)(req, res);

                            _context.prev = 1;
                            _context.next = 4;
                            return _electionGroupModel2.default.findOne({ groupName: req.body.groupName });

                        case 4:
                            existingGroup = _context.sent;

                            if (!existingGroup) {
                                _context.next = 7;
                                break;
                            }

                            return _context.abrupt('return', res.status(400).json({ message: 'Election Group already exist' }));

                        case 7:
                            data = {
                                groupName: req.body.groupName,
                                groupDescription: req.body.groupDescription,
                                electionDate: req.body.electionDate
                            };
                            _context.next = 10;
                            return _electionGroupModel2.default.create(data);

                        case 10:
                            electionGroup = _context.sent;

                            if (!electionGroup) {
                                _context.next = 15;
                                break;
                            }

                            res.json({
                                message: "Election Group Created Successfully",
                                electionGroup: electionGroup
                            });
                            _context.next = 16;
                            break;

                        case 15:
                            return _context.abrupt('return', res.status(401).json({ message: 'Election Group not created' }));

                        case 16:
                            _context.next = 21;
                            break;

                        case 18:
                            _context.prev = 18;
                            _context.t0 = _context['catch'](1);

                            res.status(422).json(_context.t0);

                        case 21:
                        case 'end':
                            return _context.stop();
                    }
                }
            }, _callee, undefined, [[1, 18]]);
        }));

        return function (_x, _x2) {
            return _ref2.apply(this, arguments);
        };
    }());

    // '/evoting_api/v1/electiongroup/search' Endpoint to get an Election in the database by electionCode [Auth Required]
    api.get('/search', function () {
        var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(req, res) {
            var result, q;
            return regeneratorRuntime.wrap(function _callee2$(_context2) {
                while (1) {
                    switch (_context2.prev = _context2.next) {
                        case 0:
                            (0, _accessToken.validateToken)(req, res);

                            _context2.prev = 1;
                            result = void 0, q = void 0;

                            if (!req.query.groupName) {
                                _context2.next = 10;
                                break;
                            }

                            q = req.query.groupName;
                            _context2.next = 7;
                            return _electionGroupModel2.default.find({
                                groupName: {
                                    $regex: new RegExp(q, 'i')
                                } }, {
                                __v: 0
                            });

                        case 7:
                            result = _context2.sent;
                            _context2.next = 15;
                            break;

                        case 10:
                            if (!req.query.electionDate) {
                                _context2.next = 15;
                                break;
                            }

                            q = req.query.electionDate;
                            _context2.next = 14;
                            return _electionGroupModel2.default.find({
                                electionDate: {
                                    $regex: new RegExp(q, 'i')
                                } }, {
                                __v: 0
                            });

                        case 14:
                            result = _context2.sent;

                        case 15:

                            if (result.length === 0) res.status(401).json({ message: "Election Group not found" });
                            res.json(result);
                            _context2.next = 22;
                            break;

                        case 19:
                            _context2.prev = 19;
                            _context2.t0 = _context2['catch'](1);

                            res.status(417).json({ message: "Could not find any the Group" });

                        case 22:
                        case 'end':
                            return _context2.stop();
                    }
                }
            }, _callee2, undefined, [[1, 19]]);
        }));

        return function (_x3, _x4) {
            return _ref3.apply(this, arguments);
        };
    }());

    // '/evoting_api/v1/electiongroup/' Endpoint to access all Elections in the database [Auth Required]
    api.get('/', function () {
        var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(req, res) {
            var electiongroups;
            return regeneratorRuntime.wrap(function _callee3$(_context3) {
                while (1) {
                    switch (_context3.prev = _context3.next) {
                        case 0:
                            (0, _accessToken.validateToken)(req, res);

                            _context3.prev = 1;
                            _context3.next = 4;
                            return _electionGroupModel2.default.find();

                        case 4:
                            electiongroups = _context3.sent;

                            if (!(electiongroups === 0)) {
                                _context3.next = 7;
                                break;
                            }

                            return _context3.abrupt('return', res.status(401).json({ message: "No Election Group found" }));

                        case 7:
                            res.json(electiongroups);
                            _context3.next = 13;
                            break;

                        case 10:
                            _context3.prev = 10;
                            _context3.t0 = _context3['catch'](1);

                            res.status(417).json({ message: "Could not get Elections groups" });

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

    // '/evoting_api/v1/electiongroup/update/:id' Endpoint to update an election details
    api.put('/update/:id', function () {
        var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(req, res) {
            var id, _req$body, groupName, groupDescription, electionDate, electiongroups;

            return regeneratorRuntime.wrap(function _callee4$(_context4) {
                while (1) {
                    switch (_context4.prev = _context4.next) {
                        case 0:
                            (0, _accessToken.validateToken)(req, res);

                            id = req.params.id;
                            _req$body = req.body, groupName = _req$body.groupName, groupDescription = _req$body.groupDescription, electionDate = _req$body.electionDate;
                            _context4.prev = 3;
                            _context4.next = 6;
                            return _electionGroupModel2.default.findByIdAndUpdate(id, { groupName: groupName, groupDescription: groupDescription, electionDate: electionDate });

                        case 6:
                            electiongroups = _context4.sent;

                            if (electiongroups) {
                                _context4.next = 9;
                                break;
                            }

                            return _context4.abrupt('return', res.status(401).json({ message: "No election group found" }));

                        case 9:
                            res.json({ message: 'Election Group Update successful' });
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

    // '/evoting_api/v1/electiongroup/delete/:id' Endpoint to delete an election from the database [Auth Required]
    api.delete('/delete/:id', function () {
        var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(req, res) {
            var electiongroups;
            return regeneratorRuntime.wrap(function _callee5$(_context5) {
                while (1) {
                    switch (_context5.prev = _context5.next) {
                        case 0:
                            (0, _accessToken.validateToken)(req, res);

                            _context5.prev = 1;
                            _context5.next = 4;
                            return _electionGroupModel2.default.findByIdAndDelete(req.params.id);

                        case 4:
                            electiongroups = _context5.sent;


                            if (electiongroups) {
                                res.json({ message: "Election Group deleted successfully" });
                            }
                            _context5.next = 11;
                            break;

                        case 8:
                            _context5.prev = 8;
                            _context5.t0 = _context5['catch'](1);

                            res.status(401).json({ message: "Election Group not found" });

                        case 11:
                        case 'end':
                            return _context5.stop();
                    }
                }
            }, _callee5, undefined, [[1, 8]]);
        }));

        return function (_x9, _x10) {
            return _ref6.apply(this, arguments);
        };
    }());

    return api;
};
//# sourceMappingURL=electionGroupController.js.map