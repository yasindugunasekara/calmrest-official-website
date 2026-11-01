const router=require('express').Router();
const Testimonial=require('../models/Testimonial');
const v=require('../lib/validation');
router.get('/',async(req,res)=>res.json(await Testimonial.find().sort({createdAt:-1}).limit(100).lean()));
router.post('/',async(req,res)=>{
 const data={};for(const [key,max] of Object.entries({name:160,country:80,reviewTitle:160,review:3000,roomType:120,stayDuration:80})) data[key]=v.text(req.body[key],key,max);
 data.rating=v.number(req.body.rating,'Rating',1,5,true);
 res.status(201).json(await Testimonial.create(data));
});
module.exports=router;
