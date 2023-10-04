"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const optionSchema_1 = __importDefault(require("../../models/optionSchema"));
const modelSchema_1 = __importDefault(require("../../models/modelSchema"));
const brandSchema_1 = __importDefault(require("../../models/brandSchema"));
async function createBrand(req, res) {
    try {
        console.log(req.body);
        const brand = req.body.brandName;
        const isOldBrand = await brandSchema_1.default.findOne({ name: brand });
        if (isOldBrand) {
            return res.json({ err: 'brand name allredy exist' });
        }
        const newBrand = await brandSchema_1.default.create({ name: brand });
        res.json({ created: true, brand: newBrand });
    }
    catch (err) {
        console.log(err);
    }
}
async function getBrands(req, res) {
    //await admin.create({email:'admin@gmail.com',password:'Hari@1234'})
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
    // const brand = await brandModel.findOne({ _id: brandId }).populate({
    //     path: 'models',
    //     populate: {
    //         path: 'options',
    //         model: 'option'
    //     }
    // }).exec()
    res.json({ model: model, brandId: brandId, created: true });
}
async function addOption(req, res) {
    const { optionName, brandId, modelId } = req.body;
    const oldOption = await optionSchema_1.default.findOne({ name: optionName });
    if (oldOption) {
        await modelSchema_1.default.findOneAndUpdate({ _id: modelId }, { $addToSet: { options: oldOption._id } });
        // const brand = await brandModel.findOne({ _id: brandId }).populate({
        //     path: 'models',
        //     populate: {
        //         path: 'options',
        //         model: 'option'
        //     }
        // }).exec()
        return res.json({ option: oldOption, brandId: brandId, created: true });
    }
    const option = await optionSchema_1.default.create({ name: optionName });
    await modelSchema_1.default.findOneAndUpdate({ _id: modelId }, { $addToSet: { options: option?._id } });
    // const brand = await brandModel.findOne({ _id: brandId }).populate({
    //     path: 'models',
    //     populate: {
    //         path: 'options',
    //         model: 'option'
    //     }
    // }).exec()
    res.json({ option: option, brandId: brandId, created: true });
}
async function editBrand(req, res) {
    const { brandName, id } = req.body;
    console.log(await brandSchema_1.default.findOne({ _id: id }));
    const oldbrand = await brandSchema_1.default.findOne({ name: brandName });
    console.log(oldbrand);
    if (oldbrand) {
        return res.json({ err: 'name allredy exist or nothing to update' });
    }
    await brandSchema_1.default.findOneAndUpdate({ _id: id }, { $set: { name: brandName } });
    res.json({ edited: true });
}
async function editmodel(req, res) {
    const { modeldName, id } = req.body;
    console.log(req.body);
    console.log(await modelSchema_1.default.findOne({ _id: id }));
    const oldmodel = await modelSchema_1.default.findOne({ name: modeldName });
    console.log(oldmodel);
    if (oldmodel) {
        return res.json({ err: 'name allredy exist or nothing to update' });
    }
    await modelSchema_1.default.findOneAndUpdate({ _id: id }, { $set: { name: modeldName } });
    res.json({ edited: true });
}
async function editoption(req, res) {
    const { optionName, id } = req.body;
    await optionSchema_1.default.findOneAndUpdate({ _id: id }, { $set: { name: optionName } });
    res.json({ edited: true });
}
exports.default = { createBrand, getBrands, addModel, addOption, editBrand, editmodel, editoption };
//# sourceMappingURL=brandController.js.map