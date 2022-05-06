const jwt = require("jsonwebtoken");
const User = require("../models/User");
const safeCompare = require("safe-compare");

const checkLoginData = async (req) => {
  const { email, password } = req.body;
  if (!email || !password) return "Email and password must be filled";
  if (
    !email.match(
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
    )
  )
    return "Email is not valid";

  return null;
};

const checkRegisterData = async (req) => {
  const { username, password, confirmPassword } = req.body;
  //check if username is secure
  if (!username.match(/^[a-zA-Z0-9]+$/)) return "Username must be alphanumeric";
  //check if password is secure
  //! for production, use a regex to check for password strength
  // if(!password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/))
  //     stack.push("Password must be at least 8 characters, contain at least one lowercase letter, one uppercase letter, one number and one special character");
  if (!password || !confirmPassword)
    return "Password and confirm password must be filled";
  if (!safeCompare(password, confirmPassword))
    return "Password and confirm password must match";
  if (checkLoginData(req) != null) return checkLoginData(req);
  const testUserMail = await User.findOne({ where: { email } });
  if (testUserMail) return "Email already exists";
  return null;
};

getUserByToken = async (token) => {
  if (!token) return null;
  const decode = await jwt.verify(token, process.env.JWT_SECRET);
  const user = await User.findById(decode.id);
  return user;
};

module.exports = {
  checkLoginData,
  checkRegisterData,
  getUserByToken,
};
