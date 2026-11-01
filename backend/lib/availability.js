const Room=require('../models/Room');
const Booking=require('../models/Booking');
const v=require('./validation');
const active=['Pending','Confirmed','Checked In'];
async function reserve(body,session,existingId) {
 const room=await Room.findOneAndUpdate(body.roomId ? {_id:v.id(String(body.roomId))} : {name:v.text(body.roomType,'Room',120)},{$inc:{bookingVersion:1}},{new:true,session});
 if(!room) v.fail('Room not found',404);
 const dates=v.dates(body.checkIn,body.checkOut,Boolean(existingId));
 const guests=v.number(body.guests,'Guests',1,room.guests || 1,true);
 const overlapping=await Booking.find({...(existingId?{_id:{$ne:existingId}}:{}),$or:[{roomId:room._id},{roomId:{$exists:false},roomType:room.name}],status:{$nin:['Cancelled','Checked Out']},checkIn:{$lt:dates.checkOut},checkOut:{$gt:dates.checkIn}}).session(session).lean();
 // Count each night separately: consecutive stays do not consume simultaneous inventory.
 for(let day=Date.parse(dates.checkIn);day<Date.parse(dates.checkOut);day+=86400000) {
  const key=new Date(day).toISOString().slice(0,10);
  if(overlapping.filter(b=>b.checkIn<=key && b.checkOut>key).length >= (room.inventory || 1)) v.fail('This room is unavailable for the selected dates. Choose another room or dates.',409);
 }
 return {...dates,guests,roomId:room._id,roomType:room.name,pricePerNight:room.price,totalPrice:Math.round(room.price*dates.nights*100)/100};
}
module.exports={reserve,active};
