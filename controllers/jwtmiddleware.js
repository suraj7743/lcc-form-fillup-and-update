const jwt = require("jsonwebtoken");
module.exports = checkauth = async (req, res, next) => {
  const token = req.cookies.token;
  try {
    const user = jwt.verify(token, process.env.JWT_KEY);
    req.user = user;
    next();
  } catch (error) {
    res.render("errorpage");
  }
};
