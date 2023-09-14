import mongoose, {Schema,Document} from "mongoose";
import bcrypt from "bcrypt"

interface userprofile{
    URL:string,
    cloudinary_id:string

}

 interface userInterface extends Document {

    email:string,
    password:string,
    isverified:boolean,
    isBlocked:boolean,
    username:string,
    subscription:Schema.Types.ObjectId,
    profile:userprofile

}

   const userSchema:Schema<userInterface> = new Schema({
       
    email:{
                type:String,
                unique:true,
                required:[true,'please provide username']
                
            },
        
            password:{
                type:String,
                required:[true,'please provide password']
            },
            isverified:{
                type:Boolean,
                default:false
            },
            isBlocked:{
                type:Boolean,
                default:false
            },
            username:{
                type:String,
                required:[true,'please provide username']


            },
            subscription:
                {
                 type:Schema.Types.ObjectId,
                 ref:'subscription'

                },
            
            profile:{
                URL:{
                    type:String,
                    default:'https://res.cloudinary.com/dgblwidrj/image/upload/v1694673343/evkxq9lute2zbobaf964.png'
                },
                cloudinary_id:{
                    type:String,
                    default:'evkxq9lute2zbobaf964'
                }
                
            }


   })
// URL:'https://res.cloudinary.com/dgblwidrj/image/upload/v1694673343/evkxq9lute2zbobaf964.png'
// cloudinary_id:'evkxq9lute2zbobaf964'

userSchema.pre('save',async function(next){
    this.password= await bcrypt.hash(this.password,12);
    next();
})

const user=mongoose.model('user',userSchema);

export default user