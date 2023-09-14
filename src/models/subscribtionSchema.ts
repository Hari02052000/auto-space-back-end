import mongoose, { Schema,Document } from 'mongoose'

interface subscriptionInterface extends Document {

    name:string,
    no_of_cars:number,
    validity_in_months:number,
    start_date:Date,
    end_date:Date,
    subscribedUsers:Schema.Types.ObjectId[],
    Amount:number,
    isPayed:boolean,
    isListed:boolean,
    isActive:boolean

}

const subscriptionSchema:Schema<subscriptionInterface> = new Schema(
    {
        name:{
            type:String,
            required:true

        },
        isListed:{

            type:Boolean,
            default:true

        },
        isActive:{

            type:Boolean,
            default:false

        },
        no_of_cars:{
            type:Number,
            required:true
        },
        validity_in_months:{
            type:Number,
            required:true
        },
        start_date:{
            type:Date
        },
        end_date:{
            type:Date
        },
        Amount:{
           type:Number,
           required:true
        },
        isPayed:{
        type:Boolean,
         default:false
        },

        subscribedUsers:[
            {
                type:Schema.Types.ObjectId,
                ref:'user'
            }
        ]
    }
)

const subscription = mongoose.model('subscription',subscriptionSchema)

export default subscription