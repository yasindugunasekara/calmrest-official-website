require('dotenv').config();
const app=require('./app');
if(require.main===module && !process.env.VERCEL) {
 require('./config/db')().then(()=>{app.listen(process.env.PORT || 5000,()=>console.log('Calm Rest API started'));}).catch(()=>{console.error('Unable to connect to MongoDB. Check configuration.');process.exitCode=1;});
}
module.exports=app;
