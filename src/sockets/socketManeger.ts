import { Socket, Server as SocketIOServer } from 'socket.io';
import chatHelper from '../helpers/chatHelpers/chatHelper';
import messageSchema, { MessageStatus } from '../models/messageSchema'
import chatschema from '../models/chatSchema'
import userschema from '../models/userSchema'


function socketHandilers(io: SocketIOServer) {

    try {
        const receversocketMap = new Map()
        const userSocketMap = new Map();
        const userNameSpace = io.of('/user-chat')
        const alert = io.of('/user-alert')

         alert.on('connection', async (socket) => {
            console.log('connected to alert')
            const userToken = socket.handshake.auth.token
            const alertUserid = await chatHelper.tokenValidate(userToken)
            console.log(alertUserid)
            if (alertUserid == 'noUser' || !alertUserid) {

                alert.emit('noUser')
                socket.disconnect()
            }
            if (alertUserid != 'noUser') {
                receversocketMap.set(alertUserid, socket.id)
                console.log('connected', alertUserid)
                 console.log(receversocketMap)
        
                const count = await messageSchema.find({
                    $and: [
                        {
                            reciverId: alertUserid
                        },
                        {
                            status: MessageStatus.Unread
                        }
                    ]
                }).count()
                console.log('unreadMessages', count)
                const user = await userschema.findOne({ _id: alertUserid })
                const data = {
                    loged: true,
                    unreadMessages: count,
                    user: user
                }

                socket.join(alertUserid);
                alert.to(alertUserid).emit('connected', data);

                 socket.on('makeZero',async()=>{

                    // await messageSchema.updateMany({ reciverId: alertUserid }, { $set: { status: MessageStatus.Delivered } })
                    // console.log('make zero')

                 }
                 )

                // alert.emit('connected', data)
                //  await messageSchema.updateMany({ reciverId: alertUserid }, { $set: { status: MessageStatus.Delivered } })

                socket.on('disconnect', () => {

                    receversocketMap.delete(alertUserid)
                })


            }

            // const count = await messageSchema.find({ $and: [{ _id: new ObjectId() }, { status: MessageStatus.Unread }] }).count()
        }




        )


        userNameSpace.on('connection', async (socket) => {
            console.log('connected with socketid', socket.id)

            const userToken = socket.handshake.auth.token
            const senderid = await chatHelper.tokenValidate(userToken)
            console.log('connected', senderid)

            if (senderid) {
                const userSocket = userSocketMap.get(senderid);
                if (!userSocket) {
                    userSocketMap.set(senderid, socket.id);
                }


                socket.on('sendMessage', async (data: any) => {
                    const productid = data.productid
                    const receverid = data.recevierid
                    const text = data.text
                    console.log(productid, receverid, text)

                    const newMessage = await messageSchema.create({
                        senderId: senderid,
                        reciverId: receverid,
                        productId: productid,
                        text: text
                    })
                    const chat = await chatschema.findOneAndUpdate({
                        $and: [
                            {
                                members: { $all: [senderid, receverid] }

                            },
                            {
                                productId: productid
                            }

                        ]
                    }, { latestMessage: newMessage.text })
                    if (!chat) {
                        await chatschema.create(
                            {
                                members: [senderid, receverid],
                                productId: productid,
                                latestMessage: newMessage.text

                            }
                        )
                    }
                    const receiverSocketId = userSocketMap.get(receverid);
                    const senderSocketId = userSocketMap.get(senderid)
                    const alertSocketId = receversocketMap.get(receverid)


                    if (receiverSocketId) {

                        newMessage.status = MessageStatus.Read
                        await newMessage.save()
                        console.log('sending to recever')
                        userNameSpace.to(receiverSocketId).emit('chat-saved', newMessage);

                    }


                    if (alertSocketId && !receiverSocketId) {

                        newMessage.status = MessageStatus.Delivered
                        await newMessage.save()
                        const alertMsg = newMessage
                        await alertMsg.populate('senderId')
                        alert.to(alertSocketId).emit('newMessage',alertMsg )
                    }

                    if (senderSocketId) {
                       
                        console.log('sending to sender')

                        userNameSpace.to(senderSocketId).emit('chat-saved', newMessage);

                    }




                })


            }







             socket.on('disconnect', (socket) => {
                userSocketMap.delete(senderid);

                console.log('dissconnected')
            })
        })

    }

    catch (err) {
        console.log(err)
    }




}



export default { socketHandilers }
