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
    console.log(req.files);
    console.log(req.body);
    const userid = res.locals.userid;
    const user = await userSchema_1.default.findOne({ _id: userid });
    //find one subscription id is this userid end date greater than or equal to today
    //if set allowed cars is zero and message plan expaired 
    if (user) {
        if (user.alowedCars > 0) {
            let { brand, model, option, price, year, fuel, kmDriven, location, no_of_owners } = JSON.parse(req.body.formFields);
            let images = await cloudinery_1.default.multiFiles(req.files);
            const date = new Date();
            const newProduct = await productSchema_1.default.create({ brand, model, option, price, year, fuel, kmDriven, Location: location, no_of_owners, images, user: userid, date: date });
            await userSchema_1.default.findOneAndUpdate({ _id: userid }, { $inc: { alowedCars: -1 } });
            return res.json({ productAdded: true });
        }
        else {
            res.json({ err: 'alowedCars is zero' });
        }
    }
    else {
        res.json({ err: 'something went wrong please login again and continue' });
    }
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
    let { search, sortBy, filter } = req.query;
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
    if (sortBy === 'km asc' || sortBy == 'km dsc' || sortBy == 'price asc' || sortBy == 'price dsc') {
        let sortOrder;
        if (sortBy === 'km asc' || sortBy == 'km dsc') {
            sortBy == 'km asc' ? sortOrder = 1 : sortOrder = -1;
            products = products.sort((a, b) => sortOrder * (a.kmDriven - b.kmDriven));
        }
        else if (sortBy == 'price asc' || sortBy == 'price dsc') {
            sortBy == 'price asc' ? sortOrder = 1 : sortOrder = -1;
            products = products.sort((a, b) => sortOrder * (a.price - b.price));
        }
    }
    res.json({ products });
}
async function getsingleProduct(req, res) {
    const id = req.params.id;
    const product = await productSchema_1.default.findOne({ _id: id }).populate({ path: 'brand' }).populate({ path: 'model' }).populate({ path: 'option' });
    if (product) {
        return res.json({ product: product });
    }
    else {
        return res.json({ err: 'product not found' });
    }
}
async function getPostedProducts(req, res) {
    const userid = res.locals.userid;
    const products = await productSchema_1.default.find({ user: userid }).populate({ path: 'brand' }).populate({ path: 'model' }).populate({ path: 'option' });
    return res.json({ products: products });
}
async function getEditProduct(req, res) {
    const id = req.params.id;
    const product = await productSchema_1.default.findOne({ _id: id }).populate({ path: 'brand' }).populate({ path: 'model' }).populate({ path: 'option' });
    if (product) {
        if (product.user + '' == res.locals.userid + '') {
            return res.json({ product: product });
        }
        else {
            return res.json({ err: 'you canot edit this' });
        }
    }
    else {
        return res.json({ err: 'product not found' });
    }
}
exports.default = {
    getProducts, getBrands, addProduct, searchProduct,
    getsingleProduct,
    getPostedProducts,
    getEditProduct
};
//# sourceMappingURL=userProductController.js.map