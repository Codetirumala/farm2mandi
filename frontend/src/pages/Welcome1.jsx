import React from 'react';
import { Link } from 'react-router-dom';
import BackButton from '../components/BackButton';

export default function Welcome1() {
  return (
    <div>
      <BackButton />
      <h1>Farm2Mandi</h1>
      <p>AI-driven mandi recommendation and transport assistance for farmers.</p>
      <p>
        <Link to="/register">Register</Link> | <Link to="/login">Login</Link>
      </p>
    </div>
  );
}
