"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const productSchema_1 = __importDefault(require("../../models/productSchema"));
const brandSchema_1 = __importDefault(require("../../models/brandSchema"));
const optionSchema_1 = __importDefault(require("../../models/optionSchema"));
const modelSchema_1 = __importDefault(require("../../models/modelSchema"));
const userSchema_1 = __importDefault(require("../../models/userSchema"));
const cloudinery_1 = __importDefault(require("../../helpers/cloudinery"));
async function getProducts(req, res) {
    try {
        // interface regexInterface{
        //     $regex:string
        //     $options:String
        // }
        // interface queryInterface{
        //     isListed:boolean
        //     $or?:[
        //         {
        //             'brand.name':regexInterface
        //         },
        //         {
        //             'model.name':regexInterface
        //         },
        //         {
        //             'option.name':regexInterface
        //         }
        //     ]
        //     brand?:string
        // }
        // console.log('geting')
        // const limit = 10
        // interface requestInterface{
        //     search?:string
        //     brand?:string
        //     sortBy?:string
        //     sortOrder?:string
        //     page?:number
        // }
        // const {
        //  search,
        //  brand,
        //  sortBy,
        //  sortOrder,
        //  page
        // } = req.query as requestInterface
        //  const query:queryInterface = {
        //    isListed:false
        //  }
        //  if(search){
        //     query.$or = [
        //         {
        //             'brand.name':{$regex:search,$options:'i'}
        //         },
        //         {
        //             'model.name':{$regex:search,$options:'i'}
        //         },
        //         {
        //             'option.name':{$regex:search,$options:'i'}
        //         }
        //     ]
        //  }
        //  if(brand) {
        //     query.brand = brand
        //  }
        const brands = await brandSchema_1.default.find();
        //  const products = await productModel.find(query)
        //  console.log(products)
        const products = await productSchema_1.default.find({ isListed: true }).populate({ path: 'brand' }).populate({ path: 'model' }).populate({ path: 'option' });
        res.json({ products: products, brands: brands });
    }
    catch (err) {
        console.log(err);
    }
}
async function getBrands(req, res) {
    try {
        await modelSchema_1.default.find();
        await optionSchema_1.default.find();
        const brands = await brandSchema_1.default.find().populate({
            path: 'models',
            populate: {
                path: 'options',
                model: 'option'
            }
        });
        res.json({ brand: brands });
    }
    catch (err) {
        console.log(err);
    }
}
async function addProduct(req, res) {
    let { brand, model, option, price, year, fuel, kmDriven, location, no_of_owners } = JSON.parse(req.body.formFields);
    let images = await cloudinery_1.default.multiFiles(req.files);
    const newProduct = await productSchema_1.default.create({ brand, model, option, price, year, fuel, kmDriven, Location: location, no_of_owners, images });
    const email = res.locals.user?.email;
    if (email)
        await userSchema_1.default.findOneAndUpdate({ email: email }, { $addToSet: { products: newProduct._id } });
    res.json({ productAdded: true });
}
exports.default = {
    getProducts, getBrands, addProduct
};
//# sourceMappingURL=userProductController.js.map