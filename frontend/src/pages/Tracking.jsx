import React, { useState } from 'react';
import { track } from '../api';
import BackButton from '../components/BackButton';

export default function Tracking(){
  const [id, setId] = useState('');
  const [timeline, setTimeline] = useState(null);
  const [err, setErr] = useState('');

  async function submit(e){
    e.preventDefault();
    try{
      const res = await track(id);
      setTimeline(res.timeline);
    }catch(e){
      setErr(e.response?.data?.error || e.message);
    }
  }

  return (
    <div className="form card">
      <BackButton />
      <h2>Track Vehicle</h2>
      <form onSubmit={submit}>
        <input placeholder="Vehicle ID" value={id} onChange={e=>setId(e.target.value)} />
        <button type="submit">Track</button>
      </form>
      {err && <div className="card">{err}</div>}
      {timeline && timeline.map((t,i)=> (
        <div key={i} className="card">{new Date(t.timestamp).toLocaleString()} — {t.lat}, {t.lon}</div>
      ))}
    </div>
  );
}
