import {useEffect,useState} from 'react';
import {Link,useNavigate} from 'react-router-dom';
import {API_BASE_URL,apiFetch} from '../lib/api';
type Account={firstName:string;lastName:string;email:string;country:string;provider:string};
export default function Profile(){
 const [account,setAccount]=useState<Account|null>(null);const [error,setError]=useState('');const navigate=useNavigate();
 useEffect(()=>{const token=localStorage.getItem('token');if(!token){navigate('/login');return;}apiFetch(`${API_BASE_URL}/auth/me`,{headers:{Authorization:`Bearer ${token}`}}).then(res=>res.json()).then(data=>setAccount(data.user)).catch(()=>{localStorage.removeItem('token');setError('Your session expired. Please sign in again.');});},[navigate]);
 async function logout(){try{await apiFetch(`${API_BASE_URL}/auth/logout`,{method:'POST',headers:{Authorization:`Bearer ${localStorage.getItem('token')}`}});}finally{localStorage.removeItem('token');localStorage.removeItem('user');navigate('/login');}}
 return <section className="max-w-xl mx-auto p-8 my-12 bg-cream rounded-2xl"><h1 className="text-3xl font-serif mb-6">Your account</h1>{error?<p role="alert">{error} <Link to="/login">Sign in</Link></p>:account?<div className="space-y-4"><p className="text-xl font-semibold">{account.firstName} {account.lastName}</p><p>{account.email}</p><p>{account.country}</p><Link className="inline-block bg-navy text-white rounded-lg px-6 py-3" to="/rooms">Find a room</Link><button onClick={logout} className="block underline">Sign out</button></div>:<p role="status">Loading account…</p>}</section>;
}
