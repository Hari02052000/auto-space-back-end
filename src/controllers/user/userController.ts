import { Request,Response } from "express"
import userSchema from "../../models/userSchema"
import productSchema  from "../../models/productSchema"
import messageSchema, { MessageStatus } from "../../models/messageSchema"

async function getprofile(req:Request,res:Response){
    const userid = res.locals.userid
      await productSchema.find()
    const user = await userSchema.findOne({_id:userid})

    res.json({user:user})
   
}

async function getMessages(req:Request,res:Response){
    
    const senderId = res.locals.userid
    const { receverId,productId} = req.query;
    console.log(receverId,productId)
    console.log(senderId)

    const recever = await userSchema.findOne({_id:receverId})
    const product = await productSchema.findOne({_id:productId}).populate({path:'brand'}).populate({path:'model'}).populate({path:'option'})
      //update the messages status as read and send to client

      await messageSchema.updateMany({reciverId:senderId},{$set:{ status:MessageStatus.Read  }})

      const messages = await messageSchema.find(
        {  $and:[
          {
            $or: [
              { senderId: senderId, reciverId: receverId },
              { senderId: receverId, reciverId: senderId }
            ]


          },
          {
            productId:productId
          }

        ]
          }
      ).sort({'timestamps':1 })
      console.log(messages)
   res.json({messages:messages,product:product,logedUser:senderId,recever:recever})
}

async function editDetails(req:Request,res:Response){

  console.log(req.body)
 const userid = res.locals.userid
 const user = await userSchema.findOne({_id:userid})
 
 if(req.body.email){
  if(user?.email != req.body.email){

    const isEmailExist = await userSchema.findOne({email:req.body.email})
   if(isEmailExist){
    return res.json({err:'email allredy exist'})
   }

  }

  
   await userSchema.findOneAndUpdate({_id:userid},{$set:{email:req.body.email}})
   


 }

 if(req.body.username){

  await userSchema.findOneAndUpdate({_id:userid},{$set:{username:req.body.username}})

 }

 res.json({updated:true})

}









export default {getprofile,getMessages,editDetails}