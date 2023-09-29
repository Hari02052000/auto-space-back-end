"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const plansSchema_1 = __importDefault(require("../../models/plansSchema"));
const subscribtionSchema_1 = __importDefault(require("../../models/subscribtionSchema"));
const pdfkit_table_1 = __importDefault(require("pdfkit-table"));
async function getPlans(req, res) {
    const plans = await plansSchema_1.default.find();
    res.json({ plans: plans });
}
async function addplan(req, res) {
    const { name, no_of_cars, validity_in_months, Amount } = req.body;
    const isOldName = await plansSchema_1.default.findOne({ name: name });
    if (isOldName) {
        return res.json({ err: 'name allredy exist' });
    }
    const plan = await plansSchema_1.default.create({ name, no_of_cars, validity_in_months, Amount });
    res.json({ isPlanAdded: true, plan: plan });
}
async function editplan(req, res) {
    const { id, name, no_of_cars, validity_in_months, Amount } = req.body;
    const oldplan = await plansSchema_1.default.findOne({ _id: id });
    if (oldplan?.name != name) {
        const isPlanExist = await plansSchema_1.default.findOne({ name: name });
        if (isPlanExist) {
            return res.json({ err: 'name allredy exist' });
        }
    }
    await plansSchema_1.default.findOneAndUpdate({ _id: id }, { $set: { name, no_of_cars, validity_in_months, Amount } });
    const newPlan = await plansSchema_1.default.findOne({ _id: id });
    res.json({ edited: true, plan: newPlan });
}
async function getSubscriptionDetails(req, res) {
    try {
        let { fromDate, toDate } = req.body;
        fromDate = new Date(fromDate).setHours(0, 0, 0);
        toDate = new Date(toDate).setHours(23, 59, 59);
        let subscriptions = await subscribtionSchema_1.default.find({ startDate: {
                $gte: fromDate,
                $lte: toDate,
            } }).populate('user').populate('plan');
        let doc = new pdfkit_table_1.default();
        doc.margin = 0;
        doc.size = [1000, 1000];
        let details = [];
        subscriptions.forEach(subscription => {
            details.push([subscription._id, subscription.plan.name, subscription.user.username, subscription.startDate.toLocaleDateString(), subscription.plan.Amount, subscription.isPayed]);
        });
        const title = 'subscription details';
        const headers = ['id', 'plan', 'username', 'taked date', 'plan amount', 'payment status'];
        const rows = details;
        doc.table({ title, headers, rows }, {
            columnsSize: [200, 50, 100, 100, 60, 50],
        });
        res.setHeader('Content-disposition', 'attachment; filename=subscription-details.pdf');
        res.setHeader('Content-type', 'application/pdf');
        doc.pipe(res);
        doc.end();
    }
    catch (err) {
    }
}
exports.default = { getPlans, addplan, editplan, getSubscriptionDetails };
//# sourceMappingURL=adminPlanController.js.map