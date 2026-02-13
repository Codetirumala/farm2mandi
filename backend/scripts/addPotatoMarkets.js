/**
 * Add Potato markets to the database
 */
const mongoose = require('mongoose');
require('dotenv').config();

const Mandi = require('../models/Mandi');

async function addPotatoMarkets() {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/farm2mandi';
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    // Potato markets in Andhra Pradesh
    const potatoMarkets = [
      {
        name: 'Madanapalli APMC',
        district: 'Chittoor', 
        state: 'Andhra Pradesh',
        commodity: 'Potato',
        commodities: ['Potato', 'Tomato', 'Onion'],
        latitude: 13.5503,
        longitude: 78.5026
      },
      {
        name: 'Palamaneru APMC',
        district: 'Chittoor',
        state: 'Andhra Pradesh', 
        commodity: 'Potato',
        commodities: ['Potato', 'Vegetables', 'Groundnut'],
        latitude: 13.2072,
        longitude: 78.7413
      },
      {
        name: 'Kurnool APMC',
        district: 'Kurnool',
        state: 'Andhra Pradesh',
        commodity: 'Potato', 
        commodities: ['Potato', 'Rice', 'Groundnut', 'Cotton'],
        latitude: 15.8281,
        longitude: 78.0373
      },
      {
        name: 'Nandyal APMC',
        district: 'Nandyal', 
        state: 'Andhra Pradesh',
        commodity: 'Potato',
        commodities: ['Potato', 'Rice', 'Maize', 'Cotton'],
        latitude: 15.4776,
        longitude: 78.4844
      },
      {
        name: 'Tirupati APMC',
        district: 'Tirupati',
        state: 'Andhra Pradesh',
        commodity: 'Potato',
        commodities: ['Potato', 'Rice', 'Mango', 'Banana'], 
        latitude: 13.6288,
        longitude: 79.4192
      },
      {
        name: 'Chittoor APMC',
        district: 'Chittoor',
        state: 'Andhra Pradesh',
        commodity: 'Potato',
        commodities: ['Potato', 'Mango', 'Groundnut', 'Rice'],
        latitude: 13.2172,
        longitude: 79.1003
      }
    ];

    console.log('Adding Potato markets...');

    // Remove existing potato markets to avoid duplicates
    await Mandi.deleteMany({ 
      state: 'Andhra Pradesh',
      $or: [
        { commodity: /potato/i },
        { commodities: { $regex: /potato/i } }
      ]
    });

    // Insert new potato markets
    const result = await Mandi.insertMany(potatoMarkets);
    console.log(`✅ Added ${result.length} Potato markets to database`);

    // Display added markets
    result.forEach(market => {
      console.log(`  - ${market.name} (${market.district})`);
    });

    await mongoose.disconnect();
    console.log('✅ Database seeding completed');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

// Run if script is executed directly
if (require.main === module) {
  addPotatoMarkets();
}

module.exports = { addPotatoMarkets };