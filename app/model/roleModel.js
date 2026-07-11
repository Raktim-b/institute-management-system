const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const RoleSchema = new Schema({
  role: {
    type: String,
    enum: ["student", "admin", "teacher"],
    default: "user",
  },
});
const roleModel = mongoose.model("role", RoleSchema);
module.exports = roleModel;
