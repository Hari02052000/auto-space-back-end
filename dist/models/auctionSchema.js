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
const AuctionSchema = new mongoose_1.Schema({
    brand: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'brand',
        required: true
    },
    model: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'model',
        required: true
    },
    option: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'option',
        required: true
    },
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    date: {
        type: Date,
        default: undefined
    },
    basePrice: {
        type: Number,
        required: true
    },
    currentBid: {
        type: Number,
        default: function () {
            return this.basePrice;
        }
    },
    members: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'user'
        }
    ],
    year: {
        type: Number,
        required: true
    },
    fuel: {
        type: String,
        required: true
    },
    kmDriven: {
        type: Number,
        required: true
    },
    Location: {
        type: String,
        required: true
    },
    no_of_owners: {
        type: Number,
        required: true
    },
    images: [],
    isFinished: {
        type: Boolean,
        default: false
    },
    isApproved: {
        type: Boolean,
        default: false
    }
});
const auction = mongoose_1.default.model('auction', AuctionSchema);
exports.default = auction;
//# sourceMappingURL=auctionSchema.js.map