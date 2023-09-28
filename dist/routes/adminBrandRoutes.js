"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const brandController_1 = __importDefault(require("../controllers/admin/brandController"));
const router = (0, express_1.Router)();
router.get('/get-brands', brandController_1.default.getBrands);
router.post('/add-brand', brandController_1.default.createBrand);
router.post('/edit-brand', brandController_1.default.editBrand);
router.post('/add-model', brandController_1.default.addModel);
router.post('/add-option', brandController_1.default.addOption);
exports.default = router;
//# sourceMappingURL=adminBrandRoutes.js.map