import mongoose, { Schema, Document, PopulatedDoc } from "mongoose";
import { modelInterface } from "./modelSchema"

export interface brandInterface extends Document {
    name: string,
    models: PopulatedDoc<modelInterface>[],
    isListed: boolean
}

const brandSchema: Schema<brandInterface> = new Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true
        },
        models: [
            {
                type: Schema.Types.ObjectId,
                ref: 'model'
            }
        ],
        isListed: {
            type: Boolean,
            default: true
        }
    }
)

const brand = mongoose.model('brand', brandSchema)
export default brand