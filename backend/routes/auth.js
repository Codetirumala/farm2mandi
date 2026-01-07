const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Farmer = require('../models/Farmer');
const { requireAuth } = require('../middleware/authMiddleware');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me';

// Register (creates a farmer)
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, phone, village, district, state, pincode, aadhar, farm_size, crops } = req.body;
    if (!name || !email || !password) return res.status(400).json({ error: 'name, email and password required' });

    const existing = await Farmer.findOne({ email });
    if (existing) return res.status(409).json({ error: 'User already exists' });

    const hashed = await bcrypt.hash(password, 10);
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

    // Set token in HTTP-only cookie (7 days)
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.json({ user: { id: farmer._id, name: farmer.name, email: farmer.email, role: farmer.role } });
  } catch (err) {
    console.error('Register error', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'email and password required' });
    const farmer = await Farmer.findOne({ email });
    if (!farmer) return res.status(401).json({ error: 'Invalid credentials' });
    const ok = await bcrypt.compare(password, farmer.password);
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' });
    const token = jwt.sign({ id: farmer._id, email: farmer.email, role: farmer.role }, JWT_SECRET, { expiresIn: '7d' });
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });
    res.json({ user: { id: farmer._id, name: farmer.name, email: farmer.email, role: farmer.role } });
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
    const farmer = await Farmer.findOne({ email });
    if (!farmer) return res.status(404).json({ error: 'No such user' });

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
    farmer.resetOtp = otp;
    farmer.resetOtpExpires = new Date(expires);
    await farmer.save();

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
          to: farmer.email,
          subject: 'Farm2Mandi password reset OTP',
          text: `Your password reset OTP is: ${otp}. It expires in 15 minutes.`
        };
        await transporter.sendMail(mailOpts);
      } catch (mailErr) {
        console.error('Failed to send reset OTP email', mailErr);
      }
    } else {
      // no mail configured - log OTP for development
      console.log(`Password reset OTP for ${farmer.email}: ${otp} (expires ${new Date(expires).toISOString()})`);
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
    const farmer = await Farmer.findById(req.user._id);
    if (!farmer) return res.status(404).json({ error: 'User not found' });
    const ok = await bcrypt.compare(oldPassword, farmer.password);
    if (!ok) return res.status(401).json({ error: 'Old password incorrect' });
    farmer.password = await bcrypt.hash(newPassword, 10);
    await farmer.save();
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

    const farmer = await Farmer.findOne({ email });
    if (!farmer) return res.status(404).json({ error: 'No such user' });

    if (!farmer.resetOtp || !farmer.resetOtpExpires) return res.status(400).json({ error: 'No OTP requested' });
    if (new Date() > new Date(farmer.resetOtpExpires)) return res.status(400).json({ error: 'OTP expired' });
    if (String(otp).trim() !== String(farmer.resetOtp).trim()) return res.status(400).json({ error: 'Invalid OTP' });

    farmer.password = await bcrypt.hash(newPassword, 10);
    farmer.resetOtp = undefined;
    farmer.resetOtpExpires = undefined;
    await farmer.save();

    // Optionally sign-in user by setting cookie
    const token = jwt.sign({ id: farmer._id, email: farmer.email, role: farmer.role }, JWT_SECRET, { expiresIn: '7d' });
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.json({ message: 'Password reset successful' });
  } catch (err) {
    console.error('Reset OTP error', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
