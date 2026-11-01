
const {test,before,after}=require('node:test');
const assert=require('node:assert/strict');
const {randomUUID}=require('node:crypto');
const request=require('supertest');
const mongoose=require('mongoose');
const {MongoMemoryReplSet}=require('mongodb-memory-server-core');
const nodemailer=require('nodemailer');
let repl,app,adminToken,userToken,roomId,bookingId,guestPassword='correct horse battery staple',ip=1;
const delivery=[];
const call=(method,path,token)=>{let req=request(app)[method](path).set('X-Forwarded-For',`192.0.2.${ip++}`);if(token)req=req.set('Authorization',`Bearer ${token}`);return req;};
const date=(offset)=>new Date(Date.now()+offset*86400000).toISOString().slice(0,10);
const stay=(extra={})=>({firstName:'Test',lastName:'Guest',email:'guest@example.test',roomId,roomType:'Garden Room',checkIn:date(5),checkOut:date(7),guests:2,totalPrice:1,...extra});
const book=(body)=>call('post','/api/bookings').set('Idempotency-Key',randomUUID()).send(body);
before(async()=>{
 process.env.FIREBASE_PROJECT_ID='test-project';process.env.JWT_SECRET='test-secret-only-'.repeat(4);process.env.SMTP_USER='sender@example.test';process.env.SMTP_PASS='fake-only';process.env.ADMIN_NOTIFICATION_EMAIL='calmrestmidigama2017@gmail.com';process.env.ALLOWED_ORIGINS='https://hotel.example.test';
 nodemailer.createTransport=()=>({sendMail:async message=>{delivery.push(message);return {messageId:'test-only'};}});
 const binary=process.env.MONGOMS_SYSTEM_BINARY?{systemBinary:process.env.MONGOMS_SYSTEM_BINARY,checkMD5:false}:undefined;
 repl=await MongoMemoryReplSet.create({binary,replSet:{count:1}});process.env.MONGO_URI=repl.getUri('isolated_hotel_tests');
 app=require('../app');await require('../config/db')();
 await Promise.all(Object.values(mongoose.models).map(model=>model.init()));
 const bcrypt=require('bcryptjs');const User=require('../models/User');
 await User.create({firstName:'Hotel',lastName:'Admin',country:'Sri Lanka',email:'admin@example.test',password:await bcrypt.hash(guestPassword,12),role:'admin'});
 adminToken=(await call('post','/api/auth/login').send({email:'admin@example.test',password:guestPassword}).expect(200)).body.token;
}, {timeout:120000});
after(async()=>{await mongoose.disconnect();if(repl)await repl.stop();});
test('health, security headers, and explicit CORS allowlist',async()=>{
 const response=await call('get','/api/health').set('Origin','https://evil.example.test').expect(200);
 assert.equal(response.headers['access-control-allow-origin'],undefined);assert.equal(response.headers['x-content-type-options'],'nosniff');assert.equal(response.headers['x-powered-by'],undefined);
 const allowed=await call('get','/api/health').set('Origin','https://hotel.example.test');assert.equal(allowed.headers['access-control-allow-origin'],'https://hotel.example.test');
});
test('public registration cannot grant admin access',async()=>{await call('post','/api/users').send({role:'admin'}).expect(403);});
test('registration normalizes email and never returns password hashes',async()=>{
 const response=await call('post','/api/users').send({firstName:'Jane',lastName:'Guest',country:'Sri Lanka',email:'Guest@Example.Test',password:guestPassword}).expect(201);
 assert.equal(response.body.user.email,'guest@example.test');assert.equal(response.body.user.password,undefined);assert.equal(response.body.user.role,'user');
 userToken=(await call('post','/api/auth/login').send({email:'GUEST@EXAMPLE.TEST',password:guestPassword}).expect(200)).body.token;
});
test('weak passwords, operator injection and unverified Google identities are rejected',async()=>{
 await call('post','/api/users').send({firstName:'A',lastName:'B',country:'LK',email:'new@example.test',password:'123'}).expect(400);
 await call('post','/api/auth/login').send({email:{$ne:null},password:'x'}).expect(400);
 await call('post','/api/auth/google').send({email:'admin@example.test'}).expect(400);
 await call('post','/api/auth/google').send({idToken:'forged-token'}).expect(401);
 await call('post','/api/auth/login').send({email:'guest@example.test',password:'wrong password'}).expect(401);
});
test('every private resource rejects anonymous and non-admin sessions',async()=>{
 for(const path of ['/api/bookings','/api/messages','/api/users','/api/settings']) {await call('get',path).expect(401);await call('get',path,userToken).expect(403);}
 const fake=new mongoose.Types.ObjectId();await call('put',`/api/bookings/${fake}`).send({status:'Confirmed'}).expect(401);
 await call('post','/api/users/admin',userToken).send({}).expect(403);
});
test('admin creates rooms with validated inventory and CDN images',async()=>{
 const room={name:'Garden Room',category:'Garden',price:125,guests:2,inventory:1,images:['https://res.cloudinary.com/demo/image/upload/sample.jpg'],amenities:['wifi'],features:[]};
 await call('post','/api/rooms',userToken).send(room).expect(403);
 await call('post','/api/rooms',adminToken).send({...room,images:['javascript:alert(1)']}).expect(400);
 const response=await call('post','/api/rooms',adminToken).send(room).expect(201);roomId=response.body._id;assert.equal(response.body.inventory,1);
});
test('booking price is computed on the server and owner/guest emails are queued and delivered',async()=>{
 const response=await book(stay()).expect(201);bookingId=response.body.bookingId;assert.equal(response.body.booking.totalPrice,250);assert.equal(response.body.booking.status,'Pending');
 const owner=delivery.find(m=>m.to==='calmrestmidigama2017@gmail.com');assert.ok(owner);assert.match(owner.text,/Garden Room/);assert.ok(delivery.find(m=>m.to==='guest@example.test'));
});
test('booking idempotency returns one reservation and prevents duplicate email jobs',async()=>{
 const key=randomUUID(),body=stay({checkIn:date(10),checkOut:date(11)});
 const first=await call('post','/api/bookings').set('Idempotency-Key',key).send(body).expect(201);
 const second=await call('post','/api/bookings').set('Idempotency-Key',key).send(body).expect(201);assert.equal(first.body.bookingId,second.body.bookingId);
 assert.equal(await require('../models/Booking').countDocuments({idempotencyKey:key}),1);
 assert.equal(await require('../models/EmailJob').countDocuments({key:`booking-owner-${first.body.bookingId}`}),1);
});
test('overlapping stays and guest capacity overflow are rejected; back-to-back stays are allowed',async()=>{
 await book(stay()).expect(409);await book(stay({guests:3})).expect(400);
 await book(stay({checkIn:date(7),checkOut:date(8)})).expect(201);
});
test('concurrent reservation race admits exactly one booking for the last room',async()=>{
 const body=stay({checkIn:date(20),checkOut:date(22)});
 const results=await Promise.all([book(body),book(body)]);assert.deepEqual(results.map(r=>r.status).sort(),[201,409]);
});
test('invalid dates, missing room, and malformed IDs return safe client errors',async()=>{
 await book(stay({checkIn:'2026-02-30'})).expect(400);await book(stay({checkOut:date(4)})).expect(400);
 await book(stay({roomId:new mongoose.Types.ObjectId().toString()})).expect(404);
 await call('get','/api/rooms/not-an-id').expect(400);
});
test('status changes persist; cancellation releases availability without reopening closed bookings',async()=>{
 await call('put',`/api/bookings/${bookingId}`,userToken).send({status:'Confirmed'}).expect(403);
 await call('put',`/api/bookings/${bookingId}`,adminToken).send({status:'Confirmed'}).expect(200);
 await call('put',`/api/bookings/${bookingId}`,adminToken).send({status:'Cancelled'}).expect(200);
 await call('put',`/api/bookings/${bookingId}`,adminToken).send({status:'Confirmed'}).expect(409);
 await book(stay()).expect(201);
});
test('room availability reflects dates and booked rooms cannot be deleted',async()=>{
 const response=await call('get',`/api/rooms?checkIn=${date(5)}&checkOut=${date(7)}`).expect(200);assert.equal(response.body.find(r=>r._id===roomId).available,0);
 await call('delete',`/api/rooms/${roomId}`,adminToken).expect(409);
});
test('questions validate input, email the owner, and persist read status',async()=>{
 await call('post','/api/messages').send({fullName:'A',email:'invalid',message:'Hello'}).expect(400);
 await call('post','/api/messages').send({fullName:'Jane Guest',email:'guest@example.test',message:'Is airport pickup available?'}).expect(201);
 const list=await call('get','/api/messages',adminToken).expect(200);const id=list.body.data[0]._id;
 await call('patch',`/api/messages/${id}`,adminToken).send({isRead:true}).expect(200);
 assert.equal((await call('get','/api/messages',adminToken)).body.data[0].isRead,true);
 assert.ok(delivery.find(m=>m.to==='calmrestmidigama2017@gmail.com' && m.text.includes('airport pickup')));
});
test('settings persist and disabling online bookings is enforced',async()=>{
 const settings={hotelName:'Calm Rest',phone:'',address:'',email:'owner@example.test',website:'https://hotel.example.test',onlineBooking:false,autoConfirm:false,emailNotifications:true,checkInTime:'14:00',checkOutTime:'11:00'};
 await call('put','/api/settings',adminToken).send(settings).expect(200);assert.equal((await call('get','/api/settings',adminToken)).body.onlineBooking,false);
 await book(stay({checkIn:date(30),checkOut:date(31)})).expect(503);
});
test('reviews reject out-of-range ratings and missing fields',async()=>{
 const review={name:'Jane',country:'LK',rating:6,reviewTitle:'Stay',review:'Lovely stay',roomType:'Garden',stayDuration:'2 nights'};
 await call('post','/api/testimonials').send(review).expect(400);await call('post','/api/testimonials').send({...review,rating:5}).expect(201);
});
test('logout revokes issued tokens and deleted accounts lose access',async()=>{
 await call('post','/api/auth/logout',userToken).expect(200);await call('get','/api/auth/me',userToken).expect(401);
});
test('SMTP delivery failures remain retryable without losing the guest question',async()=>{
 nodemailer.createTransport=()=>({sendMail:async()=>{throw new Error('test mail outage');}});
 await call('post','/api/messages').send({fullName:'Guest',email:'guest@example.test',message:'Delivery outage test'}).expect(201);
 const jobs=await require('../models/EmailJob').find({status:'failed'});assert.ok(jobs.length);
 nodemailer.createTransport=()=>({sendMail:async()=>({messageId:'retry'})});
 await call('post','/api/settings/retry-emails',adminToken).expect(200);assert.equal(await require('../models/EmailJob').countDocuments({status:'failed'}),0);
});

test('password recovery sends a single-use link, hides account existence, and revokes old sessions',async()=>{
 const before=await require('../models/EmailJob').countDocuments();
 const unknown=await call('post','/api/auth/forgot-password').send({email:'missing@example.test'}).expect(200);
 assert.equal(await require('../models/EmailJob').countDocuments(),before);
 const known=await call('post','/api/auth/forgot-password').send({email:'guest@example.test'}).expect(200);
 assert.equal(unknown.body.message,known.body.message);
 const job=await require('../models/EmailJob').findOne({subject:'Reset your Calm Rest password'}).sort({createdAt:-1});
 const link=job.text.match(/https:\/\/[^\s]+/)[0];const token=new URL(link).searchParams.get('token');assert.equal(token.length,64);
 const user=await require('../models/User').findOne({email:'guest@example.test'}).select('+resetPasswordHash');assert.notEqual(user.resetPasswordHash,token);
 await call('post','/api/auth/reset-password').send({token,password:'short'}).expect(400);
 await call('post','/api/auth/reset-password').send({token,password:'new correct horse battery'}).expect(200);
 await call('post','/api/auth/reset-password').send({token,password:'another correct horse battery'}).expect(400);
 await call('post','/api/auth/login').send({email:'guest@example.test',password:guestPassword}).expect(401);
 await call('post','/api/auth/login').send({email:'guest@example.test',password:'new correct horse battery'}).expect(200);
 await call('get','/api/auth/me',userToken).expect(401);
});
