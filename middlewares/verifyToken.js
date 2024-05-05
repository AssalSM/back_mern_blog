const jwt = require("jsonwebtoken");

// Verify token
function verifyToken(req,res,next) {
  const authToken = req.headers.authorization;
  if (authToken) {
    const token = authToken.split(" ")[1];
    try {
      const decoderPayload = jwt.verify(token,process.env.JWT_SECRTKEY);
      req.user = decoderPayload;
      next() ;
    } catch (error) {
      return res.status(401).json({ message: "invalid" });
    }
  } else {
    return res.status(401).json({ message: "invalide token" });
  }
}

// verify token & admin 
function verifyTokenAndAdmin(req,res,next){
    verifyToken(req,res, ()=>{
        if(req.user.isAdmin){
            next()
        }else{
            return res.status(403).json({message:"not allowed , only admin"})
        }
    })
}


// verify token & Only user
function verifyTokenAndOnlyUser(req,res,next){
  verifyToken(req,res, ()=>{
      if(req.user.id === req.params.id ){
          next()
      }else{
          return res.status(403).json({message:"not allowed , only user himself"})
      }
  })
}

// verify token & authorization 
function verifyTokenAndAuthorization(req,res,next){
  verifyToken(req,res, ()=>{
      if(req.user.id === req.params.id || req.params.isAdmin ){
          next()
      }else{
          return res.status(403).json({message:"not allowed , only user himself or admin"})
      }
  })
}


module.exports = {
    verifyToken,
    verifyTokenAndAdmin,
    verifyTokenAndOnlyUser,
    verifyTokenAndAuthorization
}