
import mongoose, {Schema,Document} from "mongoose";

export enum MessageStatus {
    Unread = 'unread',
    Delivered = 'delivered',
    Read = 'read',
  }
  
interface messageInterface extends Document {

    senderId:Schema.Types.ObjectId,
    reciverId:Schema.Types.ObjectId,
    productId:Schema.Types.ObjectId,
    text:string,
    timestamps:Date,
    status:MessageStatus
} 

const messageSchema:Schema<messageInterface> = new Schema(
        {
            senderId:{
                type:Schema.Types.ObjectId,
                ref:'user',
                required:true
            },
            reciverId:{
                type:Schema.Types.ObjectId,
                ref:'user',
                required:true
            },
            productId:{
                type:Schema.Types.ObjectId,
                ref:'product',
                required:true
            },

            text:{
                type:String,
                required:true
            },
            timestamps:{
                type:Date,
                default:Date.now()
            },
            status:{
                type: String,
                enum: Object.values(MessageStatus), 
                default: MessageStatus.Unread, 
            }
    

        }

    
)

const message = mongoose.model('message',messageSchema)
export default message
