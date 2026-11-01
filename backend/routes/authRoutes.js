const router=require('express').Router();
const bcrypt=require('bcryptjs');
const User=require('../models/User');
const v=require('../lib/validation');
const {session,publicUser}=require('../lib/session');
const auth=require('../middleware/authMiddleware');
router.post('/login',async(req,res)=>{
 const email=v.email(req.body.email);
 if(typeof req.body.password!=='string' || Buffer.byteLength(req.body.password)>72) v.fail('Invalid email or password',401);
 const user=await User.findOne({email}).select('+password');
 const valid=user?.password && await bcrypt.compare(req.body.password,user.password);
 if(!valid) v.fail('Invalid email or password',401);
 res.json(session(user));
});
router.post('/google',async(req,res)=>{
 const token=v.text(req.body.idToken,'Google ID token',10000);
 if(!process.env.FIREBASE_PROJECT_ID) v.fail('Google sign-in is not configured',503);
 let identity;
 try {
  const {jwtVerify,createRemoteJWKSet}=await import('jose');
  router.googleKeys ||= createRemoteJWKSet(new URL('https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com'));
  const {payload}=await jwtVerify(token,router.googleKeys,{algorithms:['RS256'],issuer:`https://securetoken.google.com/${process.env.FIREBASE_PROJECT_ID}`,audience:process.env.FIREBASE_PROJECT_ID});
  if(!payload.sub || typeof payload.sub!=='string' || payload.sub.length>128 || typeof payload.auth_time!=='number' || payload.auth_time>Date.now()/1000) throw new Error('Invalid subject');
  identity={...payload,uid:payload.sub};
 } catch { v.fail('Google identity could not be verified',401); }
 if(!identity.email_verified || identity.firebase?.sign_in_provider!=='google.com') v.fail('A verified Google account is required',401);
 const email=v.email(identity.email);
 let user=await User.findOne({email});
 // Never implicitly link an existing local/admin account using a different provider.
 if(user && (user.provider!=='google' || (user.googleUid && user.googleUid!==identity.uid))) v.fail('Please use your original sign-in method',409);
 if(!user) { const [firstName,...rest]=(identity.name || 'Guest').split(' '); user=await User.create({firstName,lastName:rest.join(' '),email,provider:'google',googleUid:identity.uid,role:'user'}); }
 res.json(session(user));
});
router.get('/me',auth,(req,res)=>res.json({user:publicUser(req.account)}));
router.post('/logout',auth,async(req,res)=>{ await User.updateOne({_id:req.user.id},{$inc:{tokenVersion:1}});res.json({success:true}); });
module.exports=router;
