const User = require("../models/User");
const { checkLoginData, checkRegisterData } = require("../utils/auth");

exports.register = async (req, res) => {
  try {
    const errors = await checkRegisterData(req);
    if (errors)
      return res.status(400).json({
        errors: errors,
      });
    const { username, email, password } = req.body;
    const user = await User.create({
      username,
      email,
      password,
    });
    const token = user.getSignedJwtToken();
    const options = {
      expires: new Date(
        Date.now() + process.env.JWT_EXPIRE * 24 * 60 * 60 * 1000
      ),
      httpOnly: true,
    };
    // in production, we want to set secure: true.
    if (process.env.NODE_ENV === "production") options.secure = true;
    res.status(200).cookie("token", token, options).json({
      success: true,
      token,
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.login = async (req, res) => {
  const errors = await checkLoginData(req);
  if (errors)
    return res.status(400).json({
      errors,
    });

  const { email, password } = req.body;
  try {
    const user = await User.findOne({
      email,
      isRestricted: false,
    });
    const isMatch = await user.matchPassword(password);

    if (!isMatch)
      return res.status(401).send({
        message: "Wrong password",
      });
    const token = user.getSignedJwtToken();
    const options = {
      expires: new Date(
        Date.now() + process.env.JWT_COOKIE_EXPIRE * 60 * 60 * 1000
      ),
      httpOnly: true,
    };
    // in production, we want to set secure: true.
    if (process.env.NODE_ENV === "production") options.secure = true;

    res.status(200).cookie("token", token, options).json({
      success: true,
      token,
      user,
    });
  } catch (e) {
    res.status(500).send(e.message);
  }
};

exports.logout = async (req, res) => {
  try {
    res.status(200).clearCookie("token").json({
      message: "Logout successful",
      success: true,
    });
  } catch (e) {
    res.status(500).send(e.message);
  }
};
