import{ Request,Response } from "express"
import userschema from "../../models/userSchema"
import productschema from "../../models/productSchema"
import brandschema from "../../models/modelSchema" 


async function getProducts(req:Request,res:Response){
      
  
         const products =  await productschema.find().populate('brand').populate('model').populate('option')
          
         res.json({products:products})
}

async function listProduct(req:Request,res:Response) {

    const id = req.body.id

    await productschema.findOneAndUpdate({_id:id},{$set:{isListed:true}})


    res.json({listed:true,id:id})
    
}

async function unlistProduct(req:Request,res:Response) {

    const id = req.body.id

    await productschema.findOneAndUpdate({_id:id},{$set:{isListed:false}})



    res.json({unlisted:true,id:id})
    
}




export default {getProducts,listProduct,unlistProduct}