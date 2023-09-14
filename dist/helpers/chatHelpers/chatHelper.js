"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userSchema_1 = __importDefault(require("../../models/userSchema"));
async function tokenValidate(token) {
    const decoded = jsonwebtoken_1.default.verify(token, 'key1');
    const user = await userSchema_1.default.findOne({ _id: decoded.id });
    if (user) {
        return (user._id).toString();
    }
    else {
        return 'noUser';
    }
}
exports.default = { tokenValidate };
//# sourceMappingURL=chatHelper.js.map