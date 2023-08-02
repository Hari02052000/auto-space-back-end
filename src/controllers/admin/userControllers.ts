import{ Request,Response } from "express"

import userSChema from "../../models/userSchema";






async function findUsers(req:Request,res:Response){


    
    const users = await userSChema.find()

    res.json({users:users})
}

async function blockUser(req:Request,res:Response) {

    const id = req.body.id

    await userSChema.findOneAndUpdate({_id:id},{$set:{isBlocked:true}})

    res.json({blocked:true,id:id})
    
}

async function unBlockUser(req:Request,res:Response) {

    const id = req.body.id

    await userSChema.findOneAndUpdate({_id:id},{$set:{isBlocked:false}})

    res.json({unBlocked:true,id:id})
    
}



export default { findUsers,blockUser,unBlockUser }