const { getUserByToken } = require("../utils/auth");
exports.checkAuth = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  )
    // Set token from Bearer token in header(mobile app)
    token = req.headers.authorization.split(" ")[1];
  // Set token from cookie(web app)
  else if (req.cookies.token) token = req.cookies.token;

  const user = await getUserByToken(token);
  if (!user) {
    return res.status(401).json({
      message: "Access denied. You are not authorized to perform this action.",
    });
  }
  req.body = {
    ...req.body,
    user,
  };
  next();
};
