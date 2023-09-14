import { Socket, Server as SocketIOServer } from 'socket.io';
import chatHelper from '../helpers/chatHelpers/chatHelper';
import messageSchema, { MessageStatus } from '../models/messageSchema'
import userSchema from '../models/userSchema';
import chatschema from '../models/chatSchema'
import allerts from './allerts';

 function socketHandilers(io:SocketIOServer){
     
    const receversocketMap = new Map()
    const userSocketMap = new Map();
    const userNameSpace = io.of('/user-chat')
    const alert = io.of('/user-alert')

    alert.on('connection',async(socket)=>{
        const userToken = socket.handshake.auth.token
        const alertUserid =  await chatHelper.tokenValidate(userToken)
        if(alertUserid == 'noUser'){
            socket.disconnect()
        }
        receversocketMap.set(alertUserid,socket.id)
        console.log('connected',alertUserid)
        const count = await messageSchema.find({$and:[{_id:alertUserid},{status:MessageStatus.Unread}]}).count()
        const user = {
            loged:true,
            unreadMessages:count
        }
        alert.emit('connected',user)
        await messageSchema.updateMany({reciverId:alertUserid},{$set:{ status:MessageStatus.Delivered  }})

        socket.on('disconnect',()=>{

            receversocketMap.delete(alertUserid)
        })
    }

    

    
    )


     userNameSpace.on('connection',async(socket)=>{
        console.log('connected with socketid',socket.id)
      
        const userToken = socket.handshake.auth.token
        const senderid =  await chatHelper.tokenValidate(userToken)
        console.log('connected',senderid)

        if(senderid){
            const userSocket = userSocketMap.get(senderid);
         if (!userSocket) {
            userSocketMap.set(senderid, socket.id);
         }


            socket.on('sendMessage',async(data:any)=>{
                console.log(data)
                const productid = data.productid
                const receverid = data.recevierid
                const text = data.text
                console.log(productid,receverid,text)
                const newMessage = await messageSchema.create({
                    senderId:senderid,
                    reciverId:receverid,
                    productId:productid,
                    text:text
                })
                const chat = await chatschema.findOneAndUpdate({ $and:[
                    {
                        members:{$all:[senderid,receverid]}

                    },
                    {
                        productId:productid
                    }
                    
                ]
                 },{latestMessage:newMessage.text})
                if(!chat){
                    await chatschema.create(
                        {
                            members:[senderid,receverid],
                            productId:productid,
                            latestMessage:newMessage.text

                        }
                    )
                }
                const receiverSocketId = userSocketMap.get(receverid);
                const senderSocketId = userSocketMap.get(senderid)
                const alertSocketId = receversocketMap.get(receverid)
                if(alertSocketId){
                    newMessage.status = MessageStatus.Delivered
                    await newMessage.save()

                    alert.to(alertSocketId).emit('newMessage','newMessageRecived')
                }
                console.log('reciversocket',receiverSocketId)
                console.log('sendersocket',senderSocketId)
                console.log(userSocketMap)
                if (receiverSocketId) {
                    // update message status read
                    newMessage.status = MessageStatus.Read
                    await newMessage.save()

                    userNameSpace.to(receiverSocketId).emit('chat-saved', newMessage);

                }
               if(senderSocketId){
                userNameSpace.to(senderSocketId).emit('chat-saved', newMessage);

               }



               })
    

        }
    

    

      
      

     socket.on('disconnect',(socket)=>{
        userSocketMap.delete(senderid);  

        console.log('dissconnected')
    })
})






 }
 


export default {socketHandilers}
