"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
const multerFilter = function (req, file, cb) {
    if (file.mimetype.startsWith('image')) {
        cb(null, true);
    }
    else {
        console.log('err');
        cb(null, false);
    }
};
const upload = (0, multer_1.default)({
    storage: multer_1.default.diskStorage({}),
    fileFilter: multerFilter,
}).array('images', 10);
function uploadFiles(req, res, next) {
    upload(req, res, (err) => {
        if (err instanceof multer_1.default.MulterError) {
            console.log(err.message);
        }
        else if (err) {
            console.log(err.message);
        }
        next();
    });
}
exports.default = {
    uploadFiles
};
//# sourceMappingURL=multer.js.map