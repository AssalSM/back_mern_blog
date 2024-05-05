const router = require("express").Router();
const {
  createPostCtrl,
  getAllPostsCtrl,
  getsinglePostCtrl,
  getPostCountCtrl,
  deletePostCtrl,
  updatePostCtrl,
  updateImagePostCtrl,
  toggleLikectrl,
} = require("../controllers/postController");
const photoUpload = require("../middlewares/photoUpload");
const { verifyToken } = require("../middlewares/verifyToken");
const validateObjectId = require("../middlewares/validateObjectid");
// /api/posts
router
  .route("/")
  .post(verifyToken, photoUpload.single("image"), createPostCtrl)
  .get(getAllPostsCtrl);

// /api/post/count
router.route("/count").get(getPostCountCtrl);
// /api/post/:id
router
  .route("/:id")
  .get(validateObjectId, getsinglePostCtrl)
  .delete(validateObjectId, verifyToken, deletePostCtrl)
  .put(validateObjectId, verifyToken, updatePostCtrl);
// /api/post/update-image/:id
router
  .route("/update-image/:id")
  .put(
    validateObjectId,
    verifyToken,
    photoUpload.single("image"),
    updateImagePostCtrl
  );


  // /api/post/like/:id
  router
  .route("/like/:id")
  .put(
    validateObjectId,
    verifyToken,
    toggleLikectrl
  );
module.exports = router;
