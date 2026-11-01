type Booking={checkIn:string;checkOut:string;status?:string;pricePerNight?:number;totalPrice?:number;nights?:number};
type Room={inventory?:number};
export function dailyMetrics(bookings:Booking[],rooms:Room[],date:string){
 const inventory=rooms.reduce((sum,room)=>sum+(room.inventory || 1),0);
 const occupied=bookings.filter(b=>b.status!=='Cancelled' && b.checkIn<=date && b.checkOut>date);
 const value=occupied.reduce((sum,b)=>sum+(b.pricePerNight ?? (b.totalPrice && b.nights ? b.totalPrice/b.nights:0)),0);
 return {inventory,reserved:occupied.length,available:Math.max(0,inventory-occupied.length),occupancy:inventory?Math.min(100,Math.round(occupied.length/inventory*100)):0,value:Math.round(value*100)/100};
}
