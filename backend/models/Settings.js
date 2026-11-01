const mongoose=require('mongoose');
module.exports=mongoose.model('Settings',new mongoose.Schema({
 _id:{type:String,default:'hotel'},hotelName:{type:String,default:'Calm Rest'},phone:{type:String,default:''},address:{type:String,default:''},email:{type:String,default:''},website:{type:String,default:''},onlineBooking:{type:Boolean,default:true},autoConfirm:{type:Boolean,default:false},emailNotifications:{type:Boolean,default:true},checkInTime:{type:String,default:'14:00'},checkOutTime:{type:String,default:'11:00'},
},{timestamps:true}));
