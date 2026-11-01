export const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '/api').replace(/\/$/, '');
export async function apiFetch(input:RequestInfo | URL,init?:RequestInit) {
 const response=await fetch(input,{...init,signal:init?.signal || AbortSignal.timeout(20000)});
 if(!response.ok) { let message='Unable to complete your request.';try{const data=await response.json();message=data.error || data.message || message;}catch{/* Non-JSON gateway error. */}throw new Error(message); }
 return response;
}
