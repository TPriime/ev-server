'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _express = require('express');

var _votingModel = require('../models/votingModel');

var _votingModel2 = _interopRequireDefault(_votingModel);

var _accessToken = require('../middleware/accessToken');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

exports.default = function (_ref) {
    var config = _ref.config,
        db = _ref.db;


    var api = (0, _express.Router)();

    // '/evoting_api/v1/votes/cast' Endpoint to cast a vote
    api.post('/cast', function () {
        var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(req, res) {
            var voterID, data, votes;
            return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            _context.prev = 0;
                            _context.next = 3;
                            return _votingModel2.default.findById(req.body.voter);

                        case 3:
                            voterID = _context.sent;

                            if (!voterID) {
                                _context.next = 6;
                                break;
                            }

                            return _context.abrupt('return', res.status(400).json({ message: 'Voter has Voted Before!!!' }));

                        case 6:
                            ;

                            data = {
                                voter: req.body.voter,
                                votes: req.body.votes,
                                device: req.body.device,
                                voteTime: new Date(req.body.voteTime)
                            };
                            _context.next = 10;
                            return _votingModel2.default.create(data);

                        case 10:
                            votes = _context.sent;

                            if (!votes) {
                                _context.next = 15;
                                break;
                            }

                            res.json({
                                message: "Vote Counted Successfully"
                            });
                            _context.next = 16;
                            break;

                        case 15:
                            return _context.abrupt('return', res.status(401).json({ message: 'Voting not Successful!' }));

                        case 16:
                            _context.next = 21;
                            break;

                        case 18:
                            _context.prev = 18;
                            _context.t0 = _context['catch'](0);
                            return _context.abrupt('return', res.status(422).json({ error: _context.t0 }));

                        case 21:
                        case 'end':
                            return _context.stop();
                    }
                }
            }, _callee, undefined, [[0, 18]]);
        }));

        return function (_x, _x2) {
            return _ref2.apply(this, arguments);
        };
    }());

    // '/evoting_api/v1/votes/search' Endpoint to get an Election in the database by electionCode [Auth Required]
    api.get('/search', function () {
        var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(req, res) {
            var q, p, result;
            return regeneratorRuntime.wrap(function _callee2$(_context2) {
                while (1) {
                    switch (_context2.prev = _context2.next) {
                        case 0:
                            // validateToken(req, res);

                            q = void 0, p = void 0, result = void 0;
                            _context2.prev = 1;

                            if (!req.query.device) {
                                _context2.next = 9;
                                break;
                            }

                            q = req.query.device;
                            _context2.next = 6;
                            return _votingModel2.default.find({
                                device: {
                                    $regex: new RegExp(q, 'i')
                                } }, {
                                __v: 0
                            });

                        case 6:
                            result = _context2.sent;
                            _context2.next = 22;
                            break;

                        case 9:
                            if (!(req.query.election && req.query.party)) {
                                _context2.next = 17;
                                break;
                            }

                            q = req.query.election;
                            p = req.query.party;
                            _context2.next = 14;
                            return _votingModel2.default.find({
                                $and: [{ "votes.election": { $regex: new RegExp(q, 'i') } }, { "votes.party": { $regex: new RegExp(p, 'i') } }]
                            }, { __v: 0, voter: 0, _id: 0, voteTime: 0, device: 0 });

                        case 14:
                            result = _context2.sent;
                            _context2.next = 22;
                            break;

                        case 17:
                            if (!req.query.election) {
                                _context2.next = 22;
                                break;
                            }

                            q = req.query.election;
                            _context2.next = 21;
                            return _votingModel2.default.find({ "votes.election": q }, { __v: 0, voter: 0, _id: 0, voteTime: 0, device: 0 });

                        case 21:
                            result = _context2.sent;

                        case 22:
                            if (result.length === 0) res.status(401).json({ message: "Election not found" });
                            res.json(result);
                            _context2.next = 30;
                            break;

                        case 26:
                            _context2.prev = 26;
                            _context2.t0 = _context2['catch'](1);

                            console.log(_context2.t0);
                            res.status(417).json({ message: "Could not find any Election", error: _context2.t0 });

                        case 30:
                        case 'end':
                            return _context2.stop();
                    }
                }
            }, _callee2, undefined, [[1, 26]]);
        }));

        return function (_x3, _x4) {
            return _ref3.apply(this, arguments);
        };
    }());

    // '/evoting_api/v1/votes/' Endpoint to access all Votes in the database [NO Auth Required]
    api.get('/', function () {
        var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(req, res) {
            var votes;
            return regeneratorRuntime.wrap(function _callee3$(_context3) {
                while (1) {
                    switch (_context3.prev = _context3.next) {
                        case 0:
                            _context3.prev = 0;
                            _context3.next = 3;
                            return _votingModel2.default.find({}, { __v: 0, voteTime: 0, device: 0, _id: 0 }).populate({ path: 'voter', select: ['state', 'lga'] });

                        case 3:
                            votes = _context3.sent;

                            if (!(votes === 0)) {
                                _context3.next = 6;
                                break;
                            }

                            return _context3.abrupt('return', res.status(401).json({ message: "No Vote found" }));

                        case 6:

                            res.json(votes);
                            _context3.next = 12;
                            break;

                        case 9:
                            _context3.prev = 9;
                            _context3.t0 = _context3['catch'](0);

                            res.status(417).json({ message: "Could not get the required data" });

                        case 12:
                        case 'end':
                            return _context3.stop();
                    }
                }
            }, _callee3, undefined, [[0, 9]]);
        }));

        return function (_x5, _x6) {
            return _ref4.apply(this, arguments);
        };
    }());

    return api;
};
//# sourceMappingURL=votingController.js.map