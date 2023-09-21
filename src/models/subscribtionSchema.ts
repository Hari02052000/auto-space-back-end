import mongoose, { Schema, Document } from 'mongoose'

interface subscriptionInterface extends Document {

    plan: Schema.Types.ObjectId,
    user: Schema.Types.ObjectId,
    startDate: Date,
    endDate: Date,
    isPayed: boolean
    Amount: number,

}

const subscriptionSchema: Schema<subscriptionInterface> = new Schema(
    {
        plan: {
            type: Schema.Types.ObjectId,
            ref: 'plan',
            required: true

        },
        user:
        {
            type: Schema.Types.ObjectId,
            ref: 'user',
            required: true

        },


        startDate: {
            type: Date,
            required: true
        },
        endDate: {
            type: Date,
            required: true
        },
        Amount: Number,
        isPayed: {
            type:Boolean,
            default:false
        },

    }
)

const subscription = mongoose.model('subscription', subscriptionSchema)

export default subscription