import { Request, Response } from 'express'
import plansSchema from '../../models/plansSchema'



async function getPlans(req:Request,res:Response){

    const plans = await plansSchema.find()

    res.json({plans:plans})
}





export default { getPlans }