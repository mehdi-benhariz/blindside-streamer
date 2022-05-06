const router = require("express").Router();
const videoController = require("../controllers/video");

router.post("/upload", videoController.upload);
router.get("/getVideo", videoController.getVideo);
module.exports = router;
