"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const brandSchema_1 = __importDefault(require("../../models/brandSchema"));
async function createBrand(req, res) {
    const brand = req.body.brand;
    const isOldBrand = await brandSchema_1.default.findOne({ name: brand });
    if (isOldBrand) {
        return res.json({ err: 'brand name allredy exist' });
    }
    await brandSchema_1.default.create({ name: brand });
}
exports.default = { createBrand };
//# sourceMappingURL=bramdController.js.map