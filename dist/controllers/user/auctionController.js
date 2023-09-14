"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cloudinery_1 = __importDefault(require("../../helpers/cloudinery"));
const auctionSchema_1 = __importDefault(require("../../models/auctionSchema"));
async function addAuction(req, res) {
    let { brand, model, option, basePrice, year, fuel, kmDriven, location, no_of_owners } = JSON.parse(req.body.formFields);
    let images = await cloudinery_1.default.multiFiles(req.files);
    const userid = res.locals.userid;
    const date = new Date();
    const newAuction = await auctionSchema_1.default.create({ brand, model, option, basePrice, year, fuel, kmDriven, Location: location, no_of_owners, images, user: userid, date: date });
    if (newAuction) {
        res.json({ productAdded: true });
    }
}
exports.default = { addAuction };
//# sourceMappingURL=auctionController.js.map