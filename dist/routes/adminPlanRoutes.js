"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const adminPlanController_1 = __importDefault(require("../controllers/admin/adminPlanController"));
const auth_1 = __importDefault(require("../helpers/adminhelpers/auth"));
const router = (0, express_1.Router)();
router.get('/get-plans', auth_1.default.isAdmin, adminPlanController_1.default.getPlans);
router.post('/edit-plan', auth_1.default.isAdmin, adminPlanController_1.default.editplan);
router.post('/add-plan', auth_1.default.isAdmin, adminPlanController_1.default.addplan);
router.post('/get-subscription-details', auth_1.default.isAdmin, adminPlanController_1.default.getSubscriptionDetails);
exports.default = router;
//# sourceMappingURL=adminPlanRoutes.js.map