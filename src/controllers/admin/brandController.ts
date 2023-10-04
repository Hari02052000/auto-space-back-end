import { Request, Response } from 'express'


import optionSchema from "../../models/optionSchema"
import modelSchema from "../../models/modelSchema"
import brandModel from "../../models/brandSchema"
import admin from "../../models/adminSchema"

async function createBrand(req: Request, res: Response) {

    try {

        console.log(req.body)

        const brand = req.body.brandName
        const isOldBrand = await brandModel.findOne({ name: brand })
        if (isOldBrand) {
            return res.json({ err: 'brand name allredy exist' })
        }

        const newBrand = await brandModel.create({ name: brand })
        res.json({ created: true, brand: newBrand })


    }

    catch (err) {
        console.log(err)
    }


}

async function getBrands(req: Request, res: Response) {

    //await admin.create({email:'admin@gmail.com',password:'Hari@1234'})

    try {
        await optionSchema.find()
        await modelSchema.find()
        const brands = await brandModel.find().populate({
            path: 'models',
            populate: {
                path: 'options',
                model: 'option'
            }
        }).exec()

        res.json({ brands: brands })

    }
    catch (err) {
        console.log(err)
    }
}

async function addModel(req: Request, res: Response) {

    const { modelName, brandId } = req.body

    const oldModel = await modelSchema.findOne({ name: modelName })

    if (oldModel) {
        return { err: 'model allredy exist' }
    }

    console.log(modelName, brandId)
    const model = await modelSchema.create({ name: modelName })

    await brandModel.findOneAndUpdate({ _id: brandId }, { $addToSet: { models: model._id } })

    // const brand = await brandModel.findOne({ _id: brandId }).populate({
    //     path: 'models',
    //     populate: {
    //         path: 'options',
    //         model: 'option'
    //     }
    // }).exec()

    res.json({ model:model, brandId: brandId, created: true })


}
async function addOption(req: Request, res: Response) {

    const { optionName, brandId, modelId } = req.body
    const oldOption = await optionSchema.findOne({ name: optionName })
    if (oldOption) {

        await modelSchema.findOneAndUpdate({ _id: modelId }, { $addToSet: { options: oldOption._id } })

        // const brand = await brandModel.findOne({ _id: brandId }).populate({
        //     path: 'models',
        //     populate: {
        //         path: 'options',
        //         model: 'option'
        //     }
        // }).exec()

        return res.json({ option:oldOption, brandId: brandId, created: true })


    }

    const option = await optionSchema.create({ name: optionName })

    await modelSchema.findOneAndUpdate({ _id: modelId }, { $addToSet: { options: option?._id } })

    // const brand = await brandModel.findOne({ _id: brandId }).populate({
    //     path: 'models',
    //     populate: {
    //         path: 'options',
    //         model: 'option'
    //     }
    // }).exec()

    res.json({ option:option, brandId: brandId, created: true })


}

async function editBrand(req: Request, res: Response) {

    const { brandName, id } = req.body
    console.log(await brandModel.findOne({ _id: id }))
    const oldbrand = await brandModel.findOne({ name: brandName })
    console.log(oldbrand)
    if (oldbrand) {
        return res.json({ err: 'name allredy exist or nothing to update' })
    }
    await brandModel.findOneAndUpdate({ _id: id }, { $set: { name: brandName } })

    res.json({ edited: true })

}


async function editmodel(req: Request, res: Response) {

    const { modeldName, id } = req.body
    console.log(req.body)
    console.log(await modelSchema.findOne({ _id: id }))
    const oldmodel = await modelSchema.findOne({ name: modeldName })
    console.log(oldmodel)
    if (oldmodel) {
        return res.json({ err: 'name allredy exist or nothing to update' })
    }
    await modelSchema.findOneAndUpdate({ _id: id }, { $set: { name: modeldName } })

    res.json({ edited: true })


}

async function editoption(req: Request, res: Response) {

    const { optionName, id } = req.body

    await optionSchema.findOneAndUpdate({ _id: id }, { $set: { name: optionName } })

    res.json({ edited: true })



}









export default { createBrand, getBrands, addModel, addOption, editBrand,editmodel,editoption }