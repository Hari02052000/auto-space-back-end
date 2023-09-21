"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userSchema_1 = __importDefault(require("../../models/userSchema"));
async function tokenValidate(token) {
    return new Promise((resolve, reject) => {
        jsonwebtoken_1.default.verify(token, 'key1', async (err, decoded) => {
            if (err) {
                console.log(err);
                reject(err);
            }
            else if (decoded) {
                const decodedPayload = decoded;
                const user = await userSchema_1.default.findOne({ _id: decodedPayload.id });
                if (user) {
                    if (user.isBlocked) {
                        resolve('noUser');
                    }
                    resolve(user._id.toString());
                }
                else {
                    resolve('noUser');
                }
            }
        });
    });
}
exports.default = { tokenValidate };
//# sourceMappingURL=chatHelper.js.map