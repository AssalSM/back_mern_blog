const {
  createCommentCtrl,
  getAlllCommentCtrl,
  deleteCommentCtrl,
  updateCommentCtrl,
} = require("../controllers/Commentcontroll");
const validateObjectid = require("../middlewares/validateObjectid");
const {
  verifyToken,
  verifyTokenAndAdmin,
} = require("../middlewares/verifyToken");
const router = require("express").Router();

//    / api/comment
router
  .route("/")
  .post(verifyToken, createCommentCtrl)
  .get(verifyTokenAndAdmin, getAlllCommentCtrl);
//    /api/comment/:id
router
  .route("/:id")
  .delete(validateObjectid, verifyToken, deleteCommentCtrl)
  .put(validateObjectid, verifyToken, updateCommentCtrl);
module.exports = router;
