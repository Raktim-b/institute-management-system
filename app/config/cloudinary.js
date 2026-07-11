const logger = require("../utils/logger");

const cloudinary = require("cloudinary").v2;
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});
logger.info("CLOUD NAME:", process.env.CLOUD_NAME);
logger.info("API KEY:", process.env.API_KEY);

module.exports = cloudinary;
