"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userControllers_1 = __importDefault(require("../controllers/admin/userControllers"));
const auth_1 = __importDefault(require("../helpers/adminhelpers/auth"));
const router = (0, express_1.Router)();
router.get('/get-users', auth_1.default.isAdmin, userControllers_1.default.findUsers);
router.put('/block-user', auth_1.default.isAdmin, userControllers_1.default.blockUser);
router.put('/unblock-user', auth_1.default.isAdmin, userControllers_1.default.unBlockUser);
exports.default = router;
//# sourceMappingURL=adminUserRoutes.js.map