'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _express = require('express');

var _electionModel = require('../models/electionModel');

var _electionModel2 = _interopRequireDefault(_electionModel);

var _accessToken = require('../middleware/accessToken');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

exports.default = function (_ref) {
    var config = _ref.config,
        db = _ref.db;


    var api = (0, _express.Router)();

    // '/evoting_api/v1/elections/create' Endpoint to create a new Election [Auth Required]
    api.post('/create', function () {
        var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(req, res) {
            var data, election;
            return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            (0, _accessToken.validateToken)(req, res);

                            _context.prev = 1;
                            data = {
                                electionCode: req.body.electionCode,
                                electionParties: req.body.parties,
                                electionName: req.body.electionName,
                                electionDate: req.body.electionDate
                            };
                            _context.next = 5;
                            return _electionModel2.default.create(data);

                        case 5:
                            election = _context.sent;


                            if (election) {
                                res.json({
                                    message: "Election Created Successfully",
                                    election: election
                                });
                            }
                            _context.next = 12;
                            break;

                        case 9:
                            _context.prev = 9;
                            _context.t0 = _context['catch'](1);

                            res.status(422).json(_context.t0);

                        case 12:
                        case 'end':
                            return _context.stop();
                    }
                }
            }, _callee, undefined, [[1, 9]]);
        }));

        return function (_x, _x2) {
            return _ref2.apply(this, arguments);
        };
    }());

    // '/evoting_api/v1/elections/:id' Endpoint to get an Election in the database by Id [Auth Required]
    api.get('/:id', function () {
        var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(req, res) {
            var result;
            return regeneratorRuntime.wrap(function _callee2$(_context2) {
                while (1) {
                    switch (_context2.prev = _context2.next) {
                        case 0:
                            (0, _accessToken.validateToken)(req, res);

                            _context2.prev = 1;
                            _context2.next = 4;
                            return _electionModel2.default.findById(req.params.id);

                        case 4:
                            result = _context2.sent;


                            if (result) {
                                res.json(result);
                            }
                            _context2.next = 11;
                            break;

                        case 8:
                            _context2.prev = 8;
                            _context2.t0 = _context2['catch'](1);

                            res.status(417).json({ message: "Could not find requested Election" });

                        case 11:
                        case 'end':
                            return _context2.stop();
                    }
                }
            }, _callee2, undefined, [[1, 8]]);
        }));

        return function (_x3, _x4) {
            return _ref3.apply(this, arguments);
        };
    }());

    // '/evoting_api/v1/elections/search/:electionCode' Endpoint to get an Election in the database by Id [Auth Required]
    api.get('/search/:electionCode', function () {
        var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(req, res) {
            var searchParam, result;
            return regeneratorRuntime.wrap(function _callee3$(_context3) {
                while (1) {
                    switch (_context3.prev = _context3.next) {
                        case 0:
                            (0, _accessToken.validateToken)(req, res);

                            searchParam = req.params.electionCode;
                            _context3.prev = 2;
                            _context3.next = 5;
                            return _electionModel2.default.find({ electionCode: /^searchParam/i });

                        case 5:
                            result = _context3.sent;


                            if (result) {
                                res.json(result);
                            }
                            _context3.next = 12;
                            break;

                        case 9:
                            _context3.prev = 9;
                            _context3.t0 = _context3['catch'](2);

                            res.status(417).json({ message: "Could not find any Election" });

                        case 12:
                        case 'end':
                            return _context3.stop();
                    }
                }
            }, _callee3, undefined, [[2, 9]]);
        }));

        return function (_x5, _x6) {
            return _ref4.apply(this, arguments);
        };
    }());

    // '/evoting_api/v1/elections/' Endpoint to access all Elections in the database [Auth Required]
    api.get('/', function () {
        var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(req, res) {
            var elections;
            return regeneratorRuntime.wrap(function _callee4$(_context4) {
                while (1) {
                    switch (_context4.prev = _context4.next) {
                        case 0:
                            (0, _accessToken.validateToken)(req, res);

                            _context4.prev = 1;
                            _context4.next = 4;
                            return _electionModel2.default.find();

                        case 4:
                            elections = _context4.sent;

                            if (!(elections === 0)) {
                                _context4.next = 7;
                                break;
                            }

                            return _context4.abrupt('return', res.status(401).json({ message: "No Election found" }));

                        case 7:
                            res.json(elections);
                            _context4.next = 13;
                            break;

                        case 10:
                            _context4.prev = 10;
                            _context4.t0 = _context4['catch'](1);

                            res.status(417).json({ message: "Could not get Elections details" });

                        case 13:
                        case 'end':
                            return _context4.stop();
                    }
                }
            }, _callee4, undefined, [[1, 10]]);
        }));

        return function (_x7, _x8) {
            return _ref5.apply(this, arguments);
        };
    }());

    // '/evoting_api/v1/elections/update/:id' Endpoint to update an election details
    api.put('/update/:id', function () {
        var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(req, res) {
            var id, _req$body, electionParties, electionName, electionDate, election;

            return regeneratorRuntime.wrap(function _callee5$(_context5) {
                while (1) {
                    switch (_context5.prev = _context5.next) {
                        case 0:
                            (0, _accessToken.validateToken)(req, res);

                            id = req.params.id;
                            _req$body = req.body, electionParties = _req$body.electionParties, electionName = _req$body.electionName, electionDate = _req$body.electionDate;
                            _context5.prev = 3;
                            _context5.next = 6;
                            return _electionModel2.default.findByIdAndUpdate(id, { electionParties: electionParties, electionName: electionName, electionDate: electionDate });

                        case 6:
                            election = _context5.sent;

                            if (election) {
                                _context5.next = 9;
                                break;
                            }

                            return _context5.abrupt('return', res.status(401).json({ message: "No election Found" }));

                        case 9:
                            res.json({ message: 'Election Update successful' });
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

    // '/evoting_api/v1/elections/delete/:id' Endpoint to delete an election from the database [Auth Required]
    api.delete('/delete/:id', function () {
        var _ref7 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(req, res) {
            var election;
            return regeneratorRuntime.wrap(function _callee6$(_context6) {
                while (1) {
                    switch (_context6.prev = _context6.next) {
                        case 0:
                            (0, _accessToken.validateToken)(req, res);

                            _context6.prev = 1;
                            _context6.next = 4;
                            return _electionModel2.default.findByIdAndDelete(req.params.id);

                        case 4:
                            election = _context6.sent;


                            if (election) {
                                res.json({ message: "Election deleted successfully" });
                            }
                            _context6.next = 11;
                            break;

                        case 8:
                            _context6.prev = 8;
                            _context6.t0 = _context6['catch'](1);

                            res.status(401).json({ message: "Election not found" });

                        case 11:
                        case 'end':
                            return _context6.stop();
                    }
                }
            }, _callee6, undefined, [[1, 8]]);
        }));

        return function (_x11, _x12) {
            return _ref7.apply(this, arguments);
        };
    }());

    return api;
};
//# sourceMappingURL=electionController.js.map