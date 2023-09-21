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
exports.defaultProfileEnum = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const bcrypt_1 = __importDefault(require("bcrypt"));
var defaultProfileEnum;
(function (defaultProfileEnum) {
    defaultProfileEnum["URL"] = "https://res.cloudinary.com/dgblwidrj/image/upload/v1694673343/evkxq9lute2zbobaf964.png";
    defaultProfileEnum["cloudinary_id"] = "evkxq9lute2zbobaf964";
})(defaultProfileEnum || (exports.defaultProfileEnum = defaultProfileEnum = {}));
const userSchema = new mongoose_1.Schema({
    email: {
        type: String,
        unique: true,
        required: [true, 'please provide username']
    },
    password: {
        type: String,
        required: [true, 'please provide password']
    },
    isverified: {
        type: Boolean,
        default: false
    },
    isBlocked: {
        type: Boolean,
        default: false
    },
    username: {
        type: String,
        required: [true, 'please provide username']
    },
    alowedCars: {
        type: Number,
        default: 0
    },
    isTrailUsed: {
        type: Boolean,
        default: false
    },
    profile: {
        URL: {
            type: String,
            default: defaultProfileEnum.URL
        },
        cloudinary_id: {
            type: String,
            default: defaultProfileEnum.cloudinary_id
        }
    }
});
// URL:'https://res.cloudinary.com/dgblwidrj/image/upload/v1694673343/evkxq9lute2zbobaf964.png'
// cloudinary_id:'evkxq9lute2zbobaf964'
userSchema.pre('save', async function (next) {
    this.password = await bcrypt_1.default.hash(this.password, 12);
    next();
});
const user = mongoose_1.default.model('user', userSchema);
exports.default = user;
//# sourceMappingURL=userSchema.js.map