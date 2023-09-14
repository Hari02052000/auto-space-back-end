"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userChatController_1 = __importDefault(require("../controllers/user/userChatController"));
const isAuth_1 = __importDefault(require("../helpers/isAuth"));
const router = (0, express_1.Router)();
router.get('/get-chat', isAuth_1.default.isAuth, userChatController_1.default.getChats);
router.post('/create-chat', isAuth_1.default.isAuth, userChatController_1.default.createChat);
exports.default = router;
//# sourceMappingURL=userChatRoute.js.map