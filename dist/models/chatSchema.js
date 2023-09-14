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
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const chatSchema = new mongoose_1.Schema({
    members: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'user'
        }
    ],
    productId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'product',
        required: true
    },
    latestMessage: {
        type: String
    },
    timestamps: {
        type: Date,
        default: Date.now()
    }
});
// interface chatInterface extends Document {
//     customer:Schema.Types.ObjectId,
//     owner:Schema.Types.ObjectId,
//     message:string,
//     product:Schema.Types.ObjectId,
//     time:Date,
//     isRead:boolean
// } 
// const chatSchema:Schema<chatInterface> = new Schema(
//     {
//         customer:{
//             required:true,
//             type:Schema.Types.ObjectId,
//             ref:'user'
//         },
//         owner:{
//             required:true,
//             type:Schema.Types.ObjectId,
//             ref:'user'
//         },
//         product:{
//            required:true,
//            type:Schema.Types.ObjectId,
//            ref:'product'
//         },
//         time:{
//             type:Date,
//             default:Date.now()
//         },
//         isRead:{
//             type:Boolean,
//             default:false
//         }
//     }
// )
const chat = mongoose_1.default.model('chat', chatSchema);
exports.default = chat;
//# sourceMappingURL=chatSchema.js.map