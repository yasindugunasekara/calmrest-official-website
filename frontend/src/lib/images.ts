export function imageUrl(source:string,width=640) {
 if(!source) return '';
 try {const url=new URL(source);if(url.hostname==='res.cloudinary.com' && url.pathname.includes('/image/upload/')) return source.replace('/image/upload/',`/image/upload/f_auto,q_auto,c_limit,w_${width}/`);return source;}catch{return '';}
}
