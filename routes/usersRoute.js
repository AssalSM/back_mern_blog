const router = require("express").Router();
const {
  getAllUsersCtrl,
  getUserProfileCtrl,
  updateUserProfileCtrl,
  getUsersCountCtrl,
  profilePhotoUploadCtrl,
  deleteUserProfileCtrl,
} = require("../controllers/usersControllers");
const {
  verifyTokenAndAdmin,
  verifyTokenAndOnlyUser,
  verifyToken,
  verifyTokenAndAuthorization,
} = require("../middlewares/verifyToken");
const validateObjectid = require("../middlewares/validateObjectid");
const photoUpload = require("../middlewares/photoUpload");

// /api/users/profile
router.route("/profile").get(verifyTokenAndAdmin, getAllUsersCtrl);

// /api/users/profile/:id
router
  .route("/profile/:id")
  .get(validateObjectid, getUserProfileCtrl)
  .put(validateObjectid, verifyTokenAndOnlyUser, updateUserProfileCtrl)
  .delete(validateObjectid,verifyTokenAndAuthorization,deleteUserProfileCtrl);

// /api/users/count
// router.route("/count").get(verifyTokenAndAdmin,getUsersCountCtrl)

// /api/users/profile/prfile-photo-upload
router
  .route("/profile/prfile-photo-upload")
  .post(verifyToken, photoUpload.single("image"), profilePhotoUploadCtrl);

module.exports = router;
