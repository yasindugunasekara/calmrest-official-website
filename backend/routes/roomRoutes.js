const router=require('express').Router();
const Room=require('../models/Room'),Booking=require('../models/Booking');
const auth=require('../middleware/authMiddleware'),admin=require('../middleware/adminMiddleware'),v=require('../lib/validation');
router.get('/',async(req,res)=>{
 const rooms=await Room.find().sort({createdAt:-1}).lean();
 if(req.query.checkIn || req.query.checkOut) {
  const {checkIn,checkOut}=v.dates(req.query.checkIn,req.query.checkOut);
  const bookings=await Booking.find({status:{$nin:['Cancelled','Checked Out']},checkIn:{$lt:checkOut},checkOut:{$gt:checkIn}}).select('roomId roomType checkIn checkOut').lean();
  for(const room of rooms) {
   let peak=0;
   for(let day=Date.parse(checkIn);day<Date.parse(checkOut);day+=86400000) {const key=new Date(day).toISOString().slice(0,10);peak=Math.max(peak,bookings.filter(b=>(b.roomId?.toString()===room._id.toString() || (!b.roomId && b.roomType===room.name)) && b.checkIn<=key && b.checkOut>key).length);}
   room.available=Math.max(0,(room.inventory || 1)-peak);
  }
 }
 res.json(rooms);
});
router.get('/:id',async(req,res)=>{const room=await Room.findById(v.id(req.params.id)).lean();if(!room) v.fail('Room not found',404);res.json(room);});
router.post('/',auth,admin,async(req,res)=>res.status(201).json(await Room.create(v.room(req.body))));
router.put('/:id',auth,admin,async(req,res)=>{
 const id=v.id(req.params.id),data=v.room(req.body);let room;
 const session=await Room.startSession();
 try {await session.withTransaction(async()=>{
 room=await Room.findOneAndUpdate({_id:id},{$inc:{bookingVersion:1}},{new:true,session});if(!room) v.fail('Room not found',404);
 const active=await Booking.exists({$or:[{roomId:id},{roomId:{$exists:false},roomType:room.name}],status:{$nin:['Cancelled','Checked Out']},checkOut:{$gt:v.today()}}).session(session);
 if(active && (data.inventory<(room.inventory || 1) || data.name!==room.name)) v.fail('Cannot reduce inventory or rename a room with active reservations',409);
 Object.assign(room,data);await room.save({session});
 });} finally {await session.endSession();}
 res.json(room);
});
router.delete('/:id',auth,admin,async(req,res)=>{
 const id=v.id(req.params.id);const session=await Room.startSession();
 try {await session.withTransaction(async()=>{
 const room=await Room.findOneAndUpdate({_id:id},{$inc:{bookingVersion:1}},{new:true,session});if(!room) v.fail('Room not found',404);
 if(await Booking.exists({$or:[{roomId:id},{roomId:{$exists:false},roomType:room.name}],status:{$nin:['Cancelled','Checked Out']},checkOut:{$gt:v.today()}}).session(session)) v.fail('Cancel active reservations before deleting this room',409);
 await Room.deleteOne({_id:id},{session});
 });} finally {await session.endSession();}
 res.json({success:true});
});
module.exports=router;
