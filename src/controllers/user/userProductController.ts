import { Request, Response } from "express"
import productModel from "../../models/productSchema"
import brandSchema from "../../models/brandSchema"
import optionSchema from "../../models/optionSchema"
import modelschema from "../../models/modelSchema"
import userschema from "../../models/userSchema"
import cloudinery from "../../helpers/cloudinery"
import mongoose from "mongoose"
import products from "razorpay/dist/types/products"
import subscription from "../../models/subscribtionSchema"

async function getProducts(req: Request, res: Response) {

    try {

        interface notUser {
            $ne: mongoose.Types.ObjectId
        }

        interface filterInterface {
            isListed: boolean,
            isSold:boolean,
            user?: notUser
        }

        const filter: filterInterface = {
            isListed: true,
            isSold:false

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

        if(user.alowedCars == 0){

           return res.json({ err: 'alowedCars is zero' })

        }

        const currentDate = new Date();

        const isSubscription = await subscription.findOne({
            user:user._id ,
            endDate: { $gte: currentDate }
        });

        if(!isSubscription){
           await userschema.findOneAndUpdate({_id:user._id},{$set:{alowedCars:0}})
           return  res.json({ err: 'your plan is expaired' })

        }
        

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

    let { search, sortBy, filter } = req.query as unknown as searchRequestInterface
    console.log(req.query)

    const query: any = {
        isListed: true,
        isSold:false,

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
    if (sortBy === 'km asc' || sortBy == 'km dsc'||sortBy == 'price asc'||sortBy == 'price dsc') {
        let sortOrder: number
        if (sortBy === 'km asc'||sortBy == 'km dsc') {

            sortBy == 'km asc' ? sortOrder = 1 : sortOrder = -1


            products = products.sort((a, b) => sortOrder * (a.kmDriven - b.kmDriven));


        }

        else if(sortBy == 'price asc'||sortBy == 'price dsc') {

            sortBy == 'price asc' ? sortOrder = 1 : sortOrder = -1


            products = products.sort((a, b) => sortOrder * (a.price - b.price));


        }

    }

    res.json({ products })



}

async function getsingleProduct(req:Request,res:Response) {

    const id = req.params.id
   const product = await productModel.findOne({_id:id}).populate({ path: 'brand' }).populate({ path: 'model' }).populate({ path: 'option' })

    if(product){
        return res.json({product:product})
    }
    else{
        return res.json({err:'product not found'})
    }
}

async function getPostedProducts(req:Request,res:Response){
    const userid = res.locals.userid

    const products = await productModel.find({user:userid}).populate({ path: 'brand' }).populate({ path: 'model' }).populate({ path: 'option' }) 


   return res.json({products:products})
}

async function getEditProduct(req:Request,res:Response){


    const id = req.params.id
    const product = await productModel.findOne({_id:id}).populate({ path: 'brand' }).populate({ path: 'model' }).populate({ path: 'option' })

 
     if(product){
        if(product.user+'' == res.locals.userid+''){

            return res.json({product:product})


        }
        else{

            return res.json({err:'you canot edit this'})
        }
     }
     else{
         return res.json({err:'product not found'})
     }
 
}

async function deleteimage(req:Request,res:Response){
      
        try{
        let{productId,image}=req.body
       const product= await productModel.findOne({_id:productId})
      let removed= product?.images.splice(image,1)
      if(removed){

        await cloudinery.deleteImage(removed[0].cloudinary_id)


      }
       if(product){
        await product.save()
       }
    
      res.json({imageRemoved:true})
    }
    catch(err){

    }
}

async function uploadimages(req:Request,res:Response){

    let images = await cloudinery.multiFiles(req.files as Express.Multer.File[])
    console.log(req.body)
    const {productid} = req.body

   let product =  await productModel.findOne({_id:productid})

   product?.images.push(...images)
   await product?.save()

    res.json({uploaded:true,images:images})

}

async function updateProduct(req:Request,res:Response){

  let  {price,year,fuel,kmDriven,Location,no_of_owners,productid} = req.body

   await productModel.findOneAndUpdate({_id:productid},{$set:{price,year,fuel,kmDriven,Location,no_of_owners,productid}})
   res.json({updated:true})
}

async function markSold(req:Request,res:Response) {

    const productid = req.body.productid

    await productModel.findOneAndUpdate({_id:productid},{$set:{isSold:true}})
    res.json({marked:true})
    
}

export default {
    getProducts, getBrands, addProduct, searchProduct,
    getsingleProduct,
    getPostedProducts,
    getEditProduct,
    deleteimage,
    uploadimages,
    updateProduct,
    markSold
}