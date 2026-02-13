import React, { useState, useEffect } from 'react';
import { predict } from '../api';
import { useNavigate } from 'react-router-dom';
import BackButton from '../components/BackButton';
import { useLanguage } from '../context/LanguageContext';

export default function InputPage(){
  const [form, setForm] = useState({ 
    commodity: 'Wheat', 
    date: new Date().toISOString().split('T')[0], 
    lat: '',
    lng: '',
    quantity: '10'
  });
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);
  const [locationStatus, setLocationStatus] = useState('');
  const nav = useNavigate();
  const { t } = useLanguage();

  // Get user's location using browser geolocation API
  useEffect(() => {
    if (navigator.geolocation) {
      setLocationStatus(t('gettingLocation'));
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setForm(prev => ({
            ...prev,
            lat: position.coords.latitude.toFixed(6),
            lng: position.coords.longitude.toFixed(6)
          }));
          setLocationStatus(t('locationDetected'));
        },
        (error) => {
          setLocationStatus(t('enterCoordinates'));
          console.error('Geolocation error:', error);
        }
      );
    } else {
      setLocationStatus(t('geolocationNotSupported'));
    }
  }, []);

  async function submit(e){
    e.preventDefault();
    setErr('');
    setLoading(true);

    // Validation
    if (!form.commodity) {
      setErr(t('selectCommodity'));
      setLoading(false);
      return;
    }
    if (!form.date) {
      setErr(t('selectDate'));
      setLoading(false);
      return;
    }
    if (!form.lat || !form.lng) {
      setErr(t('provideCoordinates'));
      setLoading(false);
      return;
    }

    const lat = parseFloat(form.lat);
    const lng = parseFloat(form.lng);

    if (isNaN(lat) || isNaN(lng)) {
      setErr(t('invalidCoordinates'));
      setLoading(false);
      return;
    }

    if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      setErr(t('coordinateRange'));
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
      <BackButton />
      <h2>{t('inputTitle')}</h2>
      {err && <div className="card" style={{color: 'red'}}>{err}</div>}
      {locationStatus && (
        <div className="card" style={{fontSize: '0.9em', color: locationStatus.includes('✓') ? 'green' : '#666'}}>
          {locationStatus}
        </div>
      )}
      <form onSubmit={submit}>
        <label>
          {t('commodity') + ':'}
          <select 
            value={form.commodity} 
            onChange={e=>setForm({...form,commodity:e.target.value})}
            required
          >
            <option value="Rice">{t('Rice')}</option>
            <option value="Banana">{t('Banana')}</option>
            <option value="Cotton">{t('Cotton')}</option>
            <option value="Tomato">{t('Tomato')}</option>
            <option value="Potato">{t('Potato')}</option>
            <option value="Groundnut">{t('Groundnut')}</option>
            <option value="Maize">{t('Maize')}</option>
            <option value="Mango">{t('Mango')}</option>
            <option value="Turmeric">{t('Turmeric')}</option>
            <option value="Wheat">{t('Wheat')}</option>
            <option value="Onion">{t('Onion')}</option>
            <option value="Green Chilli">{t('Green Chilli')}</option>
            <option value="Brinjal">{t('Brinjal')}</option>
            <option value="Papaya">{t('Papaya')}</option>
            <option value="Jowar">{t('Jowar')}</option>
            <option value="Arhar">{t('Arhar')}</option>
            <option value="Bajra">{t('Bajra')}</option>
            <option value="Black Gram Dal">{t('Black Gram Dal')}</option>
          </select>
        </label>
        
        <label>
          {t('date') + ':'}
          <input 
            type="date" 
            value={form.date} 
            onChange={e=>setForm({...form,date:e.target.value})}
            required
          />
        </label>

        <label>
          {t('quantityLabel') + ':'}
          <input 
            type="number" 
            placeholder="10" 
            value={form.quantity} 
            onChange={e=>setForm({...form,quantity:e.target.value})}
            min="1"
            step="0.1"
            required
          />
        </label>

        <div style={{display: 'flex', gap: '10px', flexWrap: 'wrap'}}>
          <label style={{flex: 1, minWidth: '150px'}}>
            {t('latitude') + ':'}
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
            {t('longitude') + ':'}
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
          {t('coordinatesHelp')}
        </small>

        <button type="submit" disabled={loading}>
          {loading ? t('predicting') : t('predictButton')}
        </button>
      </form>
    </div>
  );
}
