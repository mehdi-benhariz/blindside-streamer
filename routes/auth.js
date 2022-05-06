const router = require("express").Router();
const authController = require("../controllers/auth");
const { checkAuth } = require("../middleware/auth");
router.post("/login", authController.login);
router.post("/register", authController.register);
router.post("/logout", checkAuth, authController.logout);

module.exports = router;
