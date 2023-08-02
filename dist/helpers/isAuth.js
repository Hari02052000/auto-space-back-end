"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userSchema_1 = __importDefault(require("../models/userSchema"));
const sendmail_1 = __importDefault(require("./sendmail"));
function isAuth(req, res, next) {
    let user = undefined;
    const headers = req.headers.usertoken;
    if (typeof headers === 'string') {
        const token = headers.split(' ')[1];
        if (token) {
            jsonwebtoken_1.default.verify(token, 'key1', async (err, decoded) => {
                if (err)
                    res.json({ err: err });
                else if (decoded) {
                    const decodedPayload = decoded; // Type assertion
                    user = await userSchema_1.default.findOne({ _id: decodedPayload.id });
                    res.locals.user = user;
                    if (user?.isBlocked) {
                        return res.json({ err: 'user blocked' });
                    }
                    if (!(user?.isverified)) {
                        if (user)
                            sendmail_1.default.sendOtp(user.email);
                        res.locals.email = user?.email;
                        return res.json({ err: 'user not verified' });
                    }
                    next();
                }
            });
        }
        else {
            res.json({ err: 'token not found' });
        }
    }
}
function isBlocked(req, res, next) {
    let user = undefined;
    const headers = req.headers.usertoken;
    if (typeof headers === 'string') {
        const token = headers.split(' ')[1];
        if (token) {
            jsonwebtoken_1.default.verify(token, 'key1', async (err, decoded) => {
                if (err)
                    res.json({ err: err });
                else if (decoded) {
                    const decodedPayload = decoded; // Type assertion
                    user = await userSchema_1.default.findOne({ _id: decodedPayload.id });
                    if (user?.isBlocked) {
                        return res.json({ err: 'user blocked' });
                    }
                    next();
                }
            });
        }
        else {
            next();
        }
    }
}
function changePasswordToken(req, res, next) {
    const headers = req.headers.Authorization;
    if (typeof headers === 'string') {
        const token = headers.split(' ')[1];
        if (token) {
            jsonwebtoken_1.default.verify(token, 'key2', async (err, decoded) => {
                if (err)
                    res.json({ err: err });
                else
                    next();
            });
        }
    }
}
exports.default = { isAuth, isBlocked, changePasswordToken };
//# sourceMappingURL=isAuth.js.map