"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auctionController_1 = __importDefault(require("../controllers/user/auctionController"));
const multer_1 = __importDefault(require("../helpers/multer"));
const isAuth_1 = __importDefault(require("../helpers/isAuth"));
const router = (0, express_1.Router)();
router.post('/add-auction', isAuth_1.default.isAuth, multer_1.default.uploadFiles, auctionController_1.default.addAuction);
exports.default = router;
//# sourceMappingURL=userAuctionRoutes.js.map