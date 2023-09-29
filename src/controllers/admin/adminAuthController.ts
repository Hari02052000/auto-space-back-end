import adminschema from "../../models/adminSchema"
import jwt from "jsonwebtoken"
import{Request,Response } from 'express'
import bcrypt from 'bcrypt'
import sendmail from "../../helpers/sendmail"
import produtSchema from "../../models/productSchema"
import brandSchema from "../../models/brandSchema"

const maxage=3*24*60*60;
const createToken=(id:string)=>{
   return jwt.sign({id},'key1',{expiresIn:maxage})
}


 async function login(req:Request,res:Response){

    try{
         
        const { email, password } = req.body
        let admin = await adminschema.findOne({email:email})
        if(!admin){
         res.json({err:'invalid email or password'})
         return
        
        }
        const match=await bcrypt.compare(password,admin.password)
       
         if(match){
             
          const token = createToken(admin._id)


           res.json({ access_token: token, isAdmin:true })
           return
         }
        
       
        res.json({err:'invalid email or password'})
           return
       
         
        
    }
    catch(err){
        console.log(err)
    }
 }

 async function  verifyOtp(req:Request,res:Response){

    try{
      
       const{otp} = req.body
       const email = req.body.email
      const isVeryfied = sendmail.veryfyOtp(otp)
       if(isVeryfied){
         const token = jwt.sign('adminPassword','key2')
         return res.json({verification:true,isChangingPassword:token})
   
       }
       else{
          res.json({err:'otp not verified'})
       }

    }
    catch(err){
      console.log(err)
    }
}


async function verifyEmail(req:Request,res:Response) {
    
   const email = req.body.email
    const admin = await adminschema.findOne({email:email})

    if(admin){
        sendmail.sendOtp(admin.email)
     return  res.json({isUserEmail:true,email:admin.email})
    }

   res.json({err:'email does not exist'})
    

    
   
}

async function changepassword(req:Request,res:Response){

   console.log(req.body)

   let {password,confpassword,email} = req.body

   if(password !==confpassword){
       return res.json({err:'passwords are not equal'})
   }
   password= await bcrypt.hash(password,12);

   await adminschema.findOneAndUpdate({email:email},{$set:{password:password}})

   res.json({isPasswordChanged:true})
}



export default {login,verifyEmail,verifyOtp,changepassword}