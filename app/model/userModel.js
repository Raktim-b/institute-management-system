const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },
    roleId: {
      type: Schema.ObjectId,
      ref: "role",
      required: true,
    },
    image: {
      type: String,
      default:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTfAaOG5FIFm-Adry205zQs6kZZGqLoiVRMxEPugqgvyQ&s=10",
    },
    password: {
      type: String,
      required: true,
    },
    refreshToken: {
      type: String,
      default: null,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true, versionKey: false },
);
const userModel = mongoose.model("user", UserSchema);
module.exports = userModel;
