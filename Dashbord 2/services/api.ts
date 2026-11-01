import axios from 'axios';
export const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '/api').replace(/\/$/, '');
const api = axios.create({ baseURL: API_BASE_URL, timeout: 20000 });
api.interceptors.request.use(config => {
 const target = new URL(api.getUri(config), location.origin);
 const base = new URL(API_BASE_URL + '/', location.origin);
 if (target.origin === base.origin && target.pathname.startsWith(base.pathname)) {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
 }
 return config;
});
api.interceptors.response.use(response => {if(response.config.method && response.config.method!=='get') window.dispatchEvent(new Event('hotel-data-changed'));return response;}, error => {
 if (error.response?.status === 401) { localStorage.removeItem('token'); localStorage.removeItem('user'); if (location.pathname !== '/login') location.replace('/login'); }
 return Promise.reject(error);
});
export async function apiFetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
 const target = new URL(input instanceof Request ? input.url : String(input), location.origin);
 const base = new URL(API_BASE_URL + '/', location.origin);
 const headers = new Headers(init?.headers || (input instanceof Request ? input.headers : undefined));
 const token = localStorage.getItem('token');
 if (token && target.origin === base.origin && target.pathname.startsWith(base.pathname)) headers.set('Authorization', `Bearer ${token}`);
 const response = await fetch(input, { ...init, headers, signal: init?.signal || AbortSignal.timeout(20000) });
 if (response.status === 401) { localStorage.removeItem('token'); localStorage.removeItem('user'); if (location.pathname !== '/login') location.replace('/login'); }
 if(response.ok && init?.method && init.method!=='GET') window.dispatchEvent(new Event('hotel-data-changed'));
 return response;
}
export default api;
