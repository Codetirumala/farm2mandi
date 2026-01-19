const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Farmer = require('../models/Farmer');
const Driver = require('../models/Driver');
const { requireAuth } = require('../middleware/authMiddleware');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me';

// Helper for cookie options (works for both local and production)
function getCookieOptions() {
  const isProd = process.env.NODE_ENV === 'production';
  return {
    httpOnly: true,
    secure: isProd, // true in production, false locally
    sameSite: isProd ? 'none' : 'lax', // 'none' for cross-site in prod, 'lax' locally
    maxAge: 7 * 24 * 60 * 60 * 1000,
  };
}

// Register (creates a farmer or driver based on role)
router.post('/register', async (req, res) => {
  try {
    const { role, name, email, password, phone, village, district, state, pincode, aadhar, farm_size, crops,
            driverId, vehicleType, vehicleNumber, vehicleCapacityKg, currentMandal, costPerKm } = req.body;
    
    if (!name || !email || !password) return res.status(400).json({ error: 'name, email and password required' });
    
    const userRole = role || 'farmer'; // Default to farmer if not specified

    // Check if user exists in either Farmer or Driver collection
    const existingFarmer = await Farmer.findOne({ email });
    const existingDriver = await Driver.findOne({ email });
    if (existingFarmer || existingDriver) return res.status(409).json({ error: 'User already exists' });

    const hashed = await bcrypt.hash(password, 10);

    if (userRole === 'driver') {
      // Driver registration
      if (!driverId || !vehicleType || !vehicleNumber || !vehicleCapacityKg || !currentMandal || !costPerKm) {
        return res.status(400).json({ error: 'Driver registration requires: driverId, vehicleType, vehicleNumber, vehicleCapacityKg, currentMandal, costPerKm' });
      }

      // Check if driverId or vehicleNumber already exists
      const existingDriverId = await Driver.findOne({ driverId });
      const existingVehicle = await Driver.findOne({ vehicleNumber });
      if (existingDriverId) return res.status(409).json({ error: 'Driver ID already exists' });
      if (existingVehicle) return res.status(409).json({ error: 'Vehicle number already registered' });

      const driver = new Driver({
        driverId,
        name,
        email,
        password: hashed,
        phone,
        vehicleType,
        vehicleNumber,
        vehicleCapacityKg,
        currentMandal,
        costPerKm,
        role: 'driver'
      });
      await driver.save();

      const token = jwt.sign({ id: driver._id, email: driver.email, role: driver.role }, JWT_SECRET, { expiresIn: '7d' });
      res.cookie('token', token, getCookieOptions());

      res.json({ user: { id: driver._id, name: driver.name, email: driver.email, role: driver.role } });
    } else {
      // Farmer registration
      const farmer = new Farmer({
        name,
        email,
        password: hashed,
        phone,
        village,
        district,
        state,
        pincode,
        aadhar,
        farm_size: farm_size || null,
        crops: Array.isArray(crops) ? crops : (crops ? [crops] : [])
      });
      await farmer.save();

      const token = jwt.sign({ id: farmer._id, email: farmer.email, role: farmer.role }, JWT_SECRET, { expiresIn: '7d' });
      res.cookie('token', token, getCookieOptions());

      res.json({ user: { id: farmer._id, name: farmer.name, email: farmer.email, role: farmer.role } });
    }
  } catch (err) {
    console.error('Register error', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Login (supports both farmer and driver)
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'email and password required' });
    
    // Check both Farmer and Driver collections
    let user = await Farmer.findOne({ email });
    let userType = 'farmer';
    
    if (!user) {
      user = await Driver.findOne({ email });
      userType = 'driver';
    }
    
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' });
    
    const token = jwt.sign({ id: user._id, email: user.email, role: user.role || userType }, JWT_SECRET, { expiresIn: '7d' });
    res.cookie('token', token, getCookieOptions());
    
    res.json({ user: { id: user._id, name: user.name, email: user.email, role: user.role || userType } });
  } catch (err) {
    console.error('Login error', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Forgot password (OTP) - generate numeric OTP, save it, and (in production) email it
const crypto = require('crypto');
let nodemailer;
try { nodemailer = require('nodemailer'); } catch (e) { nodemailer = null; }

router.post('/forgot', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'email required' });
    
    // Check both Farmer and Driver collections
    let user = await Farmer.findOne({ email });
    if (!user) {
      user = await Driver.findOne({ email });
    }
    if (!user) return res.status(404).json({ error: 'No such user' });

    // generate 6-digit OTP
    const otp = (await new Promise((resolve) => {
      try {
        const n = crypto.randomInt(100000, 1000000);
        resolve(String(n));
      } catch (err) {
        resolve(String(Math.floor(100000 + Math.random() * 900000)));
      }
    }));

    const expires = Date.now() + 15 * 60 * 1000; // 15 minutes
    user.resetOtp = otp;
    user.resetOtpExpires = new Date(expires);
    await user.save();

    // Try to send email if SMTP config exists
    const smtpHost = process.env.SMTP_HOST;
    if (smtpHost && nodemailer) {
      try {
        const transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST,
          port: Number(process.env.SMTP_PORT) || 587,
          secure: process.env.SMTP_SECURE === 'true',
          auth: process.env.SMTP_USER ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } : undefined
        });

        const mailOpts = {
          from: process.env.SMTP_FROM || 'no-reply@farm2mandi.local',
          to: user.email,
          subject: 'Farm2Mandi password reset OTP',
          text: `Your password reset OTP is: ${otp}. It expires in 15 minutes.`
        };
        await transporter.sendMail(mailOpts);
      } catch (mailErr) {
        console.error('Failed to send reset OTP email', mailErr);
      }
    } else {
      // no mail configured - log OTP for development
      console.log(`Password reset OTP for ${user.email}: ${otp} (expires ${new Date(expires).toISOString()})`);
    }

  // Do not return the OTP in the API response. The user must enter the OTP they received by email.
  res.json({ message: 'If an account exists, an OTP was sent to the email (check server logs in dev).' });
  } catch (err) {
    console.error('Forgot OTP error', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Logout - clear cookie
router.post('/logout', (req, res) => {
  res.clearCookie('token', { httpOnly: true, sameSite: 'lax' });
  res.json({ message: 'Logged out' });
});

// Protected: get current user profile
router.get('/me', requireAuth, async (req, res) => {
  try {
    // req.user is populated by requireAuth middleware (without password)
    res.json({ user: req.user });
  } catch (err) {
    console.error('Get profile error', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Protected: update current user profile (non-password fields)
router.put('/me', requireAuth, async (req, res) => {
  try {
    const userRole = req.user.role || 'farmer';
    
    if (userRole === 'driver') {
      // Driver profile update
      const allowed = ['name', 'phone', 'vehicleType', 'vehicleCapacityKg', 'currentMandal', 'costPerKm', 'currentLocation'];
      const updates = {};
      for (const key of allowed) {
        if (req.body[key] !== undefined) updates[key] = req.body[key];
      }
      
      const driver = await Driver.findByIdAndUpdate(req.user._id, { $set: updates }, { new: true }).select('-password');
      res.json({ user: driver });
    } else {
      // Farmer profile update
      const allowed = ['name', 'phone', 'village', 'district', 'state', 'pincode', 'aadhar', 'farm_size', 'crops'];
      const updates = {};
      for (const key of allowed) {
        if (req.body[key] !== undefined) updates[key] = req.body[key];
      }

      // if crops provided as comma string, normalize to array
      if (typeof updates.crops === 'string') {
        updates.crops = updates.crops.split(',').map(s => s.trim()).filter(Boolean);
      }

      const farmer = await Farmer.findByIdAndUpdate(req.user._id, { $set: updates }, { new: true }).select('-password');
      res.json({ user: farmer });
    }
  } catch (err) {
    console.error('Update profile error', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Protected: change password
router.post('/change-password', requireAuth, async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) return res.status(400).json({ error: 'oldPassword and newPassword required' });
    
    const userRole = req.user.role || 'farmer';
    let user;
    
    if (userRole === 'driver') {
      user = await Driver.findById(req.user._id);
    } else {
      user = await Farmer.findById(req.user._id);
    }
    
    if (!user) return res.status(404).json({ error: 'User not found' });
    const ok = await bcrypt.compare(oldPassword, user.password);
    if (!ok) return res.status(401).json({ error: 'Old password incorrect' });
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    res.json({ message: 'Password changed' });
  } catch (err) {
    console.error('Change password error', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Reset password using email + OTP
router.post('/reset-otp', async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    if (!email || !otp || !newPassword) return res.status(400).json({ error: 'email, otp and newPassword required' });

    // Check both Farmer and Driver collections
    let user = await Farmer.findOne({ email });
    if (!user) {
      user = await Driver.findOne({ email });
    }
    if (!user) return res.status(404).json({ error: 'No such user' });

    if (!user.resetOtp || !user.resetOtpExpires) return res.status(400).json({ error: 'No OTP requested' });
    if (new Date() > new Date(user.resetOtpExpires)) return res.status(400).json({ error: 'OTP expired' });
    if (String(otp).trim() !== String(user.resetOtp).trim()) return res.status(400).json({ error: 'Invalid OTP' });

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetOtp = undefined;
    user.resetOtpExpires = undefined;
    await user.save();

    // Optionally sign-in user by setting cookie
    const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    res.cookie('token', token, getCookieOptions());

    res.json({ message: 'Password reset successful' });
  } catch (err) {
    console.error('Reset OTP error', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
