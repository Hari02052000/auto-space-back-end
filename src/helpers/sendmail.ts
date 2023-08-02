import nodemailer from 'nodemailer'


const key = "dkgkkkbpzmengbis"
const transporter = nodemailer.createTransport({

    host: "smtp.gmail.com",
    port: 465,
    auth: {
        user: 'eo.verify@gmail.com',
        pass: key
    }
  

});



let sendotp:number|undefined = undefined


    function sendOtp (email:string, appName="AutoSpace") {
    const otp = Math.floor(Math.random() * 10000);
    const mailOption = {
      from: `${appName} <autoSpace.verify@gmail.com>`,
      to: email,
      subject: "Otp verification",
      html: `<h2>Your verification code for ${appName} is : ${otp} </h2>`,
    };
    transporter.sendMail(mailOption, (err, info)=>{
      if(err) console.log(err)
    });
    
    sendotp = otp
    console.log(otp)
    return true 
  }

  function veryfyOtp(otp:number){
    
    if(sendotp == otp){
        return true
    }

    
    
  }


  export default {
    sendOtp,veryfyOtp    
  }
