"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("../helpers/multer"));
const authController_1 = __importDefault(require("../controllers/user/authController"));
const isAuth_1 = __importDefault(require("../helpers/isAuth"));
const userController_1 = __importDefault(require("../controllers/user/userController"));
const router = (0, express_1.Router)();
router.post('/register', authController_1.default.register);
router.post('/login', authController_1.default.login);
router.post('/verify-otp', authController_1.default.verifyOtp);
router.post('/verify-email', authController_1.default.verifyEmail);
router.post('/upload-profile', isAuth_1.default.isAuth, multer_1.default.uploadFiles, userController_1.default.uploadProfile);
router.post('/change-password', authController_1.default.changepassword);
router.get('/profile', isAuth_1.default.isAuth, userController_1.default.getprofile);
router.post('/edit-details', isAuth_1.default.isAuth, userController_1.default.editDetails);
router.get('/get-messages', isAuth_1.default.isAuth, userController_1.default.getMessages);
exports.default = router;
//# sourceMappingURL=userRoutes.js.map