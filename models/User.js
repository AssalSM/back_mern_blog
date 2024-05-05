const mongoose = require("mongoose");
const joi = require("joi")
const jwt = require("jsonwebtoken")
// user shema

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      require: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },
    email: {
      type: String,
      require: true,
      trim: true,
      minlength: 5,
      maxlength: 100,
      unique: true,
    },

    password: {
      type: String,
      require: true,
      trim: true,
      minlength: 8,
    },

    profilePhoto: {
      type: Object,
      default: {
        url: "https://cdn.pixabay.com/photo/2016/09/28/02/14/user-1699635_640.png",
        publicId: null,
      },
    },
    bio: {
      type: String,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    isAcountVerified: {
      type: Boolean,
      default: false,
    },
  
  },  {
    timestamps: true,
    toJSON:{virtuals:true},
    toObject:{virtuals:true}
  },

);

// populate posts that belongs to this user when he get his profile

UserSchema.virtual("posts",{
  ref:"Post",
  foreignField: "user",
  localField:"_id",
})

// generate auth token
UserSchema.methods.generateAuthToken = function() {
return jwt.sign({id: this._id , isAdmin : this.isAdmin}, process.env.JWT_SECRTKEY )
}

// user model

const User =  mongoose.model("User" , UserSchema)



// validate Register user
function validateRegisterUser(obj) {
    const schema = joi.object({
      username: joi.string().trim().min(2).max(100).required(),
      email: joi.string().trim().min(5).max(100).required().email(),
      password: joi.string().trim().min(8).required(),

    })
    return schema.validate(obj)
}




// validate login user
function validateLoginrUser(obj) {
  const schema = joi.object({
    username: joi.string().trim().min(2).max(100),
    email: joi.string().trim().min(5).max(50).required().email(),
    password: joi.string().trim().min(8).required(),
  })
  return schema.validate(obj)
}


// validate update user
function validateUpdateUser(obj) {
  const schema = joi.object({
    username: joi.string().trim().min(2).max(100),
    email: joi.string().trim().min(2).max(50),
    password: joi.string().trim().min(8),
    bio : joi.string()
  })
  return schema.validate(obj)
}

module.exports = {
    User,
    validateRegisterUser,
    validateLoginrUser,
    validateUpdateUser,
}