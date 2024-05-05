const asyncHandler = require("express-async-handler");
const fs = require("fs");
const path = require("path");
const {
  Post,
  validateUpdatePost,
  validateCreatePost,
} = require("../models/Post");
const {
  cloudinaryUploadImage,
  cloudinaryRomveImage,
} = require("../utils/cloudinary");
const { Comment } = require("../models/Comment");

/** --------------------------------------------------
 *   @desc  create new post
 *   @route /api/post
 *   @method post
 *   @access private (only logged user)
 
  --------------------------------------------------  **/

module.exports.createPostCtrl = asyncHandler(async (req, res) => {
  // 1. validation for image
  if (!req.file) {
    return res.status(400).json({ message: "no image provider" });
  }
  // 2. validation for data
  const { error } = validateCreatePost(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  // 3. upload photo
  const imagePath = path.join(__dirname, `../images/${req.file.filename}`);

  // 3. upload to cloudinary
  const result = await cloudinaryUploadImage(imagePath);

  // 4. create new post and save it db
  /*const post = new Post({
    title: req.body.title,
    category: req.body.category,
    description: req.body.description,
  });
  await post.save()
  */

  const post = await Post.create({
    title: req.body.title,
    category: req.body.category,
    description: req.body.description,
    user: req.user.id,
    image: {
      url: result.secure_url,
      publicId: result.public_id,
    },
  });
  // 5. send  response to the clien
  res.status(201).json({ post });
  // 6. remove image from the server
  fs.unlinkSync(imagePath);
});

/** --------------------------------------------------
 *   @desc  get all post
 *   @route /api/posts
 *   @method GET
 *   @access public
 * 
 * 
 * .skip((pageNumber - 1) * POST_PER_PAGE)
      .limit(POST_PER_PAGE)
 
  --------------------------------------------------  **/

module.exports.getAllPostsCtrl = asyncHandler(async (req, res) => {
  const POST_PER_PAGE = 3;
  const { pageNumber, category } = req.query;
  let posts;
  if (pageNumber) {
    posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate("user", ["-password"]);
  } else if (category) {
    posts = await Post.find({ category })
      .sort({ createdAt: -1 })
      .populate("user", ["-password"]);
  } else {
    posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate("user", ["-password"]);
  }
  res.status(200).json(posts);
});

/** --------------------------------------------------
 *   @desc  get SINGLE post
 *   @route /api/posts
 *   @method get
 *   @access public
 
  --------------------------------------------------  **/

module.exports.getsinglePostCtrl = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id)
    .populate("user", ["-password"])
    .populate("comments");
  if (!post) {
    return res.status(404).json({ message: "post not fund" });
  }

  res.status(200).json(post);
});

/** --------------------------------------------------
 *   @desc  get posts count
 *   @route /api/posts/count
 *   @method get
 *   @access public
 
  --------------------------------------------------  **/

module.exports.getPostCountCtrl = asyncHandler(async (req, res) => {
  const count = await Post.count();

  res.status(200).json(count);
});

/** --------------------------------------------------
 *   @desc  update post
 *   @route /api/posts/:id
 *   @method put
 *   @access only owner of the post
 
  --------------------------------------------------  **/

module.exports.updatePostCtrl = asyncHandler(async (req, res) => {
  const { error } = validateUpdatePost(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  // get the post
  const post = await Post.findById(req.params.id);
  if (!post) {
    return res.status(400).json({ message: "post not fund" });
  }

  if (req.user.id !== post.user.toString()) {
    res.status(403).json({ message: "acc ur not allow" });
  }
  // 4 update post
  const updatePost = await Post.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        title: req.body.title,
        description: req.body.description,
        category: req.body.category,
      },
    },
    { new: true }
  ).populate("user", ["-password"]);
  // send client
  res.status(200).json(updatePost);
});

/** --------------------------------------------------
 *   @desc  delete post
 *   @route /api/posts/:id
 *   @method delete
 *   @access 
 
  --------------------------------------------------  **/

module.exports.deletePostCtrl = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) {
    return res.status(404).json({ message: "post not fund" });
  }

  if (req.user.isAdmin || req.user.id === post.user.toString()) {
    await Post.findByIdAndDelete(req.params.id);
    await cloudinaryRomveImage(post.image.publicId);
    await Comment.deleteMany({ postId: post._id });

    res.status(200).json({ message: "post is delete", postId: post._id });
  } else {
    res.status(403).json({ message: "access denied, forbd" });
  }
});

/** --------------------------------------------------
 *   @desc  update image the post
 *   @route /api/posts/:id
*   @method put
*   @access only owner of the post

 --------------------------------------------------  **/

module.exports.updateImagePostCtrl = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "image  not fund" });
  }
  // get the post
  const post = await Post.findById(req.params.id);
  if (!post) {
    return res.status(400).json({ message: "post not fund" });
  }
  // check user
  if (req.user.id !== post.user.toString()) {
    res.status(403).json({ message: "acc ur not allow" });
  }
  // 4 update post
  await cloudinaryRomveImage(post.image.publicId);

  // UPLOAD NEW PHOTO
  const imagePath = path.join(__dirname, `../images/${req.file.filename}`);
  const result = await cloudinaryUploadImage(imagePath);

  const updatePost = await Post.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        image: {
          url: result.secure_url,
          publicId: result.public_id,
        },
      },
    },
    { new: true }
  );
  // send client
  res.status(200).json(updatePost);
  // remove image from the server
  fs.unlinkSync(imagePath);
});

/** --------------------------------------------------
 *   @desc  toggle like
 *   @route /api/posts/like/:id
*   @method put
*   @access only logged in user

 --------------------------------------------------  **/

module.exports.toggleLikectrl = asyncHandler(async (req, res) => {
  const loggedinuser = req.user.id;
  const { id: postId } = req.params;

  let post = await Post.findById(postId);
  if (!post) {
    return res.status(400).json({ messsge: "post not fund" });
  }

  const ispostreadyliked = post.likes.find(
    (user) => user.toString() === loggedinuser
  );
  if (ispostreadyliked) {
    post = await Post.findByIdAndUpdate(
      postId,
      {
        $pull: { likes: loggedinuser },
      },
      { new: true }
    );
  } else {
    post = await Post.findByIdAndUpdate(
      postId,
      {
        $push: { likes: loggedinuser },
      },
      { new: true }
    );
  }
  res.status(200).json(post);
});
