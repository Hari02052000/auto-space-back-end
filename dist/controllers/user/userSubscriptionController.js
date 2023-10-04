"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const plansSchema_1 = __importDefault(require("../../models/plansSchema"));
const subscribtionSchema_1 = __importDefault(require("../../models/subscribtionSchema"));
const userSchema_1 = __importDefault(require("../../models/userSchema"));
const razorpay_1 = __importDefault(require("razorpay"));
const crypto_1 = __importDefault(require("crypto"));
async function getPlans(req, res) {
    try {
        const plans = await plansSchema_1.default.find({ isListed: true });
        res.json({ plans: plans });
    }
    catch (err) {
        res.json({ err: err.message });
    }
}
async function createPayment(req, res) {
    const userId = res.locals.userid;
    try {
        const planId = req.body.planId;
        console.log(planId);
        const userid = res.locals.userid;
        const selectedplan = await plansSchema_1.default.findOne({ _id: planId });
        if (!selectedplan) {
            res.json({ err: 'plan not available' });
        }
        if (selectedplan?.Amount === 0) {
            //find user free trail taken or not if taken 
            const user = await userSchema_1.default.findOne({ _id: userid });
            if (user) {
                if (!user.isTrailUsed) {
                    const startDate = Date.now();
                    const endDate = new Date(startDate);
                    endDate.setMonth(endDate.getMonth() + selectedplan.validity_in_months);
                    const subscription = await subscribtionSchema_1.default.create({
                        plan: selectedplan._id,
                        user: user._id,
                        startDate: startDate,
                        endDate: endDate,
                        isPayed: true
                    });
                    await userSchema_1.default.findOneAndUpdate({ _id: user._id }, { $set: { alowedCars: selectedplan.no_of_cars, isTrailUsed: true } });
                    res.json({ subscribed: true, payed: true });
                }
                else {
                    res.json({ err: 'you allredy taken free trail choose another' });
                }
            }
            else {
                res.json({ err: 'something went wrong please login and continue' });
            }
            //send you canot take this
            //else
            //set user freetrail taken is true and update
        }
        else {
            if (selectedplan?.Amount) {
                const startDate = Date.now();
                const endDate = new Date(startDate);
                endDate.setMonth(endDate.getMonth() + selectedplan.validity_in_months);
                const subscription = await subscribtionSchema_1.default.create({
                    plan: selectedplan._id,
                    user: userId,
                    startDate: startDate,
                    endDate: endDate
                });
                let instance = new razorpay_1.default({
                    key_id: 'rzp_test_8emA6zzli6nGP1',
                    key_secret: 'O4RlOXRxnLAX8IaXM3ifqFZZ'
                });
                let options = {
                    amount: selectedplan?.Amount * 100,
                    currency: "INR",
                    receipt: "" + subscription._id
                };
                instance.orders.create(options, function (err, order) {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        res.json({ created: true, order: order, isOnline: true });
                    }
                    // res.json({created:true,order:order,isOnline:true})
                });
            }
        }
    }
    catch (err) {
    }
}
async function verifyOnlinePayment(req, res) {
    try {
        const userId = res.locals.userid;
        const { response, order } = req.body;
        let hmac = await crypto_1.default.createHmac('sha256', 'O4RlOXRxnLAX8IaXM3ifqFZZ');
        await hmac.update(response.razorpay_order_id + '|' + response.razorpay_payment_id);
        hmac = await hmac.digest('hex');
        if (hmac == response.razorpay_signature) {
            const subscription = await subscribtionSchema_1.default.findOneAndUpdate({ _id: order.receipt }, { $set: { isPayed: true } });
            console.log(subscription);
            const selectedplan = await plansSchema_1.default.findOne({ _id: subscription?.plan });
            await userSchema_1.default.findOneAndUpdate({ _id: userId }, {
                $inc: { alowedCars: selectedplan?.no_of_cars },
                $set: { isTrailUsed: true }
            });
            res.json({ isPayed: true });
        }
        else {
            res.json({ isPayed: false });
        }
    }
    catch (err) {
        res.json({ err });
    }
}
exports.default = {
    getPlans,
    createPayment,
    verifyOnlinePayment
};
//# sourceMappingURL=userSubscriptionController.js.map