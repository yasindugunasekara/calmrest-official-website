const router=require('express').Router();
const bcrypt=require('bcryptjs');
const User=require('../models/User');
const auth=require('../middleware/authMiddleware');
const admin=require('../middleware/adminMiddleware');
const v=require('../lib/validation');
const {publicUser}=require('../lib/session');
async function register(req,res,role) {
 const data={firstName:v.text(req.body.firstName,'First name',80),lastName:v.text(req.body.lastName,'Last name',80),country:v.text(req.body.country,'Country',80),email:v.email(req.body.email),password:await bcrypt.hash(v.password(req.body.password),12),role,provider:'local'};
 if(await User.exists({email:data.email})) v.fail('Email already registered',409);
 const user=await User.create(data);res.status(201).json({message:'User registered successfully',user:publicUser(user)});
}
router.post('/',async(req,res)=>{ if(req.body.role && req.body.role!=='user') v.fail('Admin registration requires an administrator',403); await register(req,res,'user'); });
router.post('/admin',auth,admin,(req,res)=>register(req,res,'admin'));
router.get('/',auth,admin,async(req,res)=>res.json(await User.find().select('-password').sort({createdAt:-1}).lean()));
router.delete('/:id',auth,admin,async(req,res)=>{
 const id=v.id(req.params.id); if(id===req.user.id) v.fail('You cannot delete your own administrator account',409);
 const user=await User.findById(id);if(!user) v.fail('User not found',404);
 if(user.role==='admin') v.fail('Administrator accounts must be managed by the database owner',403);
 await user.deleteOne();res.json({success:true,message:'User deleted'});
});
module.exports=router;
