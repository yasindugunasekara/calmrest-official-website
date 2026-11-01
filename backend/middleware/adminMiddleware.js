module.exports=(req,res,next)=> req.user?.role === 'admin' ? next() : res.status(403).json({error:'Admin access only'});
