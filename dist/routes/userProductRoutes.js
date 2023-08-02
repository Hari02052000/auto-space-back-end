"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userProductController_1 = __importDefault(require("../controllers/user/userProductController"));
const multer_1 = __importDefault(require("../helpers/multer"));
const isAuth_1 = __importDefault(require("../helpers/isAuth"));
const router = (0, express_1.Router)();
router.get('/get-products', isAuth_1.default.isBlocked, userProductController_1.default.getProducts);
router.get('/get-brands', isAuth_1.default.isBlocked, userProductController_1.default.getBrands);
router.post('/add-product', isAuth_1.default.isAuth, multer_1.default.uploadFiles, userProductController_1.default.addProduct);
//router.post('/get-products',userProductController.getProducts)
exports.default = router;
//# sourceMappingURL=userProductRoutes.js.map