const express = require("express");
const {
  registerController,
  loginController,
  logoutController,
} = require("../controller/auth.controller");
const router = express.Router();

router.get("/reset-password/:token", resetPasswordController);

router.post("/register", registerController);
router.post("/login", loginController);
router.post("/logout", logoutController);
// router.post("/forget-password", forgetPasswordController);
// router.post("/update-password/:userId", updatePasswordController);

module.exports = router;
