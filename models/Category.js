const mongoose = require("mongoose");
const joi = require("joi");

// ucategory shema

const CategorySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      require: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      require: true,
      ref: "User",
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// comment model

const Category = mongoose.model("Category", CategorySchema);


// validate create Category
function validateCreateCategory(obj){
    const schema = joi.object({
      
        title : joi.string().trim().required().label("title"),
    })
    return schema.validate(obj)
}



module.exports = {
    Category,
    validateCreateCategory,
 
}