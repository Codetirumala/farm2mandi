import React, { useState } from 'react';
import { Container, Box, Typography, TextField, Button, Grid, Alert } from '@mui/material';
import BackButton from '../components/BackButton';

export default function Contact(){
  const [form, setForm] = useState({ name:'', email:'', phone:'', message:'' });
  const [status, setStatus] = useState(null);

  function handleChange(e){
    setForm(f=>({ ...f, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e){
    e.preventDefault();
    // For now just show a success message. Integrate backend API to store/send messages.
    setStatus({ type:'success', msg:'Thanks — your message has been received. We will respond shortly.' });
    setForm({ name:'', email:'', phone:'', message:'' });
  }

  return (
    <Box sx={{ py:8 }}>
      <Container maxWidth="md">
        <BackButton />
        <Typography variant="h4" sx={{ fontWeight:700, mb:2 }}>Contact us</Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Have a question or need help using Farm2Mandi? Send us a message and our team will get back to you.
        </Typography>

        {status && <Alert severity={status.type} sx={{ mb:2 }}>{status.msg}</Alert>}

        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField label="Name" name="name" value={form.name} onChange={handleChange} fullWidth required />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Email" name="email" type="email" value={form.email} onChange={handleChange} fullWidth required />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Phone" name="phone" value={form.phone} onChange={handleChange} fullWidth />
            </Grid>
            <Grid item xs={12}>
              <TextField label="Message" name="message" value={form.message} onChange={handleChange} fullWidth multiline rows={4} required />
            </Grid>
            <Grid item xs={12}>
              <Button type="submit" variant="contained">Send message</Button>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Box>
  );
}
