"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chatSchema_1 = __importDefault(require("../../models/chatSchema"));
async function getChats(req, res) {
    const userid = res.locals.userid;
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
                timestamps: 1,
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
        {
            $lookup: {
                from: 'messages',
                let: {
                    productId: '$_id.productId',
                    senderId: '$_id.senderId'
                },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $and: [
                                    { $eq: ['$productId', '$$productId'] },
                                    { $eq: ['$senderId', '$$senderId'] },
                                    { $ne: ['$status', 'read'] }
                                ]
                            }
                        }
                    },
                    {
                        $count: 'unreadCount'
                    }
                ],
                as: 'unreadMessages'
            }
        },
        {
            $unwind: {
                path: '$unreadMessages',
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $addFields: {
                unreadCount: { $ifNull: ['$unreadMessages.unreadCount', 0] }
            }
        }
    ]);
    res.json({ chats: chats });
}
exports.default = { getChats };
//# sourceMappingURL=userChatController.js.map