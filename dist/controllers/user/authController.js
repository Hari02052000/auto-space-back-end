"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const userSchema_1 = __importDefault(require("../../models/userSchema"));
const sendmail_1 = __importDefault(require("../../helpers/sendmail"));
const maxage = 3 * 24 * 60 * 60;
const createToken = (id) => {
    return jsonwebtoken_1.default.sign({ id }, 'key1', { expiresIn: maxage });
};
async function login(req, res) {
    try {
        const { email, password } = req.body;
        let user = await userSchema_1.default.findOne({ email: email });
        if (!user) {
            res.json({ err: 'invalid email or password' });
            return;
        }
        const match = await bcrypt_1.default.compare(password, user.password);
        if (match) {
            const token = createToken(user._id);
            res.json({ access_token: token, isUser: true });
            return;
        }
        res.json({ err: 'invalid email or password' });
        return;
    }
    catch (err) {
        console.log(err);
    }
}
async function register(req, res) {
    try {
        console.log(req.body);
        const { email, password, confpassword, username } = req.body;
        if (password != confpassword) {
            return res.json({ err: 'passwords are not equal' });
        }
        const isEmailExist = await userSchema_1.default.findOne({ email: email });
        if (isEmailExist) {
            return res.json({ err: 'email allredy exist' });
        }
        const isUsernameExist = await userSchema_1.default.findOne({ username: username });
        if (isUsernameExist) {
            return res.json({ err: 'username allredy exist' });
        }
        const user = await userSchema_1.default.create({ email, password, username });
        sendmail_1.default.sendOtp(user.email);
        const token = createToken(user._id);
        res.json({ userCreated: true, access_token: token, email: email });
    }
    catch (err) {
        console.log(err);
    }
}
async function verifyOtp(req, res) {
    try {
        // const { otp, isChangingPassword } = req.body
        // const email = req.body.email || res.locals.email
        // const isVeryfied = sendmail.veryfyOtp(otp)
        const { otp, email } = req.body;
        const isVeryfied = sendmail_1.default.veryfyOtp(otp);
        if (isVeryfied) {
            await userSchema_1.default.findOneAndUpdate({ email }, { $set: { isverified: true } });
            res.json({ verification: true });
        }
        else {
            res.json({ err: 'otp not verified' });
        }
    }
    catch (err) {
        console.log(err);
    }
}
async function verifyEmail(req, res) {
    const email = req.body.email;
    const user = await userSchema_1.default.findOne({ email: email });
    if (user) {
        sendmail_1.default.sendOtp(user.email);
        return res.json({ isUserEmail: true, email: user.email });
    }
    res.json({ err: 'email does not exist' });
}
async function changepassword(req, res) {
    console.log(req.body);
    let { password, confpassword, email } = req.body;
    if (password !== confpassword) {
        return res.json({ err: 'passwords are not equal' });
    }
    password = await bcrypt_1.default.hash(password, 12);
    await userSchema_1.default.findOneAndUpdate({ email: email }, { $set: { password: password } });
    res.json({ isPasswordChanged: true });
}
exports.default = { login, register, verifyOtp, verifyEmail, changepassword };
//# sourceMappingURL=authController.js.map