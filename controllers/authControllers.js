const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const {
  User,
  validateRegisterUser,
  validateLoginrUser,
} = require("../models/User");

/** --------------------------------------------------
 *   @desc sing up
 *   @route /api/auth/register
 *   @method POST
 *   @access public
 
  --------------------------------------------------  **/

module.exports.registerUserCtrl = asyncHandler(async (req, res) => {
  // validation
  const { error } = validateRegisterUser(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  // is user already
  let user = await User.findOne({ email: req.body.email });
  if (user) {
    return res.status(400).json({ message: " user already exist" });
  }

  // hash the password
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(req.body.password, salt);

  // new  user save it to Db
  user = new User({
    username: req.body.username,
    email: req.body.email,
    password: hashPassword,
  });
  await user.save();

  // send a response to client
  res
    .status(201)
    .json({ message: "you registered successfully, pleas log in" });
});

/** --------------------------------------------------
 *   @desc login user
 *   @route /api/auth/res\login
 *   @method POST
 *   @access public
 
  --------------------------------------------------  **/

module.exports.loginrUserCtrl = asyncHandler(async (req, res) => {
  // 1. validation
  const { error } = validateLoginrUser(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  // 2. is user exist
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status(400).json({ message: "invalid email or password" });
  }
  // 3. check the password
  const isPpasswordMatch = await bcrypt.compare(
    req.body.password,
    user.password
  );
  if (!isPpasswordMatch) {
    return res.status(400).json({ message: "invalid email or password" });
  }
  // 3. generate token (jwt)
  const token = user.generateAuthToken();

  // 5. send a response to client
  res
    .status(200)
    .json({
      _id: user._id,
      username : user.username,
      isAdmin: user.isAdmin,
      profilePhoto: user.profilePhoto,
      token,
    });
});
