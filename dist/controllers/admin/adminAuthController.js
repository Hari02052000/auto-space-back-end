"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const adminSchema_1 = __importDefault(require("../../models/adminSchema"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const sendmail_1 = __importDefault(require("../../helpers/sendmail"));
const productSchema_1 = __importDefault(require("../../models/productSchema"));
const brandSchema_1 = __importDefault(require("../../models/brandSchema"));
const maxage = 3 * 24 * 60 * 60;
const createToken = (id) => {
    return jsonwebtoken_1.default.sign({ id }, 'key1', { expiresIn: maxage });
};
async function login(req, res) {
    try {
        const { email, password } = req.body;
        let admin = await adminSchema_1.default.findOne({ email: email });
        if (!admin) {
            res.json({ err: 'invalid email or password' });
            return;
        }
        const match = await bcrypt_1.default.compare(password, admin.password);
        if (match) {
            const token = createToken(admin._id);
            res.json({ access_token: token, isAdmin: true });
            return;
        }
        res.json({ err: 'invalid email or password' });
        return;
    }
    catch (err) {
        console.log(err);
    }
}
async function verifyOtp(req, res) {
    try {
        const { otp } = req.body;
        const email = req.body.email;
        const isVeryfied = sendmail_1.default.veryfyOtp(otp);
        if (isVeryfied) {
            const token = jsonwebtoken_1.default.sign('adminPassword', 'key2');
            return res.json({ verification: true, isChangingPassword: token });
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
    const admin = await adminSchema_1.default.findOne({ email: email });
    if (admin) {
        sendmail_1.default.sendOtp(admin.email);
        return res.json({ isUserEmail: true, email: admin.email });
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
    await adminSchema_1.default.findOneAndUpdate({ email: email }, { $set: { password: password } });
    res.json({ isPasswordChanged: true });
}
async function getCharts(req, res) {
    try {
        const listingDistribution = await productSchema_1.default.aggregate([
            {
                $group: {
                    _id: '$brandId',
                    count: { $sum: 1 },
                },
            },
        ]);
        const brands = await brandSchema_1.default.find();
        const labels = brands.map(brand => brand.name);
        const counts = listingDistribution.map((entry) => entry.count);
        res.json({ labels, counts });
    }
    catch (error) {
        console.error(error);
    }
}
exports.default = { login, verifyEmail, verifyOtp, changepassword, getCharts };
//# sourceMappingURL=adminAuthController.js.map