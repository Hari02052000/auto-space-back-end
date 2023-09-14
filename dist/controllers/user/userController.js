"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const userSchema_1 = __importDefault(require("../../models/userSchema"));
const productSchema_1 = __importDefault(require("../../models/productSchema"));
const messageSchema_1 = __importStar(require("../../models/messageSchema"));
async function getprofile(req, res) {
    const userid = res.locals.userid;
    await productSchema_1.default.find();
    const user = await userSchema_1.default.findOne({ _id: userid });
    res.json({ user: user });
}
async function getMessages(req, res) {
    const senderId = res.locals.userid;
    const { receverId, productId } = req.query;
    console.log(receverId, productId);
    console.log(senderId);
    const recever = await userSchema_1.default.findOne({ _id: receverId });
    const product = await productSchema_1.default.findOne({ _id: productId }).populate({ path: 'brand' }).populate({ path: 'model' }).populate({ path: 'option' });
    //update the messages status as read and send to client
    await messageSchema_1.default.updateMany({ reciverId: senderId }, { $set: { status: messageSchema_1.MessageStatus.Read } });
    const messages = await messageSchema_1.default.find({ $and: [
            {
                $or: [
                    { senderId: senderId, reciverId: receverId },
                    { senderId: receverId, reciverId: senderId }
                ]
            },
            {
                productId: productId
            }
        ]
    }).sort({ 'timestamps': 1 });
    console.log(messages);
    res.json({ messages: messages, product: product, logedUser: senderId, recever: recever });
}
async function editDetails(req, res) {
    console.log(req.body);
    const userid = res.locals.userid;
    const user = await userSchema_1.default.findOne({ _id: userid });
    if (req.body.email) {
        if (user?.email != req.body.email) {
            const isEmailExist = await userSchema_1.default.findOne({ email: req.body.email });
            if (isEmailExist) {
                return res.json({ err: 'email allredy exist' });
            }
        }
        await userSchema_1.default.findOneAndUpdate({ _id: userid }, { $set: { email: req.body.email } });
    }
    if (req.body.username) {
        await userSchema_1.default.findOneAndUpdate({ _id: userid }, { $set: { username: req.body.username } });
    }
    res.json({ updated: true });
}
exports.default = { getprofile, getMessages, editDetails };
//# sourceMappingURL=userController.js.map