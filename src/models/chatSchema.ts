import mongoose, {Schema,Document, Mongoose} from "mongoose";



interface chatInterface extends Document {
    members:[],
    productId:Schema.Types.ObjectId,
    latestMessage:string,
    timestamps:Date


} 

const chatSchema:Schema<chatInterface> = new Schema(
    {
        members:[
            {
                type:Schema.Types.ObjectId,
                ref:'user'
            }
        ],
        productId:{
            type:Schema.Types.ObjectId,
            ref:'product',
            required:true
        },


        latestMessage:{
            type:String
        },

        timestamps:{
            type:Date,
            default:Date.now()
        }
    

    }

)

// interface chatInterface extends Document {
//     customer:Schema.Types.ObjectId,
//     owner:Schema.Types.ObjectId,
//     message:string,
//     product:Schema.Types.ObjectId,
//     time:Date,
//     isRead:boolean
// } 

// const chatSchema:Schema<chatInterface> = new Schema(
//     {
//         customer:{
//             required:true,
//             type:Schema.Types.ObjectId,
//             ref:'user'
//         },
//         owner:{
//             required:true,
//             type:Schema.Types.ObjectId,
//             ref:'user'
//         },
//         product:{
//            required:true,
//            type:Schema.Types.ObjectId,
//            ref:'product'
//         },
//         time:{
//             type:Date,
//             default:Date.now()
//         },
//         isRead:{
//             type:Boolean,
//             default:false
//         }
//     }
// )

const chat = mongoose.model('chat',chatSchema)
export default chat