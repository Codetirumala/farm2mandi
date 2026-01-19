import React, { useState, useEffect } from 'react';
import { predict } from '../api';
import { useNavigate } from 'react-router-dom';

export default function InputPage(){
  const [form, setForm] = useState({ 
    commodity: 'Wheat', 
    date: new Date().toISOString().split('T')[0], 
    lat: '',
    lng: '',
    quantity: '1000'
  });
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);
  const [locationStatus, setLocationStatus] = useState('');
  const nav = useNavigate();

  // Get user's location using browser geolocation API
  useEffect(() => {
    if (navigator.geolocation) {
      setLocationStatus('Getting your location...');
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setForm(prev => ({
            ...prev,
            lat: position.coords.latitude.toFixed(6),
            lng: position.coords.longitude.toFixed(6)
          }));
          setLocationStatus('Location detected ✓');
        },
        (error) => {
          setLocationStatus('Please enter coordinates manually');
          console.error('Geolocation error:', error);
        }
      );
    } else {
      setLocationStatus('Geolocation not supported. Please enter coordinates manually.');
    }
  }, []);

  async function submit(e){
    e.preventDefault();
    setErr('');
    setLoading(true);

    // Validation
    if (!form.commodity) {
      setErr('Please select a commodity');
      setLoading(false);
      return;
    }
    if (!form.date) {
      setErr('Please select a date');
      setLoading(false);
      return;
    }
    if (!form.lat || !form.lng) {
      setErr('Please provide latitude and longitude coordinates');
      setLoading(false);
      return;
    }

    const lat = parseFloat(form.lat);
    const lng = parseFloat(form.lng);

    if (isNaN(lat) || isNaN(lng)) {
      setErr('Invalid latitude/longitude coordinates');
      setLoading(false);
      return;
    }

    if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      setErr('Latitude must be between -90 and 90, Longitude between -180 and 180');
      setLoading(false);
      return;
    }

    try{
      const data = await predict({
        commodity: form.commodity,
        date: form.date,
        lat: lat,
        lng: lng,
        quantity: form.quantity || '1000'
      });
      // store result temporarily and navigate
      localStorage.setItem('lastPrediction', JSON.stringify({ 
        input: form, 
        result: data 
      }));
      nav('/recommendation');
    }catch(e){
      setErr(e.response?.data?.error || e.message || 'An error occurred');
      setLoading(false);
    }
  }

  return (
    <div className="form card">
      <h2>Input Produce Details</h2>
      {err && <div className="card" style={{color: 'red'}}>{err}</div>}
      {locationStatus && (
        <div className="card" style={{fontSize: '0.9em', color: locationStatus.includes('✓') ? 'green' : '#666'}}>
          {locationStatus}
        </div>
      )}
      <form onSubmit={submit}>
        <label>
          Commodity:
          <select 
            value={form.commodity} 
            onChange={e=>setForm({...form,commodity:e.target.value})}
            required
          >
            <option value="Wheat">Wheat</option>
            <option value="Rice">Rice</option>
            <option value="Maize">Maize</option>
            <option value="Tomato">Tomato</option>
            <option value="Potato">Potato</option>
            <option value="Onion">Onion</option>
          </select>
        </label>
        
        <label>
          Date:
          <input 
            type="date" 
            value={form.date} 
            onChange={e=>setForm({...form,date:e.target.value})}
            required
          />
        </label>

        <label>
          Quantity (kg):
          <input 
            type="number" 
            placeholder="1000" 
            value={form.quantity} 
            onChange={e=>setForm({...form,quantity:e.target.value})}
            min="1"
            required
          />
        </label>

        <div style={{display: 'flex', gap: '10px', flexWrap: 'wrap'}}>
          <label style={{flex: 1, minWidth: '150px'}}>
            Latitude:
            <input 
              type="number" 
              step="0.000001"
              placeholder="28.7041" 
              value={form.lat} 
              onChange={e=>setForm({...form,lat:e.target.value})}
              required
            />
          </label>
          <label style={{flex: 1, minWidth: '150px'}}>
            Longitude:
            <input 
              type="number" 
              step="0.000001"
              placeholder="77.1025" 
              value={form.lng} 
              onChange={e=>setForm({...form,lng:e.target.value})}
              required
            />
          </label>
        </div>

        <small style={{color: '#666', display: 'block', marginTop: '-10px', marginBottom: '10px'}}>
          Your coordinates will be used to calculate distance to mandis
        </small>

        <button type="submit" disabled={loading}>
          {loading ? 'Predicting...' : 'Predict & Recommend'}
        </button>
      </form>
    </div>
  );
}
