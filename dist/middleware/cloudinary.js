'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.deleteImage = exports.addProfilePicture = undefined;

var _cloudinary = require('cloudinary');

var _cloudinary2 = _interopRequireDefault(_cloudinary);

var _ENV = require('../middleware/ENV.json');

var _ENV2 = _interopRequireDefault(_ENV);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

_cloudinary2.default.config({
    cloud_name: _ENV2.default.cloud_name,
    api_key: _ENV2.default.api_key,
    api_secret: _ENV2.default.api_secret
});

//async/await is used here to ensure that file uploads before the next function happens
var addProfilePicture = exports.addProfilePicture = function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(filename) {
        var upload;
        return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        _context.prev = 0;
                        _context.next = 3;
                        return _cloudinary2.default.uploader.upload(filename, { resource_type: "image", folder: "ProfilePictures", use_filename: true });

                    case 3:
                        upload = _context.sent;
                        return _context.abrupt('return', upload);

                    case 7:
                        _context.prev = 7;
                        _context.t0 = _context['catch'](0);
                        return _context.abrupt('return', {
                            message: "Could not upload image",
                            error: _context.t0
                        });

                    case 10:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, undefined, [[0, 7]]);
    }));

    return function addProfilePicture(_x) {
        return _ref.apply(this, arguments);
    };
}();

var deleteImage = exports.deleteImage = function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(publicId) {
        var upload;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
            while (1) {
                switch (_context2.prev = _context2.next) {
                    case 0:
                        _context2.prev = 0;
                        _context2.next = 3;
                        return _cloudinary2.default.uploader.destroy(publicId, { resource_type: "image" });

                    case 3:
                        upload = _context2.sent;
                        return _context2.abrupt('return', upload);

                    case 7:
                        _context2.prev = 7;
                        _context2.t0 = _context2['catch'](0);
                        return _context2.abrupt('return', _context2.t0);

                    case 10:
                    case 'end':
                        return _context2.stop();
                }
            }
        }, _callee2, undefined, [[0, 7]]);
    }));

    return function deleteImage(_x2) {
        return _ref2.apply(this, arguments);
    };
}();
//# sourceMappingURL=cloudinary.js.map