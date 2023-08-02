import mongoose, {Schema,Document} from "mongoose";
import bcrypt from "bcrypt"

 interface adminInterface extends Document {

    email:string,
    password:string,
    
}

   const adminSchema:Schema<adminInterface> = new Schema({
       
    email:{
                type:String,
                unique:true,
                required:[true,'please provide username']
                
            },
        
            password:{
                type:String,
                required:[true,'please provide password']
            }
           
   })


adminSchema.pre('save',async function(next){
    this.password= await bcrypt.hash(this.password,12);
    next();
})

const admin=mongoose.model('admin',adminSchema);

export default admin