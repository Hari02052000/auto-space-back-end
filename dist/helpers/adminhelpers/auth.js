"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const adminSchema_1 = __importDefault(require("../../models/adminSchema"));
function isAdmin(req, res, next) {
    let user = undefined;
    const headers = req.headers.admintoken;
    console.log(headers);
    if (typeof headers === 'string') {
        const token = headers.split(' ')[1];
        if (token) {
            jsonwebtoken_1.default.verify(token, 'key2', async (err, decoded) => {
                if (err) {
                    res.json({ err: err });
                }
                else if (decoded) {
                    const decodedPayload = decoded;
                    user = await adminSchema_1.default.findOne({ _id: decodedPayload.id });
                    console.log('next');
                    next();
                }
            });
        }
        else {
            res.json({ err: 'token not found' });
        }
    }
}
exports.default = { isAdmin };
//# sourceMappingURL=auth.js.map