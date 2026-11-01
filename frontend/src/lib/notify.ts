export function notify(message:string,kind:'success'|'info'='info'){window.dispatchEvent(new CustomEvent('hotel-notice',{detail:{message,kind}}));}
