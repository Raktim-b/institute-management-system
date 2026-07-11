const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const examSchema = new Schema(
  {
    batchId: {
      type: Schema.Types.ObjectId,
      ref: "batch",
      required: true,
    },
    examName: {
      type: String,
      required: true,
    },
    examDate: {
      type: Date,
      required: true,
    },
    duration: {
      type: Number, // minutes
      required: true,
    },
    totalMarks: {
      type: Number,
      required: true,
    },
    marks: [
      {
        studentId: {
          type: Schema.Types.ObjectId,
          ref: "user",
          required: true,
        },
        obtainedMarks: {
          type: Number,
          required: true,
        },
      },
    ],
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);
const examModel = mongoose.model("exam", examSchema);
module.exports = examModel;
