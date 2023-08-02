import mongoose, {Schema,Document} from "mongoose";
import bcrypt from "bcrypt"

 interface userInterface extends Document {

    email:string,
    password:string,
    isverified:boolean,
    isBlocked:boolean,
    username:string
    products?:Schema.Types.ObjectId[]

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
            products:[
                {
                 type:Schema.Types.ObjectId,
                 ref:'products'

                }
            ] 

   })


userSchema.pre('save',async function(next){
    this.password= await bcrypt.hash(this.password,12);
    next();
})

const user=mongoose.model('user',userSchema);

export default user