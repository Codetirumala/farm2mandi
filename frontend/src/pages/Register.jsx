import React, { useState, useEffect } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { Avatar, Box, Button, Container, Grid, Paper, TextField, Typography, Alert, CircularProgress, Grow, Link, FormControl, InputLabel, Select, MenuItem, ToggleButtonGroup, ToggleButton } from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { register } from '../api';
import { getProfile } from '../api';

export default function Register() {
  const [role, setRole] = useState('farmer');
  const [form, setForm] = useState({ 
    name: '', 
    email: '', 
    password: '',
    phone: '',
    // Farmer fields
    village: '',
    district: '',
    state: '',
    pincode: '',
    aadhar: '',
    farm_size: '',
    crops: '',
    // Driver fields
    driverId: '',
    vehicleType: '',
    vehicleNumber: '',
    vehicleCapacityKg: '',
    currentMandal: '',
    costPerKm: ''
  });
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  useEffect(() => {
    // If you want to block registration for logged-in users, uncomment below:
    // let mounted = true;
    // const stored = localStorage.getItem('user');
    // if (stored) {
    //   getProfile().then(() => {
    //     if (!mounted) return;
    //     nav('/');
    //   }).catch(() => {
    //     localStorage.removeItem('user');
    //   });
    //   return () => { mounted = false; };
    // }
    // getProfile().then(() => {
    //   if (!mounted) return;
    //   nav('/');
    // }).catch(() => {});
    // return () => { mounted = false; };
    // By default, do not redirect. Only do so if you want to block access for logged-in users.
  }, [nav]);

  async function submit(e) {
    e.preventDefault();
    setErr('');
    setLoading(true);
    try {
      const submitData = {
        role,
        name: form.name,
        email: form.email,
        password: form.password,
        phone: form.phone
      };

      if (role === 'farmer') {
        submitData.village = form.village;
        submitData.district = form.district;
        submitData.state = form.state;
        submitData.pincode = form.pincode;
        submitData.aadhar = form.aadhar;
        submitData.farm_size = form.farm_size ? Number(form.farm_size) : null;
        submitData.crops = form.crops;
      } else {
        submitData.driverId = form.driverId;
        submitData.vehicleType = form.vehicleType;
        submitData.vehicleNumber = form.vehicleNumber;
        submitData.vehicleCapacityKg = Number(form.vehicleCapacityKg);
        submitData.currentMandal = form.currentMandal;
        submitData.costPerKm = Number(form.costPerKm);
      }

      const data = await register(submitData);
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
              {/* Role Selection */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" sx={{ mb: 1, fontWeight: 600 }}>I am a:</Typography>
                <ToggleButtonGroup
                  value={role}
                  exclusive
                  onChange={(e, newRole) => newRole && setRole(newRole)}
                  fullWidth
                  sx={{ mb: 2 }}
                >
                  <ToggleButton value="farmer" sx={{ py: 1.5, fontWeight: 600 }}>
                    Farmer
                  </ToggleButton>
                  <ToggleButton value="driver" sx={{ py: 1.5, fontWeight: 600 }}>
                    Driver
                  </ToggleButton>
                </ToggleButtonGroup>
              </Box>

              {/* Common Fields */}
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
                type="password"
                margin="normal"
              />

              <TextField
                label="Phone"
                name="phone"
                value={form.phone}
                onChange={e=>setForm(f=>({ ...f, phone:e.target.value }))}
                fullWidth
                required
                margin="normal"
              />

              {/* Driver-specific Fields */}
              {role === 'driver' && (
                <>
                  <TextField
                    label="Driver ID"
                    name="driverId"
                    value={form.driverId}
                    onChange={e=>setForm(f=>({ ...f, driverId:e.target.value }))}
                    fullWidth
                    required
                    margin="normal"
                    helperText="Unique identifier for driver"
                  />

                  <FormControl fullWidth margin="normal" required>
                    <InputLabel>Vehicle Type</InputLabel>
                    <Select
                      value={form.vehicleType}
                      onChange={e=>setForm(f=>({ ...f, vehicleType:e.target.value }))}
                      label="Vehicle Type"
                    >
                      <MenuItem value="Mini Truck">Mini Truck</MenuItem>
                      <MenuItem value="Pickup Van">Pickup Van</MenuItem>
                      <MenuItem value="Tractor">Tractor</MenuItem>
                      <MenuItem value="Lorry">Lorry</MenuItem>
                      <MenuItem value="Container">Container</MenuItem>
                    </Select>
                  </FormControl>

                  <TextField
                    label="Vehicle Number"
                    name="vehicleNumber"
                    value={form.vehicleNumber}
                    onChange={e=>setForm(f=>({ ...f, vehicleNumber:e.target.value }))}
                    fullWidth
                    required
                    margin="normal"
                  />

                  <TextField
                    label="Vehicle Capacity (kg)"
                    name="vehicleCapacityKg"
                    value={form.vehicleCapacityKg}
                    onChange={e=>setForm(f=>({ ...f, vehicleCapacityKg:e.target.value }))}
                    fullWidth
                    required
                    type="number"
                    margin="normal"
                  />

                  <TextField
                    label="Current Mandal"
                    name="currentMandal"
                    value={form.currentMandal}
                    onChange={e=>setForm(f=>({ ...f, currentMandal:e.target.value }))}
                    fullWidth
                    required
                    margin="normal"
                    helperText="Your current location mandal"
                  />

                  <TextField
                    label="Cost per Kilometer (₹)"
                    name="costPerKm"
                    value={form.costPerKm}
                    onChange={e=>setForm(f=>({ ...f, costPerKm:e.target.value }))}
                    fullWidth
                    required
                    type="number"
                    margin="normal"
                  />
                </>
              )}

              {/* Farmer-specific Fields */}
              {role === 'farmer' && (
                <>
                  <TextField
                    label="Village"
                    name="village"
                    value={form.village}
                    onChange={e=>setForm(f=>({ ...f, village:e.target.value }))}
                    fullWidth
                    margin="normal"
                  />

                  <TextField
                    label="District"
                    name="district"
                    value={form.district}
                    onChange={e=>setForm(f=>({ ...f, district:e.target.value }))}
                    fullWidth
                    margin="normal"
                  />

                  <TextField
                    label="State"
                    name="state"
                    value={form.state}
                    onChange={e=>setForm(f=>({ ...f, state:e.target.value }))}
                    fullWidth
                    margin="normal"
                  />

                  <TextField
                    label="Pincode"
                    name="pincode"
                    value={form.pincode}
                    onChange={e=>setForm(f=>({ ...f, pincode:e.target.value }))}
                    fullWidth
                    margin="normal"
                  />

                  <TextField
                    label="Aadhar Number"
                    name="aadhar"
                    value={form.aadhar}
                    onChange={e=>setForm(f=>({ ...f, aadhar:e.target.value }))}
                    fullWidth
                    margin="normal"
                  />

                  <TextField
                    label="Farm Size (acres)"
                    name="farm_size"
                    value={form.farm_size}
                    onChange={e=>setForm(f=>({ ...f, farm_size:e.target.value }))}
                    fullWidth
                    type="number"
                    margin="normal"
                  />

                  <TextField
                    label="Crops (comma-separated)"
                    name="crops"
                    value={form.crops}
                    onChange={e=>setForm(f=>({ ...f, crops:e.target.value }))}
                    fullWidth
                    margin="normal"
                    helperText="e.g., Rice, Wheat, Cotton"
                  />
                </>
              )}

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
