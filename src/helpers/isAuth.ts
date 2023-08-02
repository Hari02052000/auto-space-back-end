import { Request,Response,NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import userModel from "../models/userSchema"
import sendmail from './sendmail'

function isAuth(req:Request,res:Response,next:NextFunction){
    let user=undefined
   const headers = req.headers.usertoken
   

    if(typeof headers === 'string'){
    
        const token = headers.split(' ')[1]
    
         if(token){

            jwt.verify(token,'key1',async(err,decoded)=>{
                if(err) res.json({err:err})
                else if(decoded){

                const decodedPayload = decoded as jwt.JwtPayload; // Type assertion

                    
                 user=await userModel.findOne({_id:decodedPayload.id})

                 res.locals.user = user
                 
                 if(user?.isBlocked){
                   return res.json({err:'user blocked'})
                 }
                 if(!(user?.isverified)){
                    if(user)
                    sendmail.sendOtp(user.email)
                    res.locals.email = user?.email
                    return res.json({err:'user not verified'})
                 }
    
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
        
             if(token){
    
                jwt.verify(token,'key1',async(err,decoded)=>{
                    if(err) res.json({err:err})
                    else if(decoded){
    
                    const decodedPayload = decoded as jwt.JwtPayload; // Type assertion
    
                        
                     user=await userModel.findOne({_id:decodedPayload.id})
                     
                     if(user?.isBlocked){
                       return res.json({err:'user blocked'})
                     }
        
                        next()
                    }})
        
                }
                else{

                    next()
                }
            }
    
        }

        function changePasswordToken(req:Request,res:Response,next:NextFunction){

            const headers = req.headers.Authorization
       
    
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