import { Request,Response } from 'express'


import optionSchema from "../../models/optionSchema"
import modelSchema from "../../models/modelSchema"
import brandModel from "../../models/brandSchema"

async function createBrand(req:Request,res:Response){

    const brand = req.body.brandName
    const isOldBrand = await brandModel.findOne({name:brand})
    if(isOldBrand){
        return res.json({err:'brand name allredy exist'})
    }

   const newBrand = await brandModel.create({name:brand})
    res.json({created:true,brand:newBrand})
}

async function getBrands(req:Request,res:Response){


    //   const model = await modelSchema.create({name:'wagon '})
    //   await brandModel.findOneAndUpdate({name:'maruthi'},{$addToSet:{models:model._id}})
   // const option = await optionSchema.create({name:'zxi'})
//    const option = await optionSchema.findOne({name:'zxi'})
//     await modelSchema.findOneAndUpdate({name:'swfit'},{$addToSet:{options:option?._id}})

   try{
    await optionSchema.find()
    await modelSchema.find()
    const brands = await brandModel.find().populate({
        path:'models',
        populate:{
            path:'options',
            model:'option'
        }
    }).exec()

    res.json({brands:brands})

   }
   catch(err){
    console.log(err)
   }
}

async function addModel(req:Request,res:Response){

    const{modelName,brandId} = req.body

    const oldModel = await modelSchema.findOne({name:modelName})

    if(oldModel){
        return {err:'model allredy exist'}
    }

   console.log(modelName,brandId)
    const model = await modelSchema.create({name:modelName})

      await brandModel.findOneAndUpdate({_id:brandId},{$addToSet:{models:model._id}})

      const brand = await brandModel.findOne({_id:brandId}).populate({
        path:'models',
        populate:{
            path:'options',
            model:'option'
        }
    }).exec()

      res.json({brand:brand,brandId:brandId,created:true})


}
async function addOption(req:Request,res:Response){

    const{optionName,brandId,modelId} = req.body

    const oldOption = await optionSchema.findOne({name:optionName})
    if(oldOption){
        
        await modelSchema.findOneAndUpdate({_id:modelId},{$addToSet:{options:oldOption._id}})

        const brand = await brandModel.findOne({_id:brandId}).populate({
          path:'models',
          populate:{
              path:'options',
              model:'option'
          }
      }).exec()
  
      return  res.json({brand:brand,brandId:brandId,created:true})
  

    }

    const option = await optionSchema.create({name:optionName})

            await modelSchema.findOneAndUpdate({_id:modelId},{$addToSet:{options:option?._id}})

      const brand = await brandModel.findOne({_id:brandId}).populate({
        path:'models',
        populate:{
            path:'options',
            model:'option'
        }
    }).exec()

      res.json({brand:brand,brandId:brandId,created:true})


}







export default {createBrand,getBrands,addModel,addOption}