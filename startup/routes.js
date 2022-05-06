const videoRoute = require("../routes/video");
const authRoute = require("../routes/auth");
module.exports = (app) => {
  app.use("/api/v1/videos", videoRoute);
  app.use("/api/v1/auth", authRoute);
};
