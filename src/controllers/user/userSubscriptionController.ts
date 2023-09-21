import { Request, Response } from "express"

import plansModel from "../../models/plansSchema"

import subscriptionModel from "../../models/subscribtionSchema"

import userschema from "../../models/userSchema"


async function getPlans(req: Request, res: Response) {

    try {

        const plans = await plansModel.find()
        res.json({ plans: plans })
    }

    catch (err: any) {

        res.json({ err: err.message })

    }
}


async function createPayment(req: Request, res: Response) {

    const userId = res.locals.userid


    try {

        const planId = req.body.planId
        console.log(planId)
        const userid = res.locals.userid

        const selectedplan = await plansModel.findOne({ _id: planId })
        if (!selectedplan) {
            res.json({ err: 'plan not available' })
        }
        if (selectedplan?.Amount === 0) {
            //find user free trail taken or not if taken 
            const user = await userschema.findOne({_id:userid})
            if(user){

                if(!user.isTrailUsed){

                    const startDate = Date.now()
                    const endDate = new Date(startDate);
                endDate.setMonth(endDate.getMonth() + selectedplan.validity_in_months);

                   
                    const subscription = await subscriptionModel.create({
                       plan:selectedplan._id,
                       user:user._id,
                       startDate:startDate,
                       endDate:endDate,
                       isPayed:true
                    })

                    await userschema.findOneAndUpdate({_id:user._id},{$set:{alowedCars:selectedplan.no_of_cars,isTrailUsed:true}})

                    res.json({subscribed:true,payed:true})

                }
            }


            else{
                res.json({err:'something went wrong please login and continue'})
            }
            //send you canot take this
            //else
            //set user freetrail taken is true and update
        }

        else {

            // if(selectedplan?.Amount){

            //     const startDate = Date.now()
            //     const endDate = new Date(startDate);
            //     endDate.setMonth(endDate.getMonth() + selectedplan.validity_in_months);
            //     const subscription = await subscriptionModel.create({
            //         plan:selectedplan._id,
            //         user:userId,
            //         startDate:startDate,
            //         endDate:endDate

            //     })
              

                // let instance = new Razorpay({
                //     key_id: 'rzp_test_8emA6zzli6nGP1',
                //     key_secret:'O4RlOXRxnLAX8IaXM3ifqFZZ'
                //   });
                //   let options = {
                //     amount: selectedplan?.Amount*100,
                //     currency: "INR",
                //     receipt: "" + subscription._id
                //   };
                
                //   instance.orders.create(options,function(err,order){
                //     res.json({created:true,order:order})
                //   })


         //   }


  
              
        }

      


    }
    catch (err) {

    }

}

// verifyOnlinePayment: async (req, res) => {
//     try {
//       let user = req.user
//       const { response, order } = req.body
//       const crypto = require('crypto')
//       let hmac = await crypto.createHmac('sha256', 'O4RlOXRxnLAX8IaXM3ifqFZZ')
//       await hmac.update(response.razorpay_order_id + '|' + response.razorpay_payment_id)
//       hmac = await hmac.digest('hex')
//       if (hmac == response.razorpay_signature) {
//         await orderModel.findOneAndUpdate({ _id: order.receipt }, { $set: { paymentStatus: 'payed' } })
//         await userModel.findOneAndUpdate({ _id: user._id }, { $set: { cart: [] } })

//         //update order status and clear usercart
//         res.json({ paymet: true })
//       }
//       else {
//         res.json({ payment: 'failed' })
//       }
//     }
//     catch (err) {
//       res.json({ err })
//     }

//   }









export default {
    getPlans,
    createPayment
}