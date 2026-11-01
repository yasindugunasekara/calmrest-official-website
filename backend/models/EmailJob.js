const mongoose=require('mongoose');
module.exports=mongoose.model('EmailJob',new mongoose.Schema({key:{type:String,unique:true,required:true},to:String,replyTo:String,subject:String,text:String,status:{type:String,enum:['pending','sending','sent','failed'],default:'pending'},attempts:{type:Number,default:0},lastError:String,sentAt:Date},{timestamps:true}));
