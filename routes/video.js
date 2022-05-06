const router = require("express").Router();
const videoController = require("../controllers/video");

app.post("/upload", videoController.upload);

module.exports = router;
