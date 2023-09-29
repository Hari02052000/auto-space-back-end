import { Request, Response } from 'express'
import plansSchema from '../../models/plansSchema'
import subscriptionSchema from '../../models/subscribtionSchema'
import pdfDocument  from 'pdfkit-table'



async function getPlans(req:Request,res:Response){

    const plans = await plansSchema.find()

    res.json({plans:plans})
}

async function addplan(req:Request,res:Response){
   const {name,no_of_cars,validity_in_months,Amount} = req.body

   const isOldName = await plansSchema.findOne({name:name})
   if(isOldName){
    return res.json({err:'name allredy exist'})
   }

   const plan = await plansSchema.create({name,no_of_cars,validity_in_months,Amount})
   res.json({isPlanAdded:true,plan:plan})
}

async function editplan(req:Request,res:Response){
    const {id,name,no_of_cars,validity_in_months,Amount} = req.body
    const oldplan = await plansSchema.findOne({_id:id})
    if(oldplan?.name!=name){
        const isPlanExist = await plansSchema.findOne({name:name})
        if(isPlanExist){
            return res.json({err:'name allredy exist'})
        }
    }

    await plansSchema.findOneAndUpdate({_id:id},{$set:{name,no_of_cars,validity_in_months,Amount}})

    const newPlan = await plansSchema.findOne({_id:id})

    res.json({edited:true,plan:newPlan})


}
 
async function getSubscriptionDetails(req:Request,res:Response){

    try{

        let{fromDate,toDate}=req.body
        fromDate=new Date(fromDate).setHours(0,0,0)
        toDate=new Date(toDate).setHours(23,59,59)
        let subscriptions:any[]=await subscriptionSchema.find({startDate: {
            $gte: fromDate,
            $lte: toDate,
          }}).populate('user').populate('plan');

          let doc:any = new pdfDocument()
          doc.margin = 0
          doc.size = [1000,1000]

          let details:any[]=[]
          subscriptions.forEach(subscription => {
           details.push([subscription._id, subscription.plan.name, subscription.user.username,subscription.startDate.toLocaleDateString(),subscription.plan.Amount,subscription.isPayed]);
          })

          const title='subscription details'
          const headers = ['id', 'plan', 'username','taked date','plan amount','payment status'];
          const rows = details

          doc.table({title,headers,rows},{

            columnsSize: [ 200, 50, 100,100,60,50 ],
        
          })
        
        
          res.setHeader('Content-disposition', 'attachment; filename=subscription-details.pdf');
          res.setHeader('Content-type', 'application/pdf');
          doc.pipe(res);
          doc.end();
        
        


    }

    catch(err){

    }

}






export default { getPlans,addplan,editplan,getSubscriptionDetails }