const jwt=require('jsonwebtoken');
const User=require('../models/User');
module.exports=async(req,res,next)=>{
 try {
  const match=/^Bearer ([^ ]+)$/.exec(req.headers.authorization || '');
  if(!match) return res.status(401).json({error:'Sign in to continue'});
  const decoded=jwt.verify(match[1],process.env.JWT_SECRET,{algorithms:['HS256']});
  const user=await User.findById(decoded.id).select('-password');
  if(!user || (decoded.version ?? 0)!==(user.tokenVersion ?? 0)) return res.status(401).json({error:'Session expired'});
  req.user={id:user._id.toString(),email:user.email,role:user.role}; req.account=user; next();
 } catch(error) { if(error.name==='JsonWebTokenError' || error.name==='TokenExpiredError' || error.name==='CastError') return res.status(401).json({error:'Invalid or expired session'}); next(error); }
};
