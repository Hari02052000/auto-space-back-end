import { Request,Response,NextFunction } from "express"
import multer,{FileFilterCallback}  from "multer"











const multerFilter = function (req:Request,file:Express.Multer.File,cb:FileFilterCallback){
    if (file.mimetype.startsWith('image')) {
        cb(null, true);
      } else {
        console.log('err')
        cb(null, false);
      }
}

const upload = multer({
    storage: multer.diskStorage({}),
    fileFilter: multerFilter,
  }).array('images', 10);

function uploadFiles(req:Request,res:Response,next:NextFunction){

  
    upload(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            console.log(err.message)
        } else if (err) {
            console.log(err.message)
        }


        next();
      });


}




export default {
    uploadFiles
}