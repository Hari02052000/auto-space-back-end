import mongoose, { Schema, Document } from "mongoose";

export interface optionInterface extends Document {
    name: string,

}

const optionSchema: Schema<optionInterface> = new Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true
        }
    }
)

const option = mongoose.model('option', optionSchema)
export default option