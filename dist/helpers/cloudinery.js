"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cloudinary_1 = require("cloudinary");
const cloudinary = cloudinary_1.v2;
cloudinary.config({
    cloud_name: process.env.cloud_name,
    api_key: process.env.api_key,
    api_secret: process.env.api_secret
});
async function multiFiles(imageFiles) {
    const images = [];
    await Promise.all(imageFiles.map(async (image) => {
        await cloudinary.uploader.upload(image.path, (err, url) => {
            if (url) {
                images.push({ URL: url.secure_url, cloudinary_id: url.public_id });
            }
            else {
                console.log(err);
            }
        });
    }));
    return images;
}
exports.default = { multiFiles };
//# sourceMappingURL=cloudinery.js.map