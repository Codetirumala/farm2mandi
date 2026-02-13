import React, { useState } from 'react';
import { Container, Box, Typography, TextField, Button, Grid, Alert } from '@mui/material';
import BackButton from '../components/BackButton';
import { useLanguage } from '../context/LanguageContext';

export default function Contact(){
  const { t } = useLanguage();
  const [form, setForm] = useState({ name:'', email:'', phone:'', message:'' });
  const [status, setStatus] = useState(null);

  function handleChange(e){
    setForm(f=>({ ...f, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e){
    e.preventDefault();
    // For now just show a success message. Integrate backend API to store/send messages.
    setStatus({ type:'success', msg: t('messageSent') });
    setForm({ name:'', email:'', phone:'', message:'' });
  }

  return (
    <Box sx={{ py:8 }}>
      <Container maxWidth="md">
        <BackButton />
        <Typography variant="h4" sx={{ fontWeight:700, mb:2 }}>{t('contactTitle')}</Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          {t('contactDesc')}
        </Typography>

        {status && <Alert severity={status.type} sx={{ mb:2 }}>{status.msg}</Alert>}

        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField label={t('name')} name="name" value={form.name} onChange={handleChange} fullWidth required />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label={t('email')} name="email" type="email" value={form.email} onChange={handleChange} fullWidth required />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label={t('phone')} name="phone" value={form.phone} onChange={handleChange} fullWidth />
            </Grid>
            <Grid item xs={12}>
              <TextField label={t('message')} name="message" value={form.message} onChange={handleChange} fullWidth multiline rows={4} required />
            </Grid>
            <Grid item xs={12}>
              <Button type="submit" variant="contained">{t('sendMessage')}</Button>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Box>
  );
}
