import { Request,Response,NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import userModel from "../models/userSchema"
import sendmail from './sendmail'

function isAuth(req:Request,res:Response,next:NextFunction){
    let user=undefined
   const headers = req.headers.usertoken
   
console.log(headers)
    if(typeof headers === 'string'){
    
        const token = headers.split(' ')[1]
    
         if(token){

            jwt.verify(token,'key1',async(err,decoded)=>{
                if(err) {
                    
                    res.json({err:err})

                }
                else if(decoded){

                const decodedPayload = decoded as jwt.JwtPayload; 

                    
                 user=await userModel.findOne({_id:decodedPayload.id})

                 
                 if(user?.isBlocked){
                    console.log('blocked')

                   return res.json({err:'user blocked'})
                 }
                 if(!(user?.isverified)){
                    if(user)
                    sendmail.sendOtp(user.email)
                    res.locals.email = user?.email
                    console.log('email not verified')
                    return res.json({err:'user not verified',email:user?.email})
                 }
                 
                 res.locals.userid = user?._id
                 console.log('next')

                    next()
                }})
    
            }
            else{
              res.json({err:'token not found'})
            }
        }
         
    }

    function isBlocked(req:Request,res:Response,next:NextFunction){
        let user=undefined
       const headers = req.headers.usertoken
    
        if(typeof headers === 'string'){
        
            const token = headers.split(' ')[1]
             
             if(token!='null'){
                jwt.verify(token,'key1',async(err,decoded)=>{
                    if(err) res.json({err:err})
                    else if(decoded){
    
                    const decodedPayload = decoded as jwt.JwtPayload; 
    
                        
                     user=await userModel.findOne({_id:decodedPayload.id})
                     
                     if(user?.isBlocked){
                       return res.json({err:'user blocked'})
                     }
                       res.locals.userid = user?._id
                        next()
                    }})
        
                }
                else{
                    next()
                }
            }
    
        }

        function changePasswordToken(req:Request,res:Response,next:NextFunction){

            const headers = req.headers.authorization

            if(typeof headers === 'string'){
            
                const token = headers.split(' ')[1]
                 if(token){
        
                    jwt.verify(token,'key2',async(err,decoded)=>{
                        if(err) res.json({err:err})
                        else next()
                    }
                        )
                }
            }
    

        }


        export default { isAuth,isBlocked,changePasswordToken}