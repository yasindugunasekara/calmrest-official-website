import { useEffect, useState } from 'react';
import api from '../../services/api';
type Settings = { hotelName:string; phone:string; address:string; email:string; website:string; onlineBooking:boolean; autoConfirm:boolean; emailNotifications:boolean; checkInTime:string; checkOutTime:string; smtpConfigured?:boolean; notificationEmail?:string; failedEmails?:number };
export default function SettingsPage() {
 const [settings,setSettings]=useState<Settings|null>(null);
 const [message,setMessage]=useState(''); const [saving,setSaving]=useState(false);
 const load=()=>api.get('/settings').then(({data})=>setSettings(data));
 useEffect(()=>{load().catch(()=>setMessage('Unable to load settings. Please reload.'));},[]);
 async function save(e:React.FormEvent) {e.preventDefault();setSaving(true);setMessage('');try {await api.put('/settings',settings);await load();setMessage('Settings saved.');}catch(error){setMessage((error as {response?:{data?:{error?:string}}}).response?.data?.error || 'Unable to save settings.');}finally{setSaving(false);}}
 if(!settings) return <p role="status">{message || 'Loading settings…'}</p>;
 const update=(key:keyof Settings,value:string|boolean)=>setSettings({...settings,[key]:value});
 return <form onSubmit={save} className="max-w-3xl space-y-6"><h1 className="text-2xl font-bold">Hotel settings</h1>
 <div className="bg-white p-6 rounded-xl border space-y-4">
 {(['hotelName','phone','address','email','website','checkInTime','checkOutTime'] as const).map(key=><label key={key} className="block text-sm font-medium">{{hotelName:'Hotel name',phone:'Phone',address:'Address',email:'Contact email',website:'Website',checkInTime:'Check-in time',checkOutTime:'Check-out time'}[key]}<input className="block border rounded-lg p-3 w-full mt-1" type={key.includes('Time')?'time':key==='email'?'email':key==='website'?'url':'text'} required={key==='hotelName'||key.includes('Time')} maxLength={300} value={settings[key]} onChange={e=>update(key,e.target.value)}/></label>)}
 {(['onlineBooking','autoConfirm','emailNotifications'] as const).map(key=><label key={key} className="flex gap-3 items-center"><input type="checkbox" checked={settings[key]} onChange={e=>update(key,e.target.checked)}/>{{onlineBooking:'Accept online bookings',autoConfirm:'Automatically confirm new bookings',emailNotifications:'Send guest confirmation emails'}[key]}</label>)}
 </div><div className="bg-white p-6 rounded-xl border space-y-3"><h2 className="font-bold">Owner email notifications</h2><p>New bookings and questions: {settings.notificationEmail}</p><p>SMTP: {settings.smtpConfigured?'Configured':'Missing credentials'}. Pending or failed emails: {settings.failedEmails ?? 0}</p><button className="border rounded-lg px-4 py-2" type="button" disabled={saving} onClick={async()=>{setSaving(true);try{const {data}=await api.post('/settings/retry-emails');await load();setMessage(data.remaining ? `${data.remaining} emails still need delivery. Check SMTP credentials.`:'Email queue delivered.');}catch{setMessage('Retry failed. Please try again.');}finally{setSaving(false);}}}>Retry email delivery</button></div>
 {message && <p role="status">{message}</p>}<button disabled={saving} className="bg-slate-900 text-white rounded-lg px-6 py-3">{saving?'Saving…':'Save settings'}</button></form>;
}
