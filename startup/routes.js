const videoRoute = require("../routes/video");

module.exports = (app) => {
  app.use("/api/v1/videos", videoRoute);
};
