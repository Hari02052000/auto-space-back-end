"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const optionSchema_1 = __importDefault(require("../../models/optionSchema"));
const modelSchema_1 = __importDefault(require("../../models/modelSchema"));
const brandSchema_1 = __importDefault(require("../../models/brandSchema"));
async function createBrand(req, res) {
    const brand = req.body.brandName;
    const isOldBrand = await brandSchema_1.default.findOne({ name: brand });
    if (isOldBrand) {
        return res.json({ err: 'brand name allredy exist' });
    }
    const newBrand = await brandSchema_1.default.create({ name: brand });
    res.json({ created: true, brand: newBrand });
}
async function getBrands(req, res) {
    //   const model = await modelSchema.create({name:'wagon '})
    //   await brandModel.findOneAndUpdate({name:'maruthi'},{$addToSet:{models:model._id}})
    // const option = await optionSchema.create({name:'zxi'})
    //    const option = await optionSchema.findOne({name:'zxi'})
    //     await modelSchema.findOneAndUpdate({name:'swfit'},{$addToSet:{options:option?._id}})
    try {
        await optionSchema_1.default.find();
        await modelSchema_1.default.find();
        const brands = await brandSchema_1.default.find().populate({
            path: 'models',
            populate: {
                path: 'options',
                model: 'option'
            }
        }).exec();
        res.json({ brands: brands });
    }
    catch (err) {
        console.log(err);
    }
}
async function addModel(req, res) {
    const { modelName, brandId } = req.body;
    const oldModel = await modelSchema_1.default.findOne({ name: modelName });
    if (oldModel) {
        return { err: 'model allredy exist' };
    }
    console.log(modelName, brandId);
    const model = await modelSchema_1.default.create({ name: modelName });
    await brandSchema_1.default.findOneAndUpdate({ _id: brandId }, { $addToSet: { models: model._id } });
    const brand = await brandSchema_1.default.findOne({ _id: brandId }).populate({
        path: 'models',
        populate: {
            path: 'options',
            model: 'option'
        }
    }).exec();
    res.json({ brand: brand, brandId: brandId, created: true });
}
async function addOption(req, res) {
    const { optionName, brandId, modelId } = req.body;
    const oldOption = await optionSchema_1.default.findOne({ name: optionName });
    if (oldOption) {
        await modelSchema_1.default.findOneAndUpdate({ _id: modelId }, { $addToSet: { options: oldOption._id } });
        const brand = await brandSchema_1.default.findOne({ _id: brandId }).populate({
            path: 'models',
            populate: {
                path: 'options',
                model: 'option'
            }
        }).exec();
        return res.json({ brand: brand, brandId: brandId, created: true });
    }
    const option = await optionSchema_1.default.create({ name: optionName });
    await modelSchema_1.default.findOneAndUpdate({ _id: modelId }, { $addToSet: { options: option?._id } });
    const brand = await brandSchema_1.default.findOne({ _id: brandId }).populate({
        path: 'models',
        populate: {
            path: 'options',
            model: 'option'
        }
    }).exec();
    res.json({ brand: brand, brandId: brandId, created: true });
}
exports.default = { createBrand, getBrands, addModel, addOption };
//# sourceMappingURL=brandController.js.map