const jwt=require('jsonwebtoken');
function publicUser(user) { return {id:user._id,firstName:user.firstName,lastName:user.lastName,email:user.email,country:user.country,role:user.role,provider:user.provider}; }
function session(user) { return {token:jwt.sign({id:user._id,role:user.role,version:user.tokenVersion ?? 0},process.env.JWT_SECRET,{algorithm:'HS256',expiresIn:process.env.JWT_EXPIRE || '2h'}),user:publicUser(user)}; }
module.exports={publicUser,session};
