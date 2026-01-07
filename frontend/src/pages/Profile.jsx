import React, { useEffect, useState } from 'react';
import { Box, Button, Container, Grid, Paper, TextField, Typography, Alert, CircularProgress } from '@mui/material';
import { getProfile, updateProfile, changePassword } from '../api';

export default function Profile() {
  const [form, setForm] = useState({ name:'', email:'', phone:'', village:'', district:'', state:'', pincode:'', aadhar:'', farm_size:'', crops:'' });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');
  const [pwForm, setPwForm] = useState({ oldPassword:'', newPassword:'' });
  const [pwLoading, setPwLoading] = useState(false);

  useEffect(()=>{
    async function load(){
      setLoading(true);
      try{
        const data = await getProfile();
        const u = data.user;
        setForm({
          name: u.name || '',
          email: u.email || '',
          phone: u.phone || '',
          village: u.village || '',
          district: u.district || '',
          state: u.state || '',
          pincode: u.pincode || '',
          aadhar: u.aadhar || '',
          farm_size: u.farm_size || '',
          crops: Array.isArray(u.crops) ? u.crops.join(', ') : (u.crops || '')
        });
      }catch(e){
        setErr(e.response?.data?.error || e.message || 'Failed to load profile');
      }finally{ setLoading(false); }
    }
    load();
  },[]);

  async function save(e){
    e.preventDefault();
    setErr(''); setMsg(''); setSaving(true);
    try{
      const payload = { ...form };
      // send crops as array or comma string; backend will normalize
      const res = await updateProfile(payload);
      setMsg('Profile saved');
      // update stored user name if changed
      const stored = JSON.parse(localStorage.getItem('user') || 'null');
      if (stored && res.user?.name && res.user.name !== stored.name) {
        localStorage.setItem('user', JSON.stringify({ ...stored, name: res.user.name }));
      }
    }catch(e){
      setErr(e.response?.data?.error || e.message || 'Failed to save');
    }finally{ setSaving(false); }
  }

  async function changePwd(e){
    e.preventDefault();
    setErr(''); setMsg(''); setPwLoading(true);
    try{
      await changePassword(pwForm);
      setMsg('Password changed');
      setPwForm({ oldPassword:'', newPassword:'' });
    }catch(e){
      setErr(e.response?.data?.error || e.message || 'Failed to change password');
    }finally{ setPwLoading(false); }
  }

  if (loading) return (
    <Box sx={{ minHeight:'60vh', display:'flex', alignItems:'center', justifyContent:'center' }}><CircularProgress /></Box>
  );

  return (
    <Box sx={{ minHeight:'80vh', display:'flex', alignItems:'center', justifyContent:'center', py:6 }}>
      <Container maxWidth="md">
        <Paper sx={{ p:4 }} elevation={8}>
          <Typography variant="h5" sx={{ mb:2, fontWeight:700 }}>My profile</Typography>

          {err && <Alert severity="error" sx={{ mb:2 }}>{err}</Alert>}
          {msg && <Alert severity="success" sx={{ mb:2 }}>{msg}</Alert>}

          <Box component="form" onSubmit={save}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField label="Full name" value={form.name} onChange={e=>setForm(f=>({ ...f, name:e.target.value }))} fullWidth required />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField label="Email" value={form.email} fullWidth disabled />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField label="Phone" value={form.phone} onChange={e=>setForm(f=>({ ...f, phone:e.target.value }))} fullWidth />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField label="Aadhar" value={form.aadhar} onChange={e=>setForm(f=>({ ...f, aadhar:e.target.value }))} fullWidth />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField label="Village" value={form.village} onChange={e=>setForm(f=>({ ...f, village:e.target.value }))} fullWidth />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField label="District" value={form.district} onChange={e=>setForm(f=>({ ...f, district:e.target.value }))} fullWidth />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField label="State" value={form.state} onChange={e=>setForm(f=>({ ...f, state:e.target.value }))} fullWidth />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField label="Pincode" value={form.pincode} onChange={e=>setForm(f=>({ ...f, pincode:e.target.value }))} fullWidth />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField label="Farm size (acres)" value={form.farm_size} onChange={e=>setForm(f=>({ ...f, farm_size:e.target.value }))} fullWidth />
              </Grid>

              <Grid item xs={12}>
                <TextField label="Crops (comma separated)" value={form.crops} onChange={e=>setForm(f=>({ ...f, crops:e.target.value }))} fullWidth />
              </Grid>

              <Grid item xs={12} sx={{ display:'flex', justifyContent:'flex-end' }}>
                <Button type="submit" variant="contained" color="primary" disabled={saving}>{saving ? <CircularProgress size={20} color="inherit"/> : 'Save profile'}</Button>
              </Grid>
            </Grid>
          </Box>

          <Box sx={{ mt:4 }}>
            <Typography variant="h6" sx={{ mb:1 }}>Change password</Typography>
            <Box component="form" onSubmit={changePwd} sx={{ display:'grid', gap:2 }}>
              <TextField label="Current password" value={pwForm.oldPassword} type="password" onChange={e=>setPwForm(p=>({ ...p, oldPassword:e.target.value }))} fullWidth />
              <TextField label="New password" value={pwForm.newPassword} type="password" onChange={e=>setPwForm(p=>({ ...p, newPassword:e.target.value }))} fullWidth />
              <Box sx={{ display:'flex', justifyContent:'flex-end' }}>
                <Button type="submit" variant="outlined" disabled={pwLoading}>{pwLoading ? <CircularProgress size={18} /> : 'Change password'}</Button>
              </Box>
            </Box>
          </Box>

        </Paper>
      </Container>
    </Box>
  );
}
