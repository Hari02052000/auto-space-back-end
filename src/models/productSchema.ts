import mongoose, {Schema,Document} from "mongoose";



interface images {
    URL:string,
    cloudinary_id:string
}

interface productInterface extends Document {

    brand:Schema.Types.ObjectId,
    model:Schema.Types.ObjectId,
    option:Schema.Types.ObjectId,
    price:number,
    year:number,
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