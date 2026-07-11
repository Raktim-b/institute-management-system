const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const attendanceSchema = new Schema(
  {
    batchId: {
      type: Schema.Types.ObjectId,
      ref: "batch",
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    attendance: [
      {
        studentId: {
          type: Schema.Types.ObjectId,
          ref: "user",
          required: true,
        },
        status: {
          type: String,
          enum: ["present", "absent"],
          required: true,
        },
      },
    ],
    markedBy: {
      type: Schema.Types.ObjectId,
      ref: "user", // teacher
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

attendanceSchema.index({ batchId: 1, date: 1 }, { unique: true });

const attendanceModel = mongoose.model("attendance", attendanceSchema);
module.exports = attendanceModel;
