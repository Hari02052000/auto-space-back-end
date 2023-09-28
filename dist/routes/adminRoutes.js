"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const adminAuthController_1 = __importDefault(require("../controllers/admin/adminAuthController"));
const router = (0, express_1.Router)();
router.get('/');
router.post('/login', adminAuthController_1.default.login);
router.post('/verify-email', adminAuthController_1.default.verifyEmail);
router.post('/change-password', adminAuthController_1.default.changepassword);
exports.default = router;
//# sourceMappingURL=adminRoutes.js.map