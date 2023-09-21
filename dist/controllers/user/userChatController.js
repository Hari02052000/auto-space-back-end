"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chatSchema_1 = __importDefault(require("../../models/chatSchema"));
// for send message(creating new mesage) content chatid create mesage with sender,content,chatid
// 
//
//  var newMessage = {
//   sender: req.user._id,
//   content: content,
//   chat: chatId,
// };
// try {
//   var message = await Message.create(newMessage);
//   message = await message.populate("sender", "name pic").execPopulate();
//   message = await message.populate("chat").execPopulate();
//   message = await User.populate(message, {
//     path: "chat.users",
//     select: "name pic email",
//   });
//   await Chat.findByIdAndUpdate(req.body.chatId, { latestMessage: message });
//   res.json(message);
//geting perticular chatmesages with a chat id
//    const messages = await Message.find({ chat: req.params.chatId })
// .populate("sender", "name pic email")
// .populate("chat");
// res.json(messages);
// } catch (error) {
// res.status(400);
// throw new Error(error.message);
// }
async function getChats(req, res) {
    const userid = res.locals.userid;
    console.log(userid);
    //  const chats = await chatschema.find({members:userid}).populate({path:'members',match:{_id:{$ne:userid}}})
    //  console.log(chats[0].members)
    // const chats = await chatschema.aggregate([
    //   {
    //     $match:{
    //       members:userid
    //     }
    //   },
    //   {
    //     $lookup:{
    //       from:'users',
    //       localField:'members',
    //       foreignField:'_id',
    //       as:'sender'
    //     }
    //   },
    //   {
    //     $unwind:'$sender'
    //   },
    //   {
    //     $match:{
    //       'sender._id':{$ne:userid}
    //     }
    //   },
    //   {
    //     $project:{
    //       _id:1,
    //       productId:1,
    //       latestMessage:1,
    //       timestamps:1,
    //       sender:1
    //     }
    //   }
    // ])
    const chats = await chatSchema_1.default.aggregate([
        {
            $match: {
                members: userid
            }
        },
        {
            $lookup: {
                from: 'users',
                localField: 'members',
                foreignField: '_id',
                as: 'sender'
            }
        },
        {
            $unwind: '$sender'
        },
        {
            $match: {
                'sender._id': { $ne: userid }
            }
        },
        {
            $project: {
                _id: 1,
                productId: 1,
                latestMessage: 1,
                timestamrps: 1,
                sender: 1
            }
        },
        {
            $group: {
                _id: {
                    productId: '$productId',
                    senderId: '$sender._id'
                },
                chats: { $push: '$$ROOT' }
            }
        },
    ]);
    res.json({ chats: chats });
}
async function createChat(req, res) {
}
exports.default = { getChats, createChat };
//# sourceMappingURL=userChatController.js.map