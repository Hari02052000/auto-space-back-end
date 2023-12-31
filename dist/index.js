"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const morgan_1 = __importDefault(require("morgan"));
const http_1 = __importDefault(require("http"));
dotenv_1.default.config();
const socket_io_1 = require("socket.io");
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const adminRoutes_1 = __importDefault(require("./routes/adminRoutes"));
const userProductRoutes_1 = __importDefault(require("./routes/userProductRoutes"));
const adminProductRoutes_1 = __importDefault(require("./routes/adminProductRoutes"));
const adminUserRoutes_1 = __importDefault(require("./routes/adminUserRoutes"));
const adminBrandRoutes_1 = __importDefault(require("./routes/adminBrandRoutes"));
const userChatRoute_1 = __importDefault(require("./routes/userChatRoute"));
const userSubscriptionRoutes_1 = __importDefault(require("./routes/userSubscriptionRoutes"));
const adminPlanRoutes_1 = __importDefault(require("./routes/adminPlanRoutes"));
const socketManeger_1 = __importDefault(require("./sockets/socketManeger"));
require("./connection/mongooseConnection");
const app = (0, express_1.default)();
app.use((0, cors_1.default)({ origin: '*' }));
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server);
app.use((0, morgan_1.default)('dev'));
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.json());
socketManeger_1.default.socketHandilers(io);
app.use('/product', userProductRoutes_1.default);
app.use('/user/products', userProductRoutes_1.default);
app.use('/user/chat', userChatRoute_1.default);
app.use('/user/subscription', userSubscriptionRoutes_1.default);
app.use('/user', userRoutes_1.default);
app.use('/admin/products', adminProductRoutes_1.default);
app.use('/admin/users', adminUserRoutes_1.default);
app.use('/admin/brand', adminBrandRoutes_1.default);
app.use('/admin/model', adminBrandRoutes_1.default);
app.use('/admin/option', adminBrandRoutes_1.default);
app.use('/admin/plans', adminPlanRoutes_1.default);
app.use('/admin', adminRoutes_1.default);
server.listen(process.env.PORT, () => console.log('server started...', process.env.PORT));
//# sourceMappingURL=index.js.map