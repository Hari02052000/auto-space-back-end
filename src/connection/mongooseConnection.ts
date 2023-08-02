import mongoose from "mongoose"; 


mongoose.connect('mongodb://localhost:27017/auto-space')
mongoose.connection.on('err',error=>console.log(error))
mongoose.connection.once('open',()=>console.log('connected to db')) 
