'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _userModel = require('../models/userModel');

var _userModel2 = _interopRequireDefault(_userModel);

var _votingModel = require('../models/votingModel');

var _votingModel2 = _interopRequireDefault(_votingModel);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

exports.default = function (_ref) {
  var config = _ref.config,
      db = _ref.db;

  var api = (0, _express.Router)();

  // '/evoting_api/v1/voter/cid'
  api.get('/:cid', function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(req, res) {
      var cid, user, voter;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              cid = req.params.cid;
              _context.prev = 1;
              _context.next = 4;
              return _userModel2.default.findOne({ cardID: cid }, { __v: 0 });

            case 4:
              user = _context.sent;

              if (user) {
                _context.next = 7;
                break;
              }

              return _context.abrupt('return', res.status(404).json({ message: "No user found" }));

            case 7:
              console.log(user._id);

              _context.next = 10;
              return _votingModel2.default.findOne({ voter: user._id }, { __v: 0 });

            case 10:
              voter = _context.sent;


              if (voter) {
                res.status(404).json({});
              } else {
                res.json(user);
              }

              _context.next = 17;
              break;

            case 14:
              _context.prev = 14;
              _context.t0 = _context['catch'](1);

              res.status(422).json({ error: "error at voter deatails" });

            case 17:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, undefined, [[1, 14]]);
    }));

    return function (_x, _x2) {
      return _ref2.apply(this, arguments);
    };
  }());

  return api;
};
//# sourceMappingURL=voterController.js.map