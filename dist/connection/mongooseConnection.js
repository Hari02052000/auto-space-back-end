"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
mongoose_1.default.connect('mongodb://localhost:27017/auto-space');
mongoose_1.default.connection.on('err', error => console.log(error));
mongoose_1.default.connection.once('open', () => console.log('connected to db'));
//# sourceMappingURL=mongooseConnection.js.map