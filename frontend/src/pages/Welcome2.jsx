import React from 'react';
import { Link } from 'react-router-dom';
import BackButton from '../components/BackButton';
import { useLanguage } from '../context/LanguageContext';

export default function Welcome2(){
  const { t } = useLanguage();
  return (
    <div>
      <BackButton />
      <h2>{t('welcome')}</h2>
      <p>{t('farm2mandiDesc')}</p>
      <p><Link to="/input">{t('goToInput')}</Link></p>
    </div>
  );
}
