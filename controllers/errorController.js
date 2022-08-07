module.exports = errorFunction = async (req, res) => {
  try {
    res.render("errorpage");
  } catch (error) {
    console.log(error);
  }
};
