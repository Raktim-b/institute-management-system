const mongoose = require("mongoose");
const logger = require("../utils/logger");
const DbCon = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    logger.info("Database Connected");
  } catch (error) {
    logger.error(error);
  }
};

module.exports = DbCon;
