'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _express = require('express');

var _userModel = require('../models/userModel');

var _userModel2 = _interopRequireDefault(_userModel);

var _lgaModel = require('../models/lgaModel');

var _lgaModel2 = _interopRequireDefault(_lgaModel);

var _electionModel = require('../models/electionModel');

var _electionModel2 = _interopRequireDefault(_electionModel);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

exports.default = function (_ref) {
    var config = _ref.config,
        db = _ref.db;


    var api = (0, _express.Router)();

    // '/evoting_api/v1/userelection/:id' Endpoint to get voters
    api.get('/:id', function () {
        var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(req, res) {
            var id, user, lgaDetails, elections, output;
            return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            id = req.params.id;
                            _context.prev = 1;
                            _context.next = 4;
                            return _userModel2.default.findOne({ cardID: id }, { __v: 0 });

                        case 4:
                            user = _context.sent;

                            if (user) {
                                _context.next = 7;
                                break;
                            }

                            return _context.abrupt('return', res.status(401).json({ message: "No user found" }));

                        case 7:
                            _context.next = 9;
                            return _lgaModel2.default.findOne({ LGA: user.lga });

                        case 9:
                            lgaDetails = _context.sent;

                            if (lgaDetails) {
                                _context.next = 12;
                                break;
                            }

                            return _context.abrupt('return', res.status(401).json({ message: "LGA not found" }));

                        case 12:
                            _context.next = 14;
                            return _electionModel2.default.find({
                                $or: [{ electionCode: lgaDetails.FC }, { electionCode: lgaDetails.SD }, { electionCode: "PD/111/NIG" }]
                            });

                        case 14:
                            elections = _context.sent;

                            if (!(elections.length < 1)) {
                                _context.next = 17;
                                break;
                            }

                            return _context.abrupt('return', res.status(401).json({ message: "Elections not found!" }));

                        case 17:
                            output = { user: user, elections: elections };

                            res.json(output);
                            _context.next = 25;
                            break;

                        case 21:
                            _context.prev = 21;
                            _context.t0 = _context['catch'](1);

                            console.log(_context.t0);
                            res.status(422).json({ error: "The error" });

                        case 25:
                        case 'end':
                            return _context.stop();
                    }
                }
            }, _callee, undefined, [[1, 21]]);
        }));

        return function (_x, _x2) {
            return _ref2.apply(this, arguments);
        };
    }());

    return api;
};
//# sourceMappingURL=userElection.js.map