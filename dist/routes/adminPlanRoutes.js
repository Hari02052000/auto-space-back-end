"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const adminPlanController_1 = __importDefault(require("../controllers/admin/adminPlanController"));
const router = (0, express_1.Router)();
router.get('/get-plans', adminPlanController_1.default.getPlans);
exports.default = router;
//# sourceMappingURL=adminPlanRoutes.js.map