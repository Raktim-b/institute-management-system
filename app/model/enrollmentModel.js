const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const enrollmentSchema = new Schema(
  {
    studentId: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    courseId: {
      type: Schema.Types.ObjectId,
      ref: "course",
      required: true,
    },
    batchId: {
      type: Schema.Types.ObjectId,
      ref: "batch",
      default: null,
    },
    status: {
      type: String,
      enum: ["active", "completed", "cancelled"],
      default: "active",
    },
  },
  {
    timestamps: true,
  },
);

const enrollmentModel = mongoose.model("enrollment", enrollmentSchema);
module.exports = enrollmentModel;
