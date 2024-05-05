const router = require("express").Router();
const {registerUserCtrl,loginrUserCtrl}= require("../controllers/authControllers")


//    / api/auth/register
router.post("/register", registerUserCtrl);
//    / api/auth/login
router.post("/login", loginrUserCtrl);

module.exports = router;