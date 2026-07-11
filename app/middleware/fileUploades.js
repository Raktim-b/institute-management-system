const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "instituteManagement",
    allowed_formats: ["jpg", "png", "jpeg", "gif", "webp"],
  },
});

const ProductImage = multer({ storage: storage });
module.exports = ProductImage;
