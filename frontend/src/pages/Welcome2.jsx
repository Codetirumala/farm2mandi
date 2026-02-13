import React from 'react';
import { Link } from 'react-router-dom';
import BackButton from '../components/BackButton';

export default function Welcome2(){
  return (
    <div>
      <BackButton />
      <h2>Welcome</h2>
      <p>Proceed to input produce details and get mandi recommendations.</p>
      <p><Link to="/input">Go to Input Page</Link></p>
    </div>
  );
}
