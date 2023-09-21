"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const isAuth_1 = __importDefault(require("../helpers/isAuth"));
const userSubscriptionController_1 = __importDefault(require("../controllers/user/userSubscriptionController"));
const router = (0, express_1.Router)();
router.get('/get-plans', isAuth_1.default.isBlocked, userSubscriptionController_1.default.getPlans);
router.post('/create-payment', isAuth_1.default.isAuth, userSubscriptionController_1.default.createPayment);
exports.default = router;
//# sourceMappingURL=userSubscriptionRoutes.js.map