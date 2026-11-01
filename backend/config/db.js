const mongoose = require('mongoose');
if(process.env.DNS_SERVERS) require('node:dns').setServers(process.env.DNS_SERVERS.split(',').map(value=>value.trim()).filter(Boolean));
let connection;
async function connectDB() {
 if(mongoose.connection.readyState === 1) return mongoose;
 if(!process.env.MONGO_URI) throw new Error('MONGO_URI is required');
 if(!connection) connection=mongoose.connect(process.env.MONGO_URI,{serverSelectionTimeoutMS:10000,maxPoolSize:10}).catch(error=>{connection=null;throw error;});
 return connection;
}
module.exports=connectDB;
