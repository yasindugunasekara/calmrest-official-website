const mongoose = require('mongoose');
const fail = (message, status = 400) => { const error = new Error(message); error.status = status; throw error; };
function text(value, label, max = 200, required = true) {
  if (typeof value !== 'string') { if (!required && value == null) return ''; fail(`${label} is required`); }
  const result = value.trim();
  if ((required && !result) || result.length > max || /[\u0000-\u0008\u000b\u000c\u000e-\u001f]/.test(result)) fail(`${label} is invalid (maximum ${max} characters)`);
  return result;
}
function email(value) { const result = text(value, 'Email', 254).toLowerCase(); if (!/^[^\s@,;<>]+@[^\s@,;<>]+\.[^\s@,;<>]+$/.test(result)) fail('Enter a valid email'); return result; }
function password(value) { if (typeof value !== 'string' || value.length < 12 || Buffer.byteLength(value) > 72) fail('Password must contain at least 12 characters and at most 72 bytes'); return value; }
function number(value, label, min, max, integer = false) { if (typeof value !== 'number' || !Number.isFinite(value) || value < min || value > max || (integer && !Number.isInteger(value))) fail(`${label} is invalid`); return value; }
function id(value) { if (typeof value !== 'string' || !mongoose.isObjectIdOrHexString(value)) fail('Invalid identifier'); return value; }
function date(value) { if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value) || !Number.isFinite(Date.parse(value)) || new Date(value).toISOString().slice(0,10) !== value) fail('Use a valid date in YYYY-MM-DD format'); return value; }
const today = () => new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Colombo', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
function dates(start, end, allowPast = false) { const checkIn=date(start), checkOut=date(end); const nights=(Date.parse(checkOut)-Date.parse(checkIn))/86400000; if ((!allowPast && checkIn < today()) || nights < 1 || nights > 90) fail('Choose a future stay of 1 to 90 nights'); return {checkIn, checkOut, nights}; }
function httpsUrl(value) { const result=text(value,'Image URL',2048); try { const u=new URL(result); if(u.protocol !== 'https:' || u.username || u.password) fail('Images must use HTTPS URLs'); } catch { fail('Images must use HTTPS URLs'); } return result; }
function room(body) {
 const data={ name:text(body.name,'Room name',120), category:text(body.category,'Category',80,false), description:text(body.description,'Description',5000,false), price:number(body.price,'Price',0,1000000), rating:number(body.rating ?? 0,'Rating',0,5), guests:number(body.guests,'Guests',1,20,true), inventory:number(body.inventory ?? 1,'Inventory',1,1000,true), size:text(String(body.size ?? ''),'Size',40,false), bed:text(body.bed,'Bed',80,false) };
 if(!Array.isArray(body.images) || body.images.length < 1 || body.images.length > 12) fail('Add between 1 and 12 HTTPS image URLs');
 data.images=body.images.map(httpsUrl);
 if(!Array.isArray(body.amenities ?? []) || (body.amenities ?? []).length > 30) fail('Invalid amenities');
 data.amenities=(body.amenities ?? []).map(x=>text(x,'Amenity',80));
 if(!Array.isArray(body.features ?? []) || (body.features ?? []).length > 30) fail('Invalid features');
 data.features=(body.features ?? []).map(x=>({ name:text(typeof x==='string'?x:x.name,'Feature',120),icon:text(x.icon ?? 'Check','Icon',40) }));
 return data;
}
module.exports={fail,text,email,password,number,id,date,dates,today,room};
