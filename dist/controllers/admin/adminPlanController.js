"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const plansSchema_1 = __importDefault(require("../../models/plansSchema"));
async function getPlans(req, res) {
    const plans = await plansSchema_1.default.find();
    res.json({ plans: plans });
}
exports.default = { getPlans };
//# sourceMappingURL=adminPlanController.js.map