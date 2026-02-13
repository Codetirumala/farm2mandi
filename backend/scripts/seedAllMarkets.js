/**
 * Comprehensive market seeding for all major commodities
 */
const mongoose = require('mongoose');
require('dotenv').config();

const Mandi = require('../models/Mandi');

async function addAllMarkets() {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/farm2mandi';
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    // Comprehensive market data for Andhra Pradesh
    const allMarkets = [
      // Rice Markets
      {
        name: 'Kurnool APMC',
        district: 'Kurnool',
        state: 'Andhra Pradesh',
        commodity: 'Rice',
        commodities: ['Rice', 'Cotton', 'Groundnut', 'Maize'],
        latitude: 15.8281,
        longitude: 78.0373
      },
      {
        name: 'Nandyal APMC',
        district: 'Nandyal',
        state: 'Andhra Pradesh',
        commodity: 'Rice',
        commodities: ['Rice', 'Cotton', 'Maize', 'Jowar'],
        latitude: 15.4776,
        longitude: 78.4844
      },
      {
        name: 'Rajahmundry APMC',
        district: 'East Godavari',
        state: 'Andhra Pradesh',
        commodity: 'Rice',
        commodities: ['Rice', 'Mango', 'Papaya'],
        latitude: 17.0005,
        longitude: 81.8040
      },

      // Cotton Markets
      {
        name: 'Adoni APMC',
        district: 'Kurnool',
        state: 'Andhra Pradesh',
        commodity: 'Cotton',
        commodities: ['Cotton', 'Groundnut'],
        latitude: 15.6267,
        longitude: 77.2750
      },
      {
        name: 'Tirupati APMC',
        district: 'Tirupati',
        state: 'Andhra Pradesh',
        commodity: 'Rice',
        commodities: ['Rice', 'Mango', 'Banana', 'Potato'],
        latitude: 13.6288,
        longitude: 79.4192
      },

      // Tomato Markets
      {
        name: 'Madanapalli APMC',
        district: 'Chittoor',
        state: 'Andhra Pradesh',
        commodity: 'Tomato',
        commodities: ['Tomato', 'Potato', 'Onion', 'Mango'],
        latitude: 13.5503,
        longitude: 78.5026
      },
      {
        name: 'Kalikiri APMC',
        district: 'Chittoor',
        state: 'Andhra Pradesh',
        commodity: 'Tomato',
        commodities: ['Tomato', 'Groundnut'],
        latitude: 13.4070,
        longitude: 78.8710
      },
      {
        name: 'Palamaner APMC',
        district: 'Chittoor',
        state: 'Andhra Pradesh',
        commodity: 'Tomato',
        commodities: ['Tomato', 'Green Chilli', 'Brinjal', 'Potato'],
        latitude: 13.2072,
        longitude: 78.7413
      },

      // Banana Markets
      {
        name: 'Tirupati APMC',
        district: 'Tirupati',
        state: 'Andhra Pradesh',
        commodity: 'Banana',
        commodities: ['Banana', 'Mango', 'Rice'],
        latitude: 13.6288,
        longitude: 79.4192
      },
      {
        name: 'Vijayanagaram APMC',
        district: 'Vizianagaram',
        state: 'Andhra Pradesh',
        commodity: 'Banana',
        commodities: ['Banana', 'Rice', 'Turmeric'],
        latitude: 18.1066,
        longitude: 83.4100
      },

      // Groundnut Markets
      {
        name: 'Cuddapah APMC',
        district: 'Cuddapah',
        state: 'Andhra Pradesh',
        commodity: 'Groundnut',
        commodities: ['Groundnut', 'Turmeric'],
        latitude: 14.4674,
        longitude: 78.8241
      },
      {
        name: 'Gudur APMC',
        district: 'Nellore',
        state: 'Andhra Pradesh',
        commodity: 'Groundnut',
        commodities: ['Groundnut', 'Rice'],
        latitude: 14.1452,
        longitude: 79.8498
      },
      {
        name: 'Yemmiganur APMC',
        district: 'Kurnool',
        state: 'Andhra Pradesh',
        commodity: 'Groundnut',
        commodities: ['Groundnut', 'Maize', 'Arhar'],
        latitude: 15.7280,
        longitude: 77.4780
      },

      // Maize Markets
      {
        name: 'Mylavaram APMC',
        district: 'Krishna',
        state: 'Andhra Pradesh',
        commodity: 'Maize',
        commodities: ['Maize', 'Rice'],
        latitude: 16.6180,
        longitude: 80.6520
      },
      {
        name: 'Rapur APMC',
        district: 'Nellore',
        state: 'Andhra Pradesh',
        commodity: 'Maize',
        commodities: ['Maize', 'Rice'],
        latitude: 14.2070,
        longitude: 79.9870
      },

      // Mango Markets
      {
        name: 'Chittoor APMC',
        district: 'Chittoor',
        state: 'Andhra Pradesh',
        commodity: 'Mango',
        commodities: ['Mango', 'Groundnut', 'Rice', 'Potato'],
        latitude: 13.2172,
        longitude: 79.1003
      },
      {
        name: 'Puttur APMC',
        district: 'Chittoor',
        state: 'Andhra Pradesh',
        commodity: 'Mango',
        commodities: ['Mango', 'Groundnut'],
        latitude: 13.4429,
        longitude: 79.5540
      },

      // Turmeric Markets
      {
        name: 'Duggirala APMC',
        district: 'Guntur',
        state: 'Andhra Pradesh',
        commodity: 'Turmeric',
        commodities: ['Turmeric', 'Rice'],
        latitude: 16.2300,
        longitude: 80.4000
      },
      {
        name: 'Paderu APMC',
        district: 'Visakhapatnam',
        state: 'Andhra Pradesh',
        commodity: 'Turmeric',
        commodities: ['Turmeric', 'Rice'],
        latitude: 17.9900,
        longitude: 82.6500
      },

      // Other commodity markets
      {
        name: 'Kakinada APMC',
        district: 'East Godavari',
        state: 'Andhra Pradesh',
        commodity: 'Rice',
        commodities: ['Rice', 'Coconut'],
        latitude: 16.9891,
        longitude: 82.2475
      }
    ];

    console.log('🌾 Adding comprehensive market data...');

    // Clear existing markets to avoid duplicates
    await Mandi.deleteMany({ state: 'Andhra Pradesh' });
    console.log('🗑️ Cleared existing markets');

    // Insert all markets
    const result = await Mandi.insertMany(allMarkets);
    console.log(`✅ Added ${result.length} markets to database`);

    // Group and display by commodity
    const commodityCount = result.reduce((acc, market) => {
      acc[market.commodity] = (acc[market.commodity] || 0) + 1;
      return acc;
    }, {});

    console.log('\n📊 Markets added by commodity:');
    Object.entries(commodityCount).forEach(([commodity, count]) => {
      console.log(`  ${commodity}: ${count} markets`);
    });

    console.log('\n🏪 All markets:');
    result.forEach(market => {
      console.log(`  • ${market.name} (${market.district}) - ${market.commodities.join(', ')}`);
    });

    await mongoose.disconnect();
    console.log('\n✅ Market seeding completed successfully');

  } catch (error) {
    console.error('❌ Error seeding markets:', error);
    process.exit(1);
  }
}

// Run if script is executed directly
if (require.main === module) {
  addAllMarkets();
}

module.exports = { addAllMarkets };