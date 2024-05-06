const asyncHandler = require("express-async-handler");
const { Category, validateCreateCategory } = require("../models/Category");

const { User } = require("../models/User");



/** --------------------------------------------------
 *   @desc  create new comment
 *   @route /api/comment
 *   @method post
 *   @access private (only logged adimn)
 
  --------------------------------------------------  **/

  module.exports.createCategoryCtrl = asyncHandler(async (req, res) => {
    const { error } = validateCreateCategory(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
  
    const category = await Category.create({
        title: req.body.title,
        user: req.user.id,
     
    });
    res.status(201).json(category);
  });







  module.exports.createAllCategoryCtrl = asyncHandler(async (req, res) => {
   

    const categorys = await Category.find()
    res.status(200).json(categorys);
  });


  module.exports.deleteCategoryCtrl = asyncHandler(async (req, res) => {
   
  const category = await Category.findById(req.params.id)
  if(!category){
    return res.status(404).json({message:"not found"})
  }
  await Category.findByIdAndDelete(req.params.id)
  return res.status(200).json({message:"has been deleted", categoryId: category._id})  

});
