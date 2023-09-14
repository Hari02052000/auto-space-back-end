"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chatHelper_1 = __importDefault(require("../helpers/chatHelpers/chatHelper"));
const messageSchema_1 = __importStar(require("../models/messageSchema"));
const chatSchema_1 = __importDefault(require("../models/chatSchema"));
function socketHandilers(io) {
    const receversocketMap = new Map();
    const userSocketMap = new Map();
    const userNameSpace = io.of('/user-chat');
    const alert = io.of('/user-alert');
    alert.on('connection', async (socket) => {
        const userToken = socket.handshake.auth.token;
        const alertUserid = await chatHelper_1.default.tokenValidate(userToken);
        if (alertUserid == 'noUser') {
            socket.disconnect();
        }
        receversocketMap.set(alertUserid, socket.id);
        console.log('connected', alertUserid);
        const count = await messageSchema_1.default.find({ $and: [{ _id: alertUserid }, { status: messageSchema_1.MessageStatus.Unread }] }).count();
        const user = {
            loged: true,
            unreadMessages: count
        };
        alert.emit('connected', user);
        await messageSchema_1.default.updateMany({ reciverId: alertUserid }, { $set: { status: messageSchema_1.MessageStatus.Delivered } });
        socket.on('disconnect', () => {
            receversocketMap.delete(alertUserid);
        });
    });
    userNameSpace.on('connection', async (socket) => {
        console.log('connected with socketid', socket.id);
        const userToken = socket.handshake.auth.token;
        const senderid = await chatHelper_1.default.tokenValidate(userToken);
        console.log('connected', senderid);
        if (senderid) {
            const userSocket = userSocketMap.get(senderid);
            if (!userSocket) {
                userSocketMap.set(senderid, socket.id);
            }
            socket.on('sendMessage', async (data) => {
                console.log(data);
                const productid = data.productid;
                const receverid = data.recevierid;
                const text = data.text;
                console.log(productid, receverid, text);
                const newMessage = await messageSchema_1.default.create({
                    senderId: senderid,
                    reciverId: receverid,
                    productId: productid,
                    text: text
                });
                const chat = await chatSchema_1.default.findOneAndUpdate({ $and: [
                        {
                            members: { $all: [senderid, receverid] }
                        },
                        {
                            productId: productid
                        }
                    ]
                }, { latestMessage: newMessage.text });
                if (!chat) {
                    await chatSchema_1.default.create({
                        members: [senderid, receverid],
                        productId: productid,
                        latestMessage: newMessage.text
                    });
                }
                const receiverSocketId = userSocketMap.get(receverid);
                const senderSocketId = userSocketMap.get(senderid);
                const alertSocketId = receversocketMap.get(receverid);
                if (alertSocketId) {
                    newMessage.status = messageSchema_1.MessageStatus.Delivered;
                    await newMessage.save();
                    alert.to(alertSocketId).emit('newMessage', 'newMessageRecived');
                }
                console.log('reciversocket', receiverSocketId);
                console.log('sendersocket', senderSocketId);
                console.log(userSocketMap);
                if (receiverSocketId) {
                    // update message status read
                    newMessage.status = messageSchema_1.MessageStatus.Read;
                    await newMessage.save();
                    userNameSpace.to(receiverSocketId).emit('chat-saved', newMessage);
                }
                if (senderSocketId) {
                    console.log('sending to sender');
                    userNameSpace.to(senderSocketId).emit('chat-saved', newMessage);
                }
            });
        }
        socket.on('disconnect', (socket) => {
            userSocketMap.delete(senderid);
            console.log('dissconnected');
        });
    });
}
exports.default = { socketHandilers };
//# sourceMappingURL=socketManeger.js.map