const studentModel = require("../models/studentModel");
const studentMainPage = async (req, res) => {
  try {
    const details = await studentModel.find();
    if (details) {
      res.render("studentoverview", {
        studentInfo: details,
      });
    }
  } catch (error) {
    console.log(error.message);
  }
};
const postStudentDetails = async (req, res) => {
  try {
    const submitDetails = req.body.submitDetails;
    if (submitDetails) {
      res.redirect("/form");
    }
  } catch (error) {
    res.status(200).json({
      status: "failure",
    });
  }
};
const individualDetail = async (req, res) => {
  try {
    const modelData = await studentModel.find({
      _id: req.params.id,
    });
    if (modelData.length === 1) {
      res.render("student", {
        studentName: modelData[0].studentName,
        imageemoji: modelData[0].imageemoji,
        studentFrom: modelData[0].studentFrom,
        studentCharacter: modelData[0].studentCharacter,
        studentHeight: modelData[0].studentHeight,
        studentRollno: modelData[0].studentRollno,
        studentGrade: modelData[0].studentRollno,
        studentDescription: modelData[0].studentDescription,
        studentimage: modelData[0].studentimage,
        studentClass: modelData[0].studentCharacter,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({
      status: "failure",
      message: error,
    });
  }
};
module.exports = {
  studentMainPage,
  individualDetail,
  postStudentDetails,
};
