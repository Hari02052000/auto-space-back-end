"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = __importDefault(require("../controllers/user/authController"));
const isAuth_1 = __importDefault(require("../helpers/isAuth"));
const router = (0, express_1.Router)();
router.post('/register', authController_1.default.register);
router.post('/login', authController_1.default.login);
router.post('/verify-otp', authController_1.default.verifyOtp);
router.post('/verify-email', authController_1.default.verifyEmail);
//here cheak using the changepassword token valid or not
router.post('/change-password', isAuth_1.default.changePasswordToken, authController_1.default.changepassword);
exports.default = router;
//# sourceMappingURL=userRoutes.js.map