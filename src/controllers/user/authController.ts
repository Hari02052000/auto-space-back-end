
import { Request,Response } from 'express'
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

import userSchema from '../../models/userSchema'
import userRequestInterface from '../../interface/userInterface'
import sendmail from "../../helpers/sendmail"

const maxage=3*24*60*60;
const createToken=(id:string)=>{
   return jwt.sign({id},'key1',{expiresIn:maxage})
}


 async function login(req:Request,res:Response){

    try{
         
        const { email, password } = req.body
        let user = await userSchema.findOne({email:email})
        if(!user){
         res.json({err:'invalid email or password'})
         return
        
        }
        const match=await bcrypt.compare(password,user.password)
       
         if(match){
             
          const token = createToken(user._id)


           res.json({ access_token: token, isUser:true })
           return
         }
        
       
        res.json({err:'invalid email or password'})
           return
       
         
        
    }
    catch(err){
        console.log(err)
    }
 }


 async function register(req:Request,res:Response){

     try{
           console.log(req.body)
        const {email,password,confpassword,username } = req.body as userRequestInterface

        if(password != confpassword){
            return res.json({err:'passwords are not equal'})
        }

        const isEmailExist = await userSchema.findOne({email:email})

        if(isEmailExist){

            return res.json({err:'email allredy exist'})
        }

        const user = await userSchema.create({email,password,username})

          sendmail.sendOtp(user.email)
        
        const token = createToken(user._id)
         
        res.json({ userCreated:true,access_token:token,email:email })
         
     }

     catch(err){
         
        console.log(err)
     }

 }

 async function  verifyOtp(req:Request,res:Response){

     try{
       
        const{otp,isChangingPassword} = req.body
        const email = req.body.email||res.locals.email
       const isVeryfied = sendmail.veryfyOtp(otp)
        if(isVeryfied){

            
           
            if(isChangingPassword){
                const token = jwt.sign('userPassword','key2')
              return res.json({verification:true,isChangingPassword:token})
             }
    



         await userSchema.findOneAndUpdate({email},{$set:{isverified:true}})
         res.json({verification:true})
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
     const user = await userSchema.findOne({email:email})

     if(user){
         sendmail.sendOtp(user.email)
      return  res.json({isUserEmail:true,email:user.email})
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

    await userSchema.findOneAndUpdate({email:email},{$set:{password:password}})

    res.json({isPasswordChanged:true})
 }




 export default {login,register,verifyOtp,verifyEmail,changepassword}