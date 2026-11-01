const router=require('express').Router();
const Message=require('../models/Message');
const auth=require('../middleware/authMiddleware'),admin=require('../middleware/adminMiddleware'),v=require('../lib/validation');
const {messageEmail,deliverPending}=require('../config/mailer');
router.post('/',async(req,res)=>{
 const data={fullName:v.text(req.body.fullName,'Name',160),email:v.email(req.body.email),phone:v.text(req.body.phone,'Phone',40,false),message:v.text(req.body.message,'Message',5000)};
 const message=await Message.create(data);await messageEmail(message);await deliverPending();
 res.status(201).json({success:true});
});
router.get('/',auth,admin,async(req,res)=>res.json({success:true,data:await Message.find().sort({createdAt:-1}).lean()}));
router.patch('/:id',auth,admin,async(req,res)=>{if(typeof req.body.isRead!=='boolean') v.fail('isRead must be a boolean');const message=await Message.findByIdAndUpdate(v.id(req.params.id),{$set:{isRead:req.body.isRead}},{new:true,runValidators:true});if(!message) v.fail('Message not found',404);res.json({success:true,data:message});});
router.delete('/:id',auth,admin,async(req,res)=>{if(!await Message.findByIdAndDelete(v.id(req.params.id))) v.fail('Message not found',404);res.json({success:true});});
module.exports=router;
