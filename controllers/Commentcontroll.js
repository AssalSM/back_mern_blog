const asyncHandler = require("express-async-handler");
const {
  Comment,
  validateCreateComment,
  validateUpdateComment,
} = require("../models/Comment");

const { User } = require("../models/User");

/** --------------------------------------------------
 *   @desc  create new comment
 *   @route /api/comment
 *   @method post
 *   @access private (only logged user)
 
  --------------------------------------------------  **/

module.exports.createCommentCtrl = asyncHandler(async (req, res) => {
  const { error } = validateCreateComment(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const profile = await User.findById(req.user.id);

  const comment = await Comment.create({
    postId: req.body.postId,
    text: req.body.text,
    user: req.user.id,
    username: profile.username,
  });
  res.status(201).json(comment);
});

/** --------------------------------------------------
 *   @desc  get all com
 *   @route /api/post
 *   @method post
 *   @access private (only logged admin)
 
  --------------------------------------------------  **/
// api/comments
module.exports.getAlllCommentCtrl = asyncHandler(async (req, res) => {
  const comments = await Comment.find().populate("user");

  res.status(200).json(comments);
});



/** --------------------------------------------------
 *   @desc  delete com
 *   @route /api/post
 *   @method post
 *   @access private (only logged admin)
 
  --------------------------------------------------  **/
// api/comments
module.exports.deleteCommentCtrl = asyncHandler(async (req, res) => {
    const comment = await Comment.findById(req.params.id);
  if(!comment){
    return res.status(404).json({message:"comment not found"})
  }
  if (req.user.isAdmin || req.user.id  === comment.user.toString()) {
    await Comment.findByIdAndDelete(req.params.id);
    return res.status(200).json({message:"comment has been delete"})
  }else{
    return res.status(403).json({message:"acc delete, not allowed"})
  }
  });
  

  /** --------------------------------------------------
 *   @desc update com
 *   @route /api/post
 *   @method post
 *   @access private (only logged user)
 
  --------------------------------------------------  **/
// api/comments
module.exports.updateCommentCtrl = asyncHandler(async (req, res) => {
    const { error } = validateUpdateComment(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
  
   
    const comment = await Comment.findById(req.params.id);
  if(!comment){
    return res.status(404).json({message:"comment not found"})
  }
  if ( req.user.id  !== comment.user.toString()) {
    return res.status(403).json({message:"acc delete, not allowed"})
   
  }
  const updateComment = await Comment.findByIdAndUpdate(req.params.id,{
    $set: {
        text: req.body.text,
      },

  },{new:true});
  return res.status(200).json(updateComment)
  });