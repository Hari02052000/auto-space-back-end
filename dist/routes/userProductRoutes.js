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
router.get('/search-products', isAuth_1.default.isBlocked, userProductController_1.default.searchProduct);
router.post('/add-product', isAuth_1.default.isAuth, multer_1.default.uploadFiles, userProductController_1.default.addProduct);
router.get('/single-product/:id', isAuth_1.default.isBlocked, userProductController_1.default.getsingleProduct);
router.get('/edit-product/:id', isAuth_1.default.isAuth, userProductController_1.default.getEditProduct);
router.get('/posted-products', isAuth_1.default.isAuth, userProductController_1.default.getPostedProducts);
router.post('/delete-image', isAuth_1.default.isAuth, userProductController_1.default.deleteimage);
router.post('/upload-new-images', isAuth_1.default.isAuth, multer_1.default.uploadFiles, userProductController_1.default.uploadimages);
router.post('/update-product', isAuth_1.default.isAuth, userProductController_1.default.updateProduct);
router.post('/mark-sold', isAuth_1.default.isAuth, userProductController_1.default.markSold);
exports.default = router;
//# sourceMappingURL=userProductRoutes.js.map