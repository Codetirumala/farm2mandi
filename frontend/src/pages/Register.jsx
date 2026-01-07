import React, { useState, useEffect } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { Avatar, Box, Button, Container, Grid, Paper, TextField, Typography, Alert, CircularProgress, Grow, Link } from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { register } from '../api';
import { getProfile } from '../api';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  useEffect(() => {
    // If there's a user saved in localStorage we should verify it with the server
    // because localStorage can be stale. If verification fails remove the entry so
    // the register page remains accessible.
    let mounted = true;
    const stored = localStorage.getItem('user');
    if (stored) {
      getProfile().then(() => {
        if (!mounted) return;
        nav('/');
      }).catch(() => {
        localStorage.removeItem('user');
      });
      return () => { mounted = false; };
    }

    // No local user; verify session cookie silently and redirect if active
    getProfile().then(() => {
      if (!mounted) return;
      nav('/');
    }).catch(() => {});
    return () => { mounted = false; };
  }, [nav]);

  async function submit(e) {
    e.preventDefault();
    setErr('');
    setLoading(true);
    try {
      const data = await register(form);
      localStorage.setItem('user', JSON.stringify(data.user));
      setLoading(false);
      nav('/welcome2');
    } catch (e) {
      setLoading(false);
      setErr(e.response?.data?.error || e.message || 'Registration failed');
    }
  }

  return (
    <Box sx={{ minHeight:'80vh', display:'flex', alignItems:'center', justifyContent:'center', py:6,
      backgroundColor: '#ecf9ef',
      backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.03) 1px, transparent 1px)` ,
      backgroundSize: '40px 40px'
    }}>
      <Grow in={true} timeout={600}>
        <Container maxWidth="sm">
          <Paper elevation={12} sx={{ p:5, borderRadius:2, boxShadow: '0 18px 40px rgba(8,30,15,0.18)' }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item>
                <Avatar sx={{ bgcolor:'primary.main', width:56, height:56 }}>
                  <PersonAddIcon sx={{ fontSize:28 }} />
                </Avatar>
              </Grid>
              <Grid item xs>
                <Typography variant="h5" sx={{ fontWeight:800 }}>Create account</Typography>
                <Typography variant="body2" color="text.secondary">Sign up to get mandi recommendations and transport options</Typography>
              </Grid>
            </Grid>

            {err && <Alert severity="error" sx={{ mt:2 }}>{err}</Alert>}

            <Box component="form" onSubmit={submit} sx={{ mt:3 }}>
              <TextField
                label="Full name"
                name="name"
                value={form.name}
                onChange={e=>setForm(f=>({ ...f, name:e.target.value }))}
                fullWidth
                required
                margin="normal"
              />

              <TextField
                label="Email"
                name="email"
                value={form.email}
                onChange={e=>setForm(f=>({ ...f, email:e.target.value }))}
                fullWidth
                required
                type="email"
                margin="normal"
              />

              <TextField
                label="Password"
                name="password"
                value={form.password}
                onChange={e=>setForm(f=>({ ...f, password:e.target.value }))}
                fullWidth
                required
                type={'password'}
                margin="normal"
              />

              <Button type="submit" variant="contained" fullWidth sx={{ mt:3, py:1.5, backgroundColor:'#2e7d32', color:'#fff', fontWeight:700, textTransform:'uppercase' }} disabled={loading}>
                {loading ? <CircularProgress size={20} color="inherit" /> : 'Create account'}
              </Button>
            </Box>

            <Box sx={{ mt:3, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <Link component={RouterLink} to="/login" variant="body2" sx={{ color:'primary.main' }}>Already have an account? Sign in</Link>
            </Box>
          </Paper>
        </Container>
      </Grow>
    </Box>
  );
}
