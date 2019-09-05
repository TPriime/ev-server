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
            var existingElection, parties, data, election;
            return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            (0, _accessToken.validateToken)(req, res);

                            _context.prev = 1;
                            _context.next = 4;
                            return _electionModel2.default.findOne({ electionCode: req.body.electionCode });

                        case 4:
                            existingElection = _context.sent;

                            if (!existingElection) {
                                _context.next = 7;
                                break;
                            }

                            return _context.abrupt('return', res.status(400).json({ message: 'Election with code already exist' }));

                        case 7:
                            parties = (0, _accessToken.checkPartiesUnique)(req.body.electionParties);
                            data = {
                                electionCode: req.body.electionCode,
                                electionParties: parties,
                                electionName: req.body.electionName,
                                electionDate: req.body.electionDate,
                                electionAvailable: false
                            };
                            _context.next = 11;
                            return _electionModel2.default.create(data);

                        case 11:
                            election = _context.sent;

                            if (!election) {
                                _context.next = 16;
                                break;
                            }

                            res.json({
                                message: "Election Created Successfully",
                                election: election
                            });
                            _context.next = 17;
                            break;

                        case 16:
                            return _context.abrupt('return', res.status(401).json({ message: 'Election not created' }));

                        case 17:
                            _context.next = 22;
                            break;

                        case 19:
                            _context.prev = 19;
                            _context.t0 = _context['catch'](1);

                            res.status(422).json(_context.t0);

                        case 22:
                        case 'end':
                            return _context.stop();
                    }
                }
            }, _callee, undefined, [[1, 19]]);
        }));

        return function (_x, _x2) {
            return _ref2.apply(this, arguments);
        };
    }());

    // '/evoting_api/v1/elections/search' Endpoint to get an Election in the database by electionCode [Auth Required]
    api.get('/search', function () {
        var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(req, res) {
            var q, result;
            return regeneratorRuntime.wrap(function _callee2$(_context2) {
                while (1) {
                    switch (_context2.prev = _context2.next) {
                        case 0:
                            (0, _accessToken.validateToken)(req, res);

                            q = void 0, result = void 0;
                            _context2.prev = 2;

                            if (!req.query.electioncode) {
                                _context2.next = 10;
                                break;
                            }

                            q = req.query.electioncode;
                            _context2.next = 7;
                            return _electionModel2.default.find({
                                electionCode: {
                                    $regex: new RegExp(q, 'i')
                                } }, {
                                __v: 0
                            });

                        case 7:
                            result = _context2.sent;
                            _context2.next = 30;
                            break;

                        case 10:
                            if (!req.query.electionname) {
                                _context2.next = 17;
                                break;
                            }

                            q = req.query.electionname;
                            _context2.next = 14;
                            return _electionModel2.default.find({
                                electionName: {
                                    $regex: new RegExp(q, 'i')
                                } }, {
                                __v: 0
                            });

                        case 14:
                            result = _context2.sent;
                            _context2.next = 30;
                            break;

                        case 17:
                            if (!req.query.electionDate) {
                                _context2.next = 24;
                                break;
                            }

                            q = new Date(req.query.electionDate);
                            _context2.next = 21;
                            return _electionModel2.default.find({ electionDate: { $eq: q } }, { __v: 0 });

                        case 21:
                            result = _context2.sent;
                            _context2.next = 30;
                            break;

                        case 24:
                            if (!(req.query.electionname && req.query.electioncode)) {
                                _context2.next = 30;
                                break;
                            }

                            q = req.query.electionname;
                            p = req.query.electioncode;
                            _context2.next = 29;
                            return _electionModel2.default.find({
                                $or: [{ electionName: { $regex: new RegExp(q, 'i') } }, { electionCode: { $regex: new RegExp(p, 'i') } }]
                            }, {
                                __v: 0
                            });

                        case 29:
                            result = _context2.sent;

                        case 30:
                            if (result.length === 0) res.status(401).json({ message: "Election not found" });
                            res.json(result);
                            _context2.next = 38;
                            break;

                        case 34:
                            _context2.prev = 34;
                            _context2.t0 = _context2['catch'](2);

                            console.log(_context2.t0);
                            res.status(417).json({ message: "Could not find any Election", error: _context2.t0 });

                        case 38:
                        case 'end':
                            return _context2.stop();
                    }
                }
            }, _callee2, undefined, [[2, 34]]);
        }));

        return function (_x3, _x4) {
            return _ref3.apply(this, arguments);
        };
    }());

    // '/evoting_api/v1/elections/' Endpoint to access all Elections in the database [Auth Required]
    api.get('/', function () {
        var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(req, res) {
            var elections;
            return regeneratorRuntime.wrap(function _callee3$(_context3) {
                while (1) {
                    switch (_context3.prev = _context3.next) {
                        case 0:
                            (0, _accessToken.validateToken)(req, res);

                            _context3.prev = 1;
                            _context3.next = 4;
                            return _electionModel2.default.find();

                        case 4:
                            elections = _context3.sent;

                            if (!(elections === 0)) {
                                _context3.next = 7;
                                break;
                            }

                            return _context3.abrupt('return', res.status(401).json({ message: "No Election found" }));

                        case 7:
                            res.json(elections);
                            _context3.next = 13;
                            break;

                        case 10:
                            _context3.prev = 10;
                            _context3.t0 = _context3['catch'](1);

                            res.status(417).json({ message: "Could not get Elections details" });

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

    // '/evoting_api/v1/elections/update/:id' Endpoint to update an election details
    api.put('/update/:id', function () {
        var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(req, res) {
            var id, _req$body, electionParties, electionName, electionDate, electionAvailable, election;

            return regeneratorRuntime.wrap(function _callee4$(_context4) {
                while (1) {
                    switch (_context4.prev = _context4.next) {
                        case 0:
                            (0, _accessToken.validateToken)(req, res);

                            id = req.params.id;
                            _req$body = req.body, electionParties = _req$body.electionParties, electionName = _req$body.electionName, electionDate = _req$body.electionDate, electionAvailable = _req$body.electionAvailable;


                            electionParties = (0, _accessToken.checkPartiesUnique)(electionParties);

                            _context4.prev = 4;
                            _context4.next = 7;
                            return _electionModel2.default.findByIdAndUpdate(id, { electionParties: electionParties, electionName: electionName, electionDate: electionDate, electionAvailable: electionAvailable });

                        case 7:
                            election = _context4.sent;

                            if (election) {
                                _context4.next = 10;
                                break;
                            }

                            return _context4.abrupt('return', res.status(401).json({ message: "No election Found" }));

                        case 10:
                            res.json({ message: 'Election Update successful' });
                            _context4.next = 16;
                            break;

                        case 13:
                            _context4.prev = 13;
                            _context4.t0 = _context4['catch'](4);

                            res.status(422).json({ error: _context4.t0 });

                        case 16:
                        case 'end':
                            return _context4.stop();
                    }
                }
            }, _callee4, undefined, [[4, 13]]);
        }));

        return function (_x7, _x8) {
            return _ref5.apply(this, arguments);
        };
    }());

    // '/evoting_api/v1/elections/delete/:id' Endpoint to delete an election from the database [Auth Required]
    api.delete('/delete/:id', function () {
        var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(req, res) {
            var election;
            return regeneratorRuntime.wrap(function _callee5$(_context5) {
                while (1) {
                    switch (_context5.prev = _context5.next) {
                        case 0:
                            (0, _accessToken.validateToken)(req, res);

                            _context5.prev = 1;
                            _context5.next = 4;
                            return _electionModel2.default.findByIdAndDelete(req.params.id);

                        case 4:
                            election = _context5.sent;


                            if (election) {
                                res.json({ message: "Election deleted successfully" });
                            }
                            _context5.next = 11;
                            break;

                        case 8:
                            _context5.prev = 8;
                            _context5.t0 = _context5['catch'](1);

                            res.status(401).json({ message: "Election not found" });

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
//# sourceMappingURL=electionController.js.map