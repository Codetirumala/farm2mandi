import React from 'react';
import BackButton from '../components/BackButton';

export default function MapView(){
  // Placeholder map view. Integrate Leaflet/Google Maps later.
  return (
    <div>
      <BackButton />
      <h2>Map View (placeholder)</h2>
      <div className="card">Map integration not added yet. Use react-leaflet or Google Maps API to show mandi locations.</div>
    </div>
  );
}
