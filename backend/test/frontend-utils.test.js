const {test}=require('node:test');
const assert=require('node:assert/strict');
test('dashboard totals use inventory and exclude cancelled reservations',async()=>{
 const {dailyMetrics}=await import('../../Dashbord 2/src/lib/metrics.ts');
 const bookings=[{checkIn:'2027-01-01',checkOut:'2027-01-03',status:'Pending',pricePerNight:125},{checkIn:'2027-01-01',checkOut:'2027-01-03',status:'Cancelled',pricePerNight:900}];
 assert.deepEqual(dailyMetrics(bookings,[{inventory:4}],'2027-01-02'),{inventory:4,reserved:1,available:3,occupancy:25,value:125});
});
test('dashboard treats departure as exclusive and handles zero rooms',async()=>{
 const {dailyMetrics}=await import('../../Dashbord 2/src/lib/metrics.ts');
 assert.equal(dailyMetrics([{checkIn:'2027-01-01',checkOut:'2027-01-02',pricePerNight:10}],[{}],'2027-01-02').reserved,0);
 assert.equal(dailyMetrics([],[],'2027-01-01').occupancy,0);
});
test('dashboard never fabricates historical revenue',async()=>{
 const {dailyMetrics}=await import('../../Dashbord 2/src/lib/metrics.ts');
 assert.equal(dailyMetrics([{checkIn:'2027-01-01',checkOut:'2027-01-03'}],[{}],'2027-01-02').value,0);
});
test('Cloudinary room images request responsive compressed CDN variants',async()=>{
 const {imageUrl}=await import('../../frontend/src/lib/images.ts');
 assert.equal(imageUrl('https://res.cloudinary.com/demo/image/upload/v1/room.jpg',400),'https://res.cloudinary.com/demo/image/upload/f_auto,q_auto,c_limit,w_400/v1/room.jpg');
 assert.equal(imageUrl(''), '');
});
