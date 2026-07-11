const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const CourseSchema = new Schema(
  {
    courseName: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    duration: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      default:
        "https://www.google.com/imgres?q=course%20image&imgurl=https%3A%2F%2Fimg.magnific.com%2Ffree-photo%2Flearning-education-ideas-insight-intelligence-study-concept_53876-120116.jpg%3Fsemt%3Dais_hybrid%26w%3D740%26q%3D80&imgrefurl=https%3A%2F%2Fwww.magnific.com%2Ffree-photos-vectors%2Fcourse&docid=fwHLWFxVF8X-yM&tbnid=RjjahFzjge9AsM&vet=12ahUKEwjN4vqq_LqVAxU7-DgGHQ39NvoQnPAOegQIOhAA..i&w=740&h=370&hcb=2&ved=2ahUKEwjN4vqq_LqVAxU7-DgGHQ39NvoQnPAOegQIOhAA",
    },
    public_id: {
      type: String,
    },
    fees: {
      type: Number,
      required: true,
      min: 0,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true, versionKey: false },
);
const courseModel = mongoose.model("course", CourseSchema);
module.exports = courseModel;
