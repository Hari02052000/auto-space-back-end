"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const productController_1 = __importDefault(require("../controllers/admin/productController"));
const auth_1 = __importDefault(require("../helpers/adminhelpers/auth"));
const router = (0, express_1.Router)();
router.get('/get-product', auth_1.default.isAdmin, productController_1.default.getProducts);
router.put('/list-product', auth_1.default.isAdmin, productController_1.default.listProduct);
router.put('/unlist-product', auth_1.default.isAdmin, productController_1.default.unlistProduct);
exports.default = router;
//# sourceMappingURL=adminProductRoutes.js.map