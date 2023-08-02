"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const userSchema_1 = __importDefault(require("../../models/userSchema"));
async function findUsers(req, res) {
    const users = await userSchema_1.default.find();
    res.json({ users: users });
}
async function blockUser(req, res) {
    const id = req.body.id;
    await userSchema_1.default.findOneAndUpdate({ _id: id }, { $set: { isBlocked: true } });
    res.json({ blocked: true, id: id });
}
async function unBlockUser(req, res) {
    const id = req.body.id;
    await userSchema_1.default.findOneAndUpdate({ _id: id }, { $set: { isBlocked: false } });
    res.json({ unBlocked: true, id: id });
}
exports.default = { findUsers, blockUser, unBlockUser };
//# sourceMappingURL=userControllers.js.map