import { Request,Response } from "express"
import userSchema, { defaultProfileEnum } from "../../models/userSchema"
import productSchema  from "../../models/productSchema"
import messageSchema, { MessageStatus } from "../../models/messageSchema"
import cloudinery from "../../helpers/cloudinery"
import sendmail from "../../helpers/sendmail"


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
let isemailchange = false
let isusernamechange =false
  console.log(req.body)
 const userid = res.locals.userid
 const user = await userSchema.findOne({_id:userid})
 console.log(user)
 
 if(req.body.email){
  if(user?.email != req.body.email){

    const isEmailExist = await userSchema.findOne({email:req.body.email})
   if(isEmailExist){
    return res.json({err:'email allredy exist'})
   }

   await userSchema.findOneAndUpdate({_id:userid},{$set:{email:req.body.email,isverified:false}})

   sendmail.sendOtp(req.body.email)
    isemailchange = true
   //res.json({updated:true,email:req.body.email,isEmailchange:true})


  }

  
   


 }

 if(req.body.username){

  if(user?.username != req.body.username){

    const isusername = await userSchema.findOne({username:req.body.username})
   if(isusername){
    return res.json({err:'username allredy exist'})
   }

   await userSchema.findOneAndUpdate({_id:userid},{$set:{username:req.body.username}})
   isusernamechange = true

  }

  
   




 }

 if(isusernamechange ||  isemailchange){

  if(isemailchange && isusernamechange){
    return res.json({emailchange:true,usernamechange:true})
  }

  if(isemailchange){

   return res.json({emailchange:true})
  }

  if(isusernamechange){

    return res.json({usernamechange:true})


  }


 }

 else{
  return res.json({err:'all are same nothing to new'})
 }


}



async function uploadProfile(req:Request,res:Response){

  try{
    console.log(req.body)
    const userid = res.locals.userid
    const user = await userSchema.findOne({ _id: userid })

    if(user?.profile.URL==defaultProfileEnum.URL||user?.profile.cloudinary_id==defaultProfileEnum.cloudinary_id)
    {
      
      let images = await cloudinery.multiFiles(req.files as Express.Multer.File[])

      await userSchema.findOneAndUpdate({_id:userid},{$set:{profile:images[0]}})
     return res.json({profileUpdated:true,profile:images[0]})


    }
    else{
      if(user)
       await cloudinery.deleteImage(user?.profile.cloudinary_id);

       let images = await cloudinery.multiFiles(req.files as Express.Multer.File[])

       await userSchema.findOneAndUpdate({_id:userid},{$set:{profile:images[0]}})
      return res.json({profileUpdated:true,profile:images[0]})
 


    }



  }
  catch(err){
    res.json({err:'profile not updated'})
    console.log(err)
  }
}







export default {getprofile,getMessages,editDetails,uploadProfile}