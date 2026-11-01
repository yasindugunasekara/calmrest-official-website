const nodemailer=require('nodemailer');
const EmailJob=require('../models/EmailJob');
const Settings=require('../models/Settings');
function transporter() {
 if(!process.env.SMTP_USER || !process.env.SMTP_PASS) throw new Error('SMTP credentials are not configured');
 return nodemailer.createTransport({host:process.env.SMTP_HOST || 'smtp.gmail.com',port:Number(process.env.SMTP_PORT || 587),secure:process.env.SMTP_PORT==='465',auth:{user:process.env.SMTP_USER,pass:process.env.SMTP_PASS},connectionTimeout:5000,greetingTimeout:5000,socketTimeout:10000});
}
async function queue(key,to,subject,text,replyTo) { await EmailJob.updateOne({key},{$setOnInsert:{key,to,subject,text,replyTo}},{upsert:true}); }
async function deliverPending() {
 const jobs=await EmailJob.find({$or:[{status:{$in:['pending','failed']}},{status:'sending',updatedAt:{$lt:new Date(Date.now()-120000)}}],attempts:{$lt:5}}).sort({createdAt:1}).limit(10);
 await Promise.all(jobs.map(async(job)=>{
  const claimed=await EmailJob.findOneAndUpdate({_id:job._id,status:job.status,updatedAt:job.updatedAt},{$set:{status:'sending'},$inc:{attempts:1}},{new:true}); if(!claimed) return;
  try { await transporter().sendMail({from:`Calm Rest <${process.env.SMTP_USER}>`,to:job.to,replyTo:job.replyTo,subject:job.subject,text:job.text});await EmailJob.updateOne({_id:job._id},{$set:{status:'sent',sentAt:new Date(),lastError:''}}); }
  catch { await EmailJob.updateOne({_id:job._id},{$set:{status:'failed',lastError:'Delivery failed. Check SMTP configuration and retry.'}}); }
 }));
}
async function bookingEmails(booking) {
 const settings=await Settings.findById('hotel').lean();
 const details=`Reference: ${booking._id}
Guest: ${booking.firstName} ${booking.lastName}
Email: ${booking.email}
Room: ${booking.roomType}
Check-in: ${booking.checkIn}
Check-out: ${booking.checkOut}
Guests: ${booking.guests}
Total: USD ${booking.totalPrice}
Status: ${booking.status}
Requests: ${booking.specialRequest || 'None'}`;
 await queue(`booking-owner-${booking._id}`,process.env.ADMIN_NOTIFICATION_EMAIL || 'calmrestmidigama2017@gmail.com','New booking — Calm Rest',details,booking.email);
 if(settings?.emailNotifications!==false) await queue(`booking-guest-${booking._id}`,booking.email,`Booking ${booking.status === 'Confirmed' ? 'confirmed' : 'request received'} — Calm Rest`,details+`
Our team will contact you about your stay.`);
}
async function messageEmail(message) { await queue(`message-${message._id}`,process.env.ADMIN_NOTIFICATION_EMAIL || 'calmrestmidigama2017@gmail.com','New guest question — Calm Rest',`From: ${message.fullName}
Email: ${message.email}
Phone: ${message.phone || ''}

${message.message}`,message.email); }
module.exports={bookingEmails,messageEmail,deliverPending};
