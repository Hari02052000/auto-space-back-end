import mongoose, {Schema,Document} from "mongoose";

interface modelInterface extends Document {
    name:string,
    options:Schema.Types.ObjectId[]
} 

const modelSchema:Schema<modelInterface> = new Schema(
    {
        name:{
            type:String,
            required:true,
            
        },
        options:[
            {
                type:Schema.Types.ObjectId,
                ref:'option'
            }
        ]
    }
)

const model = mongoose.model('model',modelSchema)
export default model