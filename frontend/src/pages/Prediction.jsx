import React from 'react';
import BackButton from '../components/BackButton';

export default function Prediction(){
  const data = JSON.parse(localStorage.getItem('lastPrediction') || 'null');
  if (!data) return <div className="card"><BackButton />No prediction data. Go to Input page.</div>;
  return (
    <div>
      <BackButton />
      <h2>Prediction</h2>
      <div className="card">Crop: {data.input.crop}</div>
      <div className="card">Predicted Price: {data.result.predictedPrice}</div>
    </div>
  );
}
