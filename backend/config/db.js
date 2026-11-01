const mongoose = require('mongoose');
let connection;
async function connectDB() {
 if(mongoose.connection.readyState === 1) return mongoose;
 if(!process.env.MONGO_URI) throw new Error('MONGO_URI is required');
 if(!connection) connection=mongoose.connect(process.env.MONGO_URI,{serverSelectionTimeoutMS:10000,maxPoolSize:10}).catch(error=>{connection=null;throw error;});
 return connection;
}
module.exports=connectDB;
