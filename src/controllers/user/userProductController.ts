import{ Request,Response } from "express"
import productModel from "../../models/productSchema"
import brandSchema from "../../models/brandSchema"
import optionSchema from "../../models/optionSchema"
import modelschema from "../../models/modelSchema"
import userschema from "../../models/userSchema"
import cloudinery from "../../helpers/cloudinery"

async function getProducts(req:Request,res:Response){

    try{
    
        
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

          const brands = await brandSchema.find()
        //  const products = await productModel.find(query)
        //  console.log(products)

         const products =  await productModel.find({isListed:true}).populate({path:'brand'}).populate({path:'model'}).populate({path:'option'})

         res.json({products:products,brands:brands})

    }

    catch(err){
        console.log(err)
    }
}

 async function  getBrands(req:Request,res:Response){

    try{


        await modelschema.find()
        await optionSchema.find()
      const brands =   await brandSchema.find().populate({
        path:'models',
        populate:{
            path:'options',
            model:'option'
        }
    })
     
    res.json({brand:brands})
    

    }
      
    catch(err){
        console.log(err)
    }

}

async function addProduct(req:Request,res:Response){

    let{brand,model,option,price,year,fuel,kmDriven,location,no_of_owners}=JSON.parse(req.body.formFields)

    let images = await cloudinery.multiFiles(req.files as Express.Multer.File[])


     const newProduct =  await productModel.create({brand,model,option,price,year,fuel,kmDriven,Location:location,no_of_owners,images})
      const email = res.locals.user?.email
      if(email)
     await userschema.findOneAndUpdate({email:email},{$addToSet:{products:newProduct._id}})

      res.json({productAdded:true});


}


export default {
    getProducts,getBrands,addProduct
}