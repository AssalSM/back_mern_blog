const asyncHandler = require("express-async-handler");
const { User, validateUpdateUser } = require("../models/User");
const bcrypt = require("bcryptjs");
const path = require("path");
const fs = require("fs")
const {
  cloudinaryUploadImage,
  cloudinaryRomveImage,
  cloudinaryRomveMultipleImage,
} = require("../utils/cloudinary");
const {
  Comment,
} = require("../models/Comment");
const {
  Post,
} = require("../models/Post");



/** --------------------------------------------------
 *   @desc   get all users profile
 *   @route /api/auth/profile
 *   @method get
 *   @access private (only admin)
 
  --------------------------------------------------  **/

module.exports.getAllUsersCtrl = asyncHandler(async (req, res) => {
  const users = await User.find().select("-password");
  res.status(200).json({ users });
});

/** --------------------------------------------------
 *   @desc   get  user profile
 *   @route /api/auth/profile/:id
 *   @method get
 *   @access public 
 
  --------------------------------------------------  **/

module.exports.getUserProfileCtrl = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password").populate("posts");
  if (!user) {
    return res.status(404).json({ message: "user not fond" });
  }
  res.status(200).json(user );
});

/** --------------------------------------------------
 *   @desc  Update user profile
 *   @route /api/auth/profile/id
 *   @method put
 *   @access private (only user himself)
 
  --------------------------------------------------  **/

module.exports.updateUserProfileCtrl = asyncHandler(async (req, res) => {
  const { error } = validateUpdateUser(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  if (req.body.password) {
    const salt = await bcrypt.genSalt(10);
    req.body.password = await bcrypt.hash(req.body.password, salt);
  }
  const updateUser = await User.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        username: req.body.username,
        password: req.body.password,
        bio: req.body.bio,
      },
    },
    {
      new: true,
    }
  ).select("-password");

  res.status(200).json(updateUser);
});

/** --------------------------------------------------
 *   @desc   get users count
 *   @route /api/auth/count
 *   @method GET
 *   @access private (only admin)
 
  --------------------------------------------------  **/
// MAKHDMAAAATCH DIK COUNT
module.exports.getUsersCountCtrl = asyncHandler(async (req, res) => {
  const count = await User.count();
  res.status(200).json(count);
});

/** --------------------------------------------------
 *   @desc   profile photo Upload
 *   @route /api/auth/profile/prfile-photo-upload
 *   @method POST
 *   @access private (only LOGGED IN USER)
 
  --------------------------------------------------  **/

module.exports.profilePhotoUploadCtrl = asyncHandler(async (req, res) => {
  // 1.validation
  if (!req.file) {
    return res.status(400).json({ message: "no file provided " });
  }
  // 2. get the path to the image
  const imagePath = path.join(__dirname, `../images/${req.file.filename}`);

  // 3. upload to cloudinary
  const result = await cloudinaryUploadImage(imagePath);
  console.log(result);
  // 4. get the user from db
  const user = await User.findById(req.user.id);
  // 5. dele the old profile phot if  exist
  if (user.profilePhoto.publicId !== null) {
    await cloudinaryRomveImage(user.profilePhoto.publicId);
  }

  // 6. change the profilephoto field in the db
  user.profilePhoto = {
    url: result.secure_url,
    publicId: result.public_id,
  };
  await user.save();
  // 7. send response to client
  res
    .status(200)
    .json({
      message: "ur profil uploaded",
      profilePhoto: { url: result.secure_url, publicId: result.public_id },
    });

  // 8. remove image from the server
  fs.unlinkSync(imagePath)

});


/** --------------------------------------------------
 *   @desc  delete user profile (account)
 *   @route /api/auth/profile/:id
 *   @method DELETE
 *   @access private (only admine or user himself)
 
  --------------------------------------------------  **/


  module.exports.deleteUserProfileCtrl = asyncHandler(async(req,res) => {
   // 1. get the user from db 
   const user = await User.findById(req.params.id)
   if (!user){
    return res.status(404).json({message :" user not found"})

   }

   // 2. get all posts from db
    const posts = await Post.find({user: user._id})
   //  3. get the public ids from the posts 
   const publicIds = posts.map((post) => post.image.publicId)
   //  delet all posts image from cloudinary that belong to this usr
   if(publicIds.length > 0){
    await cloudinaryRomveMultipleImage(publicIds)
   }
   // 5. delete the profile picture from cloiudinaru 
   await cloudinaryRomveImage(user.profilePhoto.publicId)
   // 6. delete user posts and comments 
   await Comment.deleteMany({user : user_id})
   await Post.deleteMany({user : user_id})
   // 7. delete  the user fimself 
   await User.findByIdAndDelete(req.params.id)
   // 8. send a response to the client 
res.status(200).json({message:"ur profile is delete"})


  })
