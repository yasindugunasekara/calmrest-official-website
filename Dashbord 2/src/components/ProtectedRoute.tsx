import { useEffect, useState, type ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import api from '../../services/api';
export default function ProtectedRoute({ children }: { children: ReactNode }) {
 const [state,setState] = useState<'loading'|'allowed'|'denied'>('loading');
 useEffect(() => { let active=true;
  api.get('/auth/me').then(({data})=>{ if(active) setState(data.user.role === 'admin' ? 'allowed' : 'denied'); }).catch(()=>{ if(active) setState('denied'); });
  return ()=>{active=false;};
 },[]);
 if(state==='loading') return <p className="p-8" role="status">Checking your session…</p>;
 return state==='allowed' ? <>{children}</> : <Navigate to="/login" replace />;
}
