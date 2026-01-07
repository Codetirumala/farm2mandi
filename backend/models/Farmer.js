const mongoose = require('mongoose');

const FarmerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, index: true },
  password: { type: String, required: true },
  phone: { type: String },
  village: { type: String },
  district: { type: String },
  state: { type: String },
  pincode: { type: String },
  aadhar: { type: String },
  farm_size: { type: Number },
  crops: { type: [String], default: [] },
  // Fields for OTP-based password reset
  resetOtp: { type: String },
  resetOtpExpires: { type: Date },
  role: { type: String, default: 'farmer' },
  isAdmin: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Farmer', FarmerSchema);
