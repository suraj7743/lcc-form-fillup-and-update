const mongoose = require("mongoose");
const studentSchema = mongoose.Schema({
  pid: Number,
  studentName: {
    type: String,
    required: [true, "include student name"],
    trim: true,
    uppercase: true,
  },
  imageemoji: {
    type: String,
    required: true,
  },
  studentFrom: {
    type: String,
    requied: [true, "Please student location "],
    trim: true,
    uppercase: true,
  },
  studentCharacter: {
    type: String,
    required: [true, "please input character of student"],
    trim: true,
    uppercase: true,
  },
  studentHeight: {
    type: String,
    required: [true, "please input height "],
  },
  studentRollno: {
    type: Number,
    required: [true, "Please input roll no "],
  },
  studentGrade: {
    type: String,
    required: [true, "Please input student grade "],
    uppercase: true,
  },
  studentDescription: {
    type: String,
    required: [true, "Please input Description "],
    trim: true,
  },
  studentimage: {
    type: String,
    required: [true, "Please input image "],
  },
  studentClass: {
    type: String,
    required: [true, "Please input studentClass "],
  },
});

module.exports = studentModel = mongoose.model("studentDetail", studentSchema);
