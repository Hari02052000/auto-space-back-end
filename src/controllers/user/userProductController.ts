import { Request, Response } from "express"
import productModel from "../../models/productSchema"
import brandSchema from "../../models/brandSchema"
import optionSchema from "../../models/optionSchema"
import modelschema from "../../models/modelSchema"
import userschema from "../../models/userSchema"
import cloudinery from "../../helpers/cloudinery"
import mongoose from "mongoose"

async function getProducts(req: Request, res: Response) {

    try {

        interface notUser {
            $ne: mongoose.Types.ObjectId
        }

        interface filterInterface {
            isListed: boolean,
            user?: notUser
        }

        const filter: filterInterface = {
            isListed: true,

        }

        if (res.locals.userid) {
            filter.user = { $ne: res.locals.userid }
        }



        const brands = await brandSchema.find()

        const products = await productModel.find(filter).populate({ path: 'brand' }).populate({ path: 'model' }).populate({ path: 'option' })
        res.json({ products: products, brands: brands })

    }

    catch (err) {
        console.log(err)
    }
}

async function getBrands(req: Request, res: Response) {

    try {


        await modelschema.find()
        await optionSchema.find()
        const brands = await brandSchema.find().populate({
            path: 'models',
            populate: {
                path: 'options',
                model: 'option'
            }
        })

        res.json({ brand: brands })


    }

    catch (err) {
        console.log(err)
    }

}

async function addProduct(req: Request, res: Response) {
    console.log(req.files)
    console.log(req.body)
    const userid = res.locals.userid
    const user = await userschema.findOne({ _id: userid })
    //find one subscription id is this userid end date greater than or equal to today
    //if set allowed cars is zero and message plan expaired 
    if (user) {

        if (user.alowedCars > 0) {

             let{brand,model,option,price,year,fuel,kmDriven,location,no_of_owners}=JSON.parse(req.body.formFields)

             let images = await cloudinery.multiFiles(req.files as Express.Multer.File[])
             const date = new Date()
             const newProduct =  await productModel.create({brand,model,option,price,year,fuel,kmDriven,Location:location,no_of_owners,images,user:userid,date:date})
             await userschema.findOneAndUpdate({_id:userid},{ $inc: { alowedCars: -1 } })

             return  res.json({productAdded:true});



        }

        else {

            res.json({ err: 'alowedCars is zero' })

        }
    }
    else{

        res.json({err:'something went wrong please login again and continue'})
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

async function searchProduct(req: Request, res: Response) {

    interface searchRequestInterface {
        search: string,
        sort: string,
        sortBy: string,
        filter: string

    }

    let { search, sort, sortBy, filter } = req.query as unknown as searchRequestInterface
    console.log(req.query)

    const query: any = {
        isListed: true
    }

    if (search == 'undefined') {
        search = ''
    }
    if (filter != 'undefined') {

        query.brand = filter
    }

    if (res.locals.userid) {
        query.user = { $ne: res.locals.userid }
    }


    let products = (await productModel.find(query).populate({ path: 'brand' }).populate({ path: 'model' }).populate({ path: 'option' }))
        .filter((products) => {

            const regex = new RegExp(search, 'i');

            return (

                products.brand.name.match(regex) ||
                products.model.name.match(regex) ||
                products.option.name.match(regex)


            )
        })
    if (sortBy === 'km' || sortBy == 'price') {
        let sortOrder: number
        sort == 'asc' ? sortOrder = 1 : sortOrder = -1
        if (sortBy === 'km') {

            products = products.sort((a, b) => sortOrder * (a.kmDriven - b.kmDriven));


        }

        else {

            products = products.sort((a, b) => sortOrder * (a.price - b.price));


        }

    }

    res.json({ products })



}

async function getsingleProduct(req:Request,res:Response) {

    const id = req.params.id
    console.log(id)
    // port = 3000
    // cloud_name= dgblwidrj
    // api_key= 443134725149471
    // api_secret=I-tYmqJ1J59c0yvDTsVJ0B70TsE
    // cloudinary_folder_name=new
    console.log(process.env.port)
    console.log(process.env.cloud_name)
    console.log(process.env.api_secret)
    console.log(process.env.db_connection)
   const product = await productModel.findOne({_id:id})

    if(product){
        return res.json({product:product})
    }
    else{
        return res.json({err:'product not found'})
    }
}

export default {
    getProducts, getBrands, addProduct, searchProduct,
    getsingleProduct
}