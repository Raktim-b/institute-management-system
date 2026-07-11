const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BatchSchema = new Schema(
  {
    batchName: {
      type: String,
      required: true,
      trim: true,
    },
    courseId: {
      type: Schema.Types.ObjectId,
      ref: "course",
      required: true,
    },
    teacherId: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    students: [
      {
        type: Schema.Types.ObjectId,
        ref: "user",
      },
    ],
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);
const batchModel = mongoose.model("batch", BatchSchema);
module.exports = batchModel;
