"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const brandController_1 = __importDefault(require("../controllers/admin/brandController"));
const auth_1 = __importDefault(require("../helpers/adminhelpers/auth"));
const router = (0, express_1.Router)();
router.get('/get-brands', auth_1.default.isAdmin, brandController_1.default.getBrands);
router.post('/add-brand', auth_1.default.isAdmin, brandController_1.default.createBrand);
router.post('/edit-brand', auth_1.default.isAdmin, brandController_1.default.editBrand);
router.post('/edit-model', auth_1.default.isAdmin, brandController_1.default.editmodel);
router.post('/edit-option', auth_1.default.isAdmin, brandController_1.default.editoption);
router.post('/add-model', auth_1.default.isAdmin, brandController_1.default.addModel);
router.post('/add-option', auth_1.default.isAdmin, brandController_1.default.addOption);
exports.default = router;
//# sourceMappingURL=adminBrandRoutes.js.map