const express=require('express'),helmet=require('helmet'),cors=require('cors'),compression=require('compression');
const {rateLimit}=require('express-rate-limit');
const connectDB=require('./config/db');
const app=express();
app.disable('x-powered-by');app.set('trust proxy',1);
app.use(helmet());app.use(compression());
const origins=(process.env.ALLOWED_ORIGINS || 'http://localhost:5173,http://localhost:5174').split(',').map(x=>x.trim()).filter(Boolean);
app.use(cors({origin(origin,cb){cb(null,!origin || origins.includes(origin));},methods:['GET','POST','PUT','PATCH','DELETE'],allowedHeaders:['Content-Type','Authorization','Idempotency-Key']}));
app.use(express.json({limit:'64kb'}));
app.use('/api',(req,res,next)=>{res.set('Cache-Control','no-store');next();});
const limit=(max,windowMs)=>rateLimit({windowMs,max,standardHeaders:'draft-8',legacyHeaders:false,message:{error:'Too many requests. Try again later.'}});
app.use('/api',limit(300,60000));
const loginLimit=limit(15,15*60000);app.use('/api/auth/login',loginLimit);app.use('/api/auth/google',loginLimit);
const submitLimit=limit(10,15*60000);app.use(['/api/bookings','/api/messages','/api/users','/api/testimonials'],(req,res,next)=>req.method==='POST'?submitLimit(req,res,next):next());
app.get('/api/health',(req,res)=>res.json({status:'ok'}));
app.use('/api',async(req,res,next)=>{
 if(!process.env.JWT_SECRET || process.env.JWT_SECRET.length<32 || process.env.JWT_SECRET==='default_jwt_secret_fallback_key_12345') return res.status(503).json({error:'Authentication is not securely configured'});
 await connectDB();next();
});
for(const [path,file] of Object.entries({rooms:'roomRoutes',bookings:'bookingRoutes',messages:'messageRoutes',users:'userRoutes',auth:'authRoutes',testimonials:'testimonials',settings:'settingsRoutes'})) app.use(`/api/${path}`,require(`./routes/${file}`));
app.get('/',(req,res)=>res.json({service:'Calm Rest API'}));
app.use((req,res)=>res.status(404).json({error:'Endpoint not found'}));
app.use((error,req,res,next)=>{
 const status=error.status || (error.code===11000?409:['ValidationError','CastError'].includes(error.name)?400:500);
 if(status>=500) console.error('Request failed:',error.name);
 res.status(status).json({success:false,error:status>=500?'Service temporarily unavailable. Please try again.':error.code===11000?'A record with these details already exists':error.type==='entity.parse.failed'?'Invalid JSON body':error.message});
});
module.exports=app;
