import { v2 }  from "cloudinary"

const cloudinary = v2

  
  

cloudinary.config({
    cloud_name: 'dgblwidrj',
    //process.env.cloud_name,
    api_key:'443134725149471',
    //process.env.api_key,
    api_secret:'I-tYmqJ1J59c0yvDTsVJ0B70TsE'
    //process.env.api_secret
  });

   async function multiFiles(imageFiles:Express.Multer.File[]){

      const images:Array<{URL:string,cloudinary_id:string}> =[]
     
      await Promise.all(


        imageFiles.map(async(image)=>{
            await cloudinary.uploader.upload(image.path,(err,url)=>{
                if(url) {
                    
                     images.push({URL:url.secure_url,cloudinary_id:url.public_id})
                }
    
                else{
                  
                    console.log(err)
                    
                }
            })
        })
    
    

      )

      return images
       
    


  }

  export default {multiFiles}