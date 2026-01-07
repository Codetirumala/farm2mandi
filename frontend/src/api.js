import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000/api';

const client = axios.create({
  baseURL: API_BASE,
  withCredentials: true // include cookies in requests
});

export async function register(data) {
  const res = await client.post('/auth/register', data);
  return res.data;
}
export async function login(data) {
  const res = await client.post('/auth/login', data);
  return res.data;
}
export async function logout() {
  const res = await client.post('/auth/logout');
  return res.data;
}
export async function predict(data) {
  const res = await client.post('/predict', data);
  return res.data;
}
export async function transportOptions(data) {
  const res = await client.post('/transport-options', data);
  return res.data;
}
export async function track(vehicleId) {
  const res = await client.get(`/track/${vehicleId}`);
  return res.data;
}

export async function getProfile() {
  const res = await client.get('/auth/me');
  return res.data;
}

export async function updateProfile(data) {
  const res = await client.put('/auth/me', data);
  return res.data;
}

export async function changePassword(body) {
  const res = await client.post('/auth/change-password', body);
  return res.data;
}

export async function forgotOtp(body) {
  const res = await client.post('/auth/forgot', body);
  return res.data;
}

export async function resetWithOtp(body) {
  const res = await client.post('/auth/reset-otp', body);
  return res.data;
}
