"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = __importDefault(require("nodemailer"));
const key = "dkgkkkbpzmengbis";
const transporter = nodemailer_1.default.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    auth: {
        user: 'eo.verify@gmail.com',
        pass: key
    }
});
let sendotp = undefined;
function sendOtp(email, appName = "AutoSpace") {
    const otp = Math.floor(Math.random() * 10000);
    const mailOption = {
        from: `${appName} <autoSpace.verify@gmail.com>`,
        to: email,
        subject: "Otp verification",
        html: `<h2>Your verification code for ${appName} is : ${otp} </h2>`,
    };
    transporter.sendMail(mailOption, (err, info) => {
        if (err)
            console.log(err);
    });
    sendotp = otp;
    console.log(otp);
    return true;
}
function veryfyOtp(otp) {
    if (sendotp == otp) {
        return true;
    }
}
exports.default = {
    sendOtp, veryfyOtp
};
//# sourceMappingURL=sendmail.js.map