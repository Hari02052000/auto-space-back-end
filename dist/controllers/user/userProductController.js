"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const productSchema_1 = __importDefault(require("../../models/productSchema"));
const brandSchema_1 = __importDefault(require("../../models/brandSchema"));
const optionSchema_1 = __importDefault(require("../../models/optionSchema"));
const modelSchema_1 = __importDefault(require("../../models/modelSchema"));
async function getProducts(req, res) {
    try {
        const filter = {
            isListed: true,
        };
        if (res.locals.userid) {
            filter.user = { $ne: res.locals.userid };
        }
        const brands = await brandSchema_1.default.find();
        const products = await productSchema_1.default.find(filter).populate({ path: 'brand' }).populate({ path: 'model' }).populate({ path: 'option' });
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
    //  let{brand,model,option,price,year,fuel,kmDriven,location,no_of_owners}=JSON.parse(req.body.formFields)
    //  let images = await cloudinery.multiFiles(req.files as Express.Multer.File[])
    //  const userid = res.locals.userid
    //  const date = new Date()
    //  const newProduct =  await productModel.create({brand,model,option,price,year,fuel,kmDriven,Location:location,no_of_owners,images,user:userid,date:date})
    //   const email = res.locals.user?.email
    //  if(email)
    //  await userschema.findOneAndUpdate({email:email},{$addToSet:{products:newProduct._id}})
    //   res.json({productAdded:true});
    // cheak user product count is greater than limit
}
async function searchProduct(req, res) {
    let { search, sort, sortBy, filter } = req.query;
    console.log(req.query);
    const query = {
        isListed: true
    };
    if (search == 'undefined') {
        search = '';
    }
    if (filter != 'undefined') {
        query.brand = filter;
    }
    if (res.locals.userid) {
        query.user = { $ne: res.locals.userid };
    }
    let products = (await productSchema_1.default.find(query).populate({ path: 'brand' }).populate({ path: 'model' }).populate({ path: 'option' }))
        .filter((products) => {
        const regex = new RegExp(search, 'i');
        return (products.brand.name.match(regex) ||
            products.model.name.match(regex) ||
            products.option.name.match(regex));
    });
    if (sortBy === 'km' || sortBy == 'price') {
        let sortOrder;
        sort == 'asc' ? sortOrder = 1 : sortOrder = -1;
        if (sortBy === 'km') {
            products = products.sort((a, b) => sortOrder * (a.kmDriven - b.kmDriven));
        }
        else {
            products = products.sort((a, b) => sortOrder * (a.price - b.price));
        }
    }
    res.json({ products });
}
exports.default = {
    getProducts, getBrands, addProduct, searchProduct
};
//# sourceMappingURL=userProductController.js.map