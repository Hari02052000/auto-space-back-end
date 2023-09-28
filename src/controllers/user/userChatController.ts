import { Request, Response } from 'express'
import chatschema from "../../models/chatSchema"



async function getChats(req: Request, res: Response) {

  const userid = res.locals.userid

  const chats = await chatschema.aggregate([
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
                  { $eq: ['$status', 'unread'] }
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















  res.json({ chats: chats })

}











export default { getChats }


