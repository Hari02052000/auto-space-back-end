"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const productSchema_1 = __importDefault(require("../../models/productSchema"));
async function getProducts(req, res) {
    const products = await productSchema_1.default.find().populate('brand').populate('model').populate('option');
    res.json({ products: products });
}
async function listProduct(req, res) {
    const id = req.body.id;
    await productSchema_1.default.findOneAndUpdate({ _id: id }, { $set: { isListed: true } });
    res.json({ listed: true, id: id });
}
async function unlistProduct(req, res) {
    const id = req.body.id;
    await productSchema_1.default.findOneAndUpdate({ _id: id }, { $set: { isListed: false } });
    res.json({ unlisted: true, id: id });
}
exports.default = { getProducts, listProduct, unlistProduct };
//# sourceMappingURL=productController.js.map