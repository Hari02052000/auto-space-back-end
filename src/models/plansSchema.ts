import mongoose, { Schema, Document } from 'mongoose'

interface planInterface extends Document {

    name: string,
    no_of_cars: number,
    validity_in_months: number,
    Amount: number,
    isListed: boolean,

}

const planSchema: Schema<planInterface> = new Schema(
    {
        name: {
            type: String,
            required: true,
            unique:true

        },
        isListed: {

            type: Boolean,
            default: true

        },
        no_of_cars: {
            type: Number,
            required: true
        },
        validity_in_months: {
            type: Number,
            required: true
        },
        Amount: {
            type: Number,
            required: true
        }
    }
)

const plan = mongoose.model('plan', planSchema)

export default plan