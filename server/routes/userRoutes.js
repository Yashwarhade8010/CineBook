const {Router} = require("express");
const {
  handleRegister,
  handleLogin,
  handleForgetPassword,
  handleChangePassword,
} = require("../controllers/userControllers");

const router = Router();

router.post("/register", handleRegister);
router.post("/login", handleLogin);
router.post("/forget-password", handleForgetPassword);
router.post("/reset-passoword", handleChangePassword);

module.exports = router