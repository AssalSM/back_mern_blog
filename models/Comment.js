const mongoose = require("mongoose");
const joi = require("joi");
const jwt = require("jsonwebtoken");




// user shema

const CommentSchema = new mongoose.Schema(
    {
      text: {
        type: String,
        require: true,
        
      },
    
      postId: {
        type: mongoose.Schema.Types.ObjectId,
        require: true,
        ref: "Post",
      },
  
      user: {
        type: mongoose.Schema.Types.ObjectId,
        require: true,
        ref: "User",
      },
      username: {
        type: String,
        require: true,
      },
    },
    {
      timestamps: true,
    }
  );
  
  
  
  // comment model 
  
  const Comment = mongoose.model("Comment", CommentSchema);


// validate create comment
function validateCreateComment(obj){
    const schema = joi.object({
        postId : joi.string().required().label("post ID"),
        text : joi.string().trim().required().label("text"),
    })
    return schema.validate(obj)
}
// validate update comment
function validateUpdateComment(obj){
    const schema = joi.object({
        text : joi.string().trim().required(),
    })
    return schema.validate(obj)
}


module.exports = {
    Comment,
    validateCreateComment,
    validateUpdateComment
}