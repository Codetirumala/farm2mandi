import React, { useState, useEffect } from 'react';
import { useNavigate, Link as RouterLink, useLocation } from 'react-router-dom';
import { Avatar, Box, Button, Container, Grid, IconButton, InputAdornment, Link, Paper, TextField, Typography, Alert, CircularProgress, Grow } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { login } from '../api';
import { getProfile } from '../api';
import BackButton from '../components/BackButton';

export default function Login(){
  const [form, setForm] = useState({ email:'', password:'' });
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const nav = useNavigate();
  const location = useLocation();

  // support a ?next=/some/path query param to redirect after login
  const qs = new URLSearchParams(location.search);
  const nextPath = qs.get('next');

  useEffect(() => {
    // If you want to block login for logged-in users, uncomment below:
    // let mounted = true;
    // const stored = localStorage.getItem('user');
    // if (stored) {
    //   getProfile().then(() => {
    //     if (!mounted) return;
    //     if (nextPath && nextPath.startsWith('/')) nav(nextPath); else nav('/');
    //   }).catch(() => {
    //     localStorage.removeItem('user');
    //   });
    //   return () => { mounted = false; };
    // }
    // getProfile().then(() => {
    //   if (!mounted) return;
    //   if (nextPath && nextPath.startsWith('/')) nav(nextPath); else nav('/');
    // }).catch(() => {
    //   // not logged in — show login form
    // });
    // return () => { mounted = false; };
    // By default, do not redirect. Only do so if you want to block access for logged-in users.
  }, [nav, nextPath]);

  async function submit(e){
    e.preventDefault();
    setErr('');
    setLoading(true);
    try{
      const data = await login(form);
      // server stores JWT in an httpOnly cookie; keep minimal user in localStorage
      localStorage.setItem('user', JSON.stringify(data.user));
      setLoading(false);
  // after successful login, navigate to nextPath if provided and safe
    if (nextPath && nextPath.startsWith('/')) nav(nextPath); else nav('/');
    }catch(e){
      setLoading(false);
      setErr(e.response?.data?.error || e.message || 'Login failed');
    }
  }

  return (
    <Box sx={{ minHeight:'80vh', display:'flex', alignItems:'center', justifyContent:'center', py:6,
      backgroundColor: '#ecf9ef',
      // subtle check/grid background made from two repeating linear gradients
      backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.03) 1px, transparent 1px)` ,
      backgroundSize: '40px 40px'
    }}>
      <Grow in={true} timeout={600}>
        <Container maxWidth="sm">
          <BackButton sx={{ mb: 1 }} />
          <Paper elevation={12} sx={{ p:5, borderRadius:2, boxShadow: '0 18px 40px rgba(8,30,15,0.18)' }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item>
                <Avatar sx={{ bgcolor:'primary.main', width:56, height:56 }}>
                  <LockOutlinedIcon sx={{ fontSize:28 }} />
                </Avatar>
              </Grid>
              <Grid item xs>
                <Typography variant="h5" sx={{ fontWeight:800 }}>Welcome back</Typography>
                <Typography variant="body2" color="text.secondary">Sign in to access recommendations and transport options</Typography>
              </Grid>
            </Grid>

            {err && <Alert severity="error" sx={{ mt:2 }}>{err}</Alert>}

            <Box component="form" onSubmit={submit} sx={{ mt:3 }}>
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
                type={show ? 'text' : 'password'}
                margin="normal"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShow(s => !s)} edge="end">
                        {show ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />

              <Box sx={{ display:'flex', justifyContent:'space-between', alignItems:'center', mt:1 }}>
                <Link component={RouterLink} to="/forgot" variant="body2" sx={{ color:'primary.main' }}>Forgot password?</Link>
                <Link component={RouterLink} to="/register" variant="body2" sx={{ color:'primary.main' }}>Create account</Link>
              </Box>

              <Button type="submit" variant="contained" fullWidth sx={{ mt:3, py:1.5, backgroundColor:'#2e7d32', color:'#fff', fontWeight:700, boxShadow:'0 6px 18px rgba(46,125,50,0.28)', textTransform:'uppercase' }} disabled={loading}>
                {loading ? <CircularProgress size={20} color="inherit" /> : 'Sign in'}
              </Button>
            </Box>

            <Box sx={{ mt:3, textAlign:'center' }}>
              <Typography variant="caption" color="text.secondary">By signing in you agree to our Terms and Privacy Policy.</Typography>
            </Box>
          </Paper>
        </Container>
      </Grow>
    </Box>
  );
}
