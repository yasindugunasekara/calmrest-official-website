import ReactGA from 'react-ga4';
type Item = {id?:string;_id?:string;name?:string;title?:string;price?:number};
export const trackEvent=(name:string,params?:Record<string,unknown>)=>{ReactGA.event(name,params);};
export const trackEcommerceEvent=(name:string,items:Item[],params?:Record<string,unknown>)=>{ReactGA.event(name,{...params,items:items.map(item=>({item_id:item.id || item._id,item_name:item.name || item.title,price:item.price,quantity:1}))});};
