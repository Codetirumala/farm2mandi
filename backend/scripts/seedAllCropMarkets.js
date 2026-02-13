const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const Mandi = require('../models/Mandi');

const allCropMarkets = [
  // Banana Markets
  {
    name: 'Ravulapelem APMC',
    district: 'East Godavari',
    state: 'Andhra Pradesh',
    latitude: 16.7833,
    longitude: 81.8167,
    commodity: 'Banana',
    commodities: ['Banana']
  },
  {
    name: 'Vijayanagaram APMC',
    district: 'Vizianagaram',
    state: 'Andhra Pradesh',
    latitude: 18.1067,
    longitude: 83.4956,
    commodity: 'Banana',
    commodities: ['Banana']
  },
  {
    name: 'Ambajipeta APMC',
    district: 'East Godavari',
    state: 'Andhra Pradesh',
    latitude: 16.9167,
    longitude: 81.6667,
    commodity: 'Banana',
    commodities: ['Banana']
  },

  // Brinjal Markets
  {
    name: 'Palamaner APMC',
    district: 'Chittoor',
    state: 'Andhra Pradesh',
    latitude: 13.2000,
    longitude: 78.7500,
    commodity: 'Brinjal',
    commodities: ['Brinjal', 'Green Chilli']
  },

  // Black Gram Markets
  {
    name: 'Nandyal APMC',
    district: 'Nandyal',
    state: 'Andhra Pradesh',
    latitude: 15.4775,
    longitude: 78.4836,
    commodity: 'Black Gram Dal',
    commodities: ['Black Gram Dal', 'Cotton', 'Maize', 'Rice', 'Jowar']
  },

  // Cotton Markets
  {
    name: 'Atmakur Cotton APMC',
    district: 'Spsr Nellore',
    state: 'Andhra Pradesh',
    latitude: 15.8742,
    longitude: 79.5856,
    commodity: 'Cotton',
    commodities: ['Cotton', 'Rice']
  },
  {
    name: 'Adoni APMC',
    district: 'Kurnool',
    state: 'Andhra Pradesh',
    latitude: 15.6267,
    longitude: 77.2750,
    commodity: 'Cotton',
    commodities: ['Cotton', 'Groundnut']
  },
  {
    name: 'Tiruvuru APMC',
    district: 'Krishna',
    state: 'Andhra Pradesh',
    latitude: 16.8000,
    longitude: 80.9000,
    commodity: 'Cotton',
    commodities: ['Cotton', 'Maize', 'Rice']
  },

  // Groundnut Markets
  {
    name: 'Cuddapah APMC',
    district: 'Cuddapah',
    state: 'Andhra Pradesh',
    latitude: 14.4674,
    longitude: 78.8240,
    commodity: 'Groundnut',
    commodities: ['Groundnut']
  },
  {
    name: 'Gudur APMC',
    district: 'Spsr Nellore',
    state: 'Andhra Pradesh',
    latitude: 14.1500,
    longitude: 79.8500,
    commodity: 'Groundnut',
    commodities: ['Groundnut', 'Rice']
  },
  {
    name: 'Lakkireddipally APMC',
    district: 'Kurnool',
    state: 'Andhra Pradesh',
    latitude: 15.2167,
    longitude: 78.1500,
    commodity: 'Groundnut',
    commodities: ['Groundnut']
  },
  {
    name: 'Yemmiganur APMC',
    district: 'Kurnool',
    state: 'Andhra Pradesh',
    latitude: 15.7286,
    longitude: 77.4819,
    commodity: 'Groundnut',
    commodities: ['Groundnut', 'Maize']
  },

  // Mango Markets
  {
    name: 'Puttur APMC',
    district: 'Chittoor',
    state: 'Andhra Pradesh',
    latitude: 13.4389,
    longitude: 79.5542,
    commodity: 'Mango',
    commodities: ['Mango']
  },
  {
    name: 'Bangarupalyam APMC',
    district: 'Chittoor',
    state: 'Andhra Pradesh',
    latitude: 13.5000,
    longitude: 79.0000,
    commodity: 'Mango',
    commodities: ['Mango']
  },

  // Maize Markets
  {
    name: 'Rapur APMC',
    district: 'Nellore',
    state: 'Andhra Pradesh',
    latitude: 14.7833,
    longitude: 79.7000,
    commodity: 'Maize',
    commodities: ['Maize', 'Rice']
  },
  {
    name: 'Mylavaram APMC',
    district: 'Krishna',
    state: 'Andhra Pradesh',
    latitude: 16.6167,
    longitude: 80.6500,
    commodity: 'Maize',
    commodities: ['Maize', 'Rice']
  },

  // Additional Rice Markets
  {
    name: 'Divi APMC',
    district: 'Krishna',
    state: 'Andhra Pradesh',
    latitude: 16.3000,
    longitude: 80.9000,
    commodity: 'Rice',
    commodities: ['Rice']
  },
  {
    name: 'Jaggampet APMC',
    district: 'East Godavari',
    state: 'Andhra Pradesh',
    latitude: 16.8933,
    longitude: 82.1156,
    commodity: 'Rice',
    commodities: ['Rice']
  },
  {
    name: 'Kakinada APMC',
    district: 'East Godavari',
    state: 'Andhra Pradesh',
    latitude: 16.9891,
    longitude: 82.2475,
    commodity: 'Rice',
    commodities: ['Rice']
  },
  {
    name: 'Karapa APMC', 
    district: 'East Godavari',
    state: 'Andhra Pradesh',
    latitude: 16.8500,
    longitude: 81.9000,
    commodity: 'Rice',
    commodities: ['Rice']
  },
  {
    name: 'Peddapuram APMC',
    district: 'East Godavari', 
    state: 'Andhra Pradesh',
    latitude: 17.0700,
    longitude: 82.1400,
    commodity: 'Rice',
    commodities: ['Rice']
  },
  {
    name: 'Rampachodvaram APMC',
    district: 'East Godavari',
    state: 'Andhra Pradesh',
    latitude: 17.2275,
    longitude: 81.7761,
    commodity: 'Rice',
    commodities: ['Rice']
  },
  {
    name: 'Tuni APMC',
    district: 'East Godavari',
    state: 'Andhra Pradesh',
    latitude: 17.3500,
    longitude: 82.5500,
    commodity: 'Rice',
    commodities: ['Rice']
  },

  // Tomato Markets
  {
    name: 'Kalikiri APMC',
    district: 'Chittoor',
    state: 'Andhra Pradesh',
    latitude: 13.6167,
    longitude: 79.1167,
    commodity: 'Tomato',
    commodities: ['Tomato']
  },
  {
    name: 'Madanapalli APMC',
    district: 'Chittoor',
    state: 'Andhra Pradesh',
    latitude: 13.5500,
    longitude: 78.5000,
    commodity: 'Tomato',
    commodities: ['Tomato']
  },

  // Papaya Markets
  {
    name: 'Rajahmundry APMC',
    district: 'East Godavari',
    state: 'Andhra Pradesh',
    latitude: 17.0005,
    longitude: 81.8040,
    commodity: 'Papaya',
    commodities: ['Papaya', 'Mango', 'Rice']
  }
];

async function seedAllCropMarkets() {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      console.error('MONGO_URI not found in environment variables');
      process.exit(1);
    }

    await mongoose.connect(mongoUri, { dbName: process.env.MONGO_DB || undefined });
    console.log('Connected to MongoDB');

    // Get existing markets count
    const existingCount = await Mandi.countDocuments();
    console.log(`Existing markets: ${existingCount}`);

    // Insert markets
    let addedCount = 0;
    for (const market of allCropMarkets) {
      try {
        const existing = await Mandi.findOne({ 
          name: market.name, 
          location: market.location 
        });
        
        if (!existing) {
          await Mandi.create(market);
          addedCount++;
          console.log(`✅ Added: ${market.name} - ${market.commodities.join(', ')}`);
        } else {
          console.log(`⏭️  Exists: ${market.name}`);
        }
      } catch (error) {
        console.error(`❌ Error adding ${market.name}:`, error.message);
      }
    }

    console.log(`\\n🎉 Market seeding completed!`);
    console.log(`📊 Added ${addedCount} new markets`);
    console.log(`📊 Total markets now: ${existingCount + addedCount}`);

    // Show summary by commodity
    const commoditySummary = {};
    for (const market of allCropMarkets) {
      for (const commodity of market.commodities) {
        commoditySummary[commodity] = (commoditySummary[commodity] || 0) + 1;
      }
    }

    console.log('\\n📋 Markets by Commodity:');
    Object.entries(commoditySummary)
      .sort(([,a], [,b]) => b - a)
      .forEach(([commodity, count]) => {
        console.log(`   ${commodity}: ${count} markets`);
      });

  } catch (error) {
    console.error('Error seeding markets:', error);
  } finally {
    await mongoose.connection.close();
  }
}

if (require.main === module) {
  seedAllCropMarkets();
}

module.exports = seedAllCropMarkets;