import mongoose, {Schema,Document,PopulatedDoc} from "mongoose";
import { modelInterface  } from "./modelSchema"
import { brandInterface } from "./brandSchema"
import { optionInterface } from "./optionSchema"
 


interface images {
    URL:string,
    cloudinary_id:string
}

interface productInterface extends Document {

    brand:PopulatedDoc<brandInterface>,
    model:PopulatedDoc<modelInterface>,
    option:PopulatedDoc<optionInterface>,
    price:number,
    year:number,
    user:Schema.Types.ObjectId,
    date:Date,
    fuel:string,
    kmDriven:number,
    Location:string,
     no_of_owners:number
     images:images[],
     isSold:boolean,
     isBlocked:boolean,
     isListed:boolean

} 





const productSchema:Schema<productInterface> = new Schema({
    

    brand:{
       type:Schema.Types.ObjectId,
       ref:'brand',
       required:true
    },
    model:{
       type:Schema.Types.ObjectId,
       ref:'model',
       required:true
   },
    option:{
       type:Schema.Types.ObjectId,
       ref:'option',
       required:true
   },
   user:{
      type:Schema.Types.ObjectId,
      ref:'user',
      required:true
  },
  date:{
   type:Date,
   required:true
  },

    price:{
       type:Number,
       required:true
   },
    year:{
       type:Number,
       required:true
   },
    fuel:{
       type:String,
       required:true
   },
    kmDriven:{
       type:Number,
       required:true
   },
    Location:{

       type:String,
       required:true

    },
    no_of_owners:{
       type:Number,
       required:true
   },
    images:[],

    isSold:{
       type:Boolean,
       default:false
    },

    isBlocked:{
       type:Boolean,
       default:false
    },
    isListed:{
        type:Boolean,
        default:false
    }


   
    

})

const product = mongoose.model('product',productSchema)

export default product