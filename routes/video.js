const router = require("express").Router();
const videoController = require("../controllers/video");
const { checkAuth } = require("../middleware/auth");

router.post("/upload", checkAuth, videoController.upload);
router.get("/getVideo", checkAuth, videoController.getVideo);
module.exports = router;
