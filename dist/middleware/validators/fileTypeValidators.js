"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
var validateDisplayPicture = exports.validateDisplayPicture = function validateDisplayPicture(mediaFile) {
    var extension = mediaFile.mimetype;

    if (!extension) return false;

    if (extension === "image/jpg" || extension === "image/png" || extension === "image/jpeg") {
        return true;
    } else {
        return false;
    }
};
//# sourceMappingURL=fileTypeValidators.js.map