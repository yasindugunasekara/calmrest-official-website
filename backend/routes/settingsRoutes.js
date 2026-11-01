const router=require('express').Router();
const Settings=require('../models/Settings'),EmailJob=require('../models/EmailJob');
const auth=require('../middleware/authMiddleware'),admin=require('../middleware/adminMiddleware'),v=require('../lib/validation');
router.use(auth,admin);
router.get('/',async(req,res)=>{const settings=await Settings.findById('hotel').lean() || new Settings().toObject();res.json({...settings,smtpConfigured:Boolean(process.env.SMTP_USER && process.env.SMTP_PASS),notificationEmail:process.env.ADMIN_NOTIFICATION_EMAIL || 'calmrestmidigama2017@gmail.com',failedEmails:await EmailJob.countDocuments({status:{$in:['failed','pending']}})});});
router.put('/',async(req,res)=>{
 const data={};for(const key of ['hotelName','phone','address','email','website']) data[key]=v.text(req.body[key],key,300,key==='hotelName');
 if(data.email) data.email=v.email(data.email);
 if(data.website && !/^https:\/\//.test(data.website)) v.fail('Website must use HTTPS');
 for(const key of ['onlineBooking','autoConfirm','emailNotifications']) {if(typeof req.body[key]!=='boolean') v.fail(`${key} must be a boolean`);data[key]=req.body[key];}
 for(const key of ['checkInTime','checkOutTime']) {if(!/^([01]\d|2[0-3]):[0-5]\d$/.test(req.body[key])) v.fail('Invalid check-in/out time');data[key]=req.body[key];}
 const settings=await Settings.findByIdAndUpdate('hotel',{$set:data},{new:true,upsert:true,runValidators:true});res.json(settings);
});
router.post('/retry-emails',async(req,res)=>{await EmailJob.updateMany({status:'failed'},{$set:{attempts:0,status:'pending'}});await require('../config/mailer').deliverPending();res.json({success:true,remaining:await EmailJob.countDocuments({status:{$in:['failed','pending']}})});});
module.exports=router;
