/**
 * Seed script to populate Mandi and Price data from CSV
 * 
 * Usage:
 * 1. Place Agriculture_price_dataset.csv in backend/scripts/
 * 2. Install csv-parser: npm install csv-parser
 * 3. Run: node scripts/seedData.js
 * 
 * Note: This script extracts mandis from the CSV, but coordinates (lat/lng)
 * need to be added manually or via a geocoding API (Google Maps Geocoding API).
 * For now, it uses approximate coordinates based on state/district.
 */

const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const Mandi = require('../models/Mandi');
const Price = require('../models/Price');

// Approximate coordinates for major Indian states (fallback if geocoding fails)
const STATE_COORDINATES = {
  'Maharashtra': { lat: 19.7515, lng: 75.7139 },
  'Uttar Pradesh': { lat: 26.8467, lng: 80.9462 },
  'Rajasthan': { lat: 27.0238, lng: 74.2179 },
  'Haryana': { lat: 29.0588, lng: 76.0856 },
  'Himachal Pradesh': { lat: 31.1048, lng: 77.1734 },
  'West Bengal': { lat: 22.9868, lng: 87.8550 },
  'Gujarat': { lat: 23.0225, lng: 72.5714 },
  'Kerala': { lat: 10.8505, lng: 76.2711 },
  'Madhya Pradesh': { lat: 22.9734, lng: 78.6569 },
  'Andhra Pradesh': { lat: 15.9129, lng: 79.7400 },
  'Orissa': { lat: 20.9517, lng: 85.0985 },
  'Nagaland': { lat: 26.1584, lng: 94.5624 },
};

async function seedDatabase() {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      console.error('MONGO_URI not set in environment');
      process.exit(1);
    }

    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    // Clear existing data (optional - comment out if you want to keep existing data)
    // await Mandi.deleteMany({});
    // await Price.deleteMany({});
    // console.log('Cleared existing data');

    // CSV path - adjust if your CSV is in a different location
    const csvPath = path.join(__dirname, '../../frontend/src/dataset/Agriculture_price_dataset.csv');
    // Alternative: const csvPath = path.join(__dirname, '../data/Agriculture_price_dataset.csv');
    
    if (!fs.existsSync(csvPath)) {
      console.error(`CSV file not found at: ${csvPath}`);
      console.log('Please ensure the CSV file is at the correct path');
      process.exit(1);
    }

    const mandisMap = new Map(); // To track unique mandis
    const prices = [];
    let rowCount = 0;

    console.log('Reading CSV file...');

    return new Promise((resolve, reject) => {
      fs.createReadStream(csvPath)
        .pipe(csv())
        .on('data', (row) => {
          rowCount++;
          
          try {
            const state = (row.STATE || row['STATE'] || '').trim();
            const district = (row['District Name'] || row['district'] || '').trim();
            const marketName = (row['Market Name'] || row['marketName'] || '').trim();
            const commodity = (row.Commodity || row['commodity'] || '').trim();
            const variety = (row.Variety || row['variety'] || '').trim();
            const grade = (row.Grade || row['grade'] || '').trim();
            const minPrice = parseFloat(row['Min_Price'] || row['minPrice'] || 0);
            const maxPrice = parseFloat(row['Max_Price'] || row['maxPrice'] || 0);
            const modalPrice = parseFloat(row['Modal_Price'] || row['modalPrice'] || 0);
            const priceDateStr = row['Price Date'] || row['priceDate'] || '';

            // Skip invalid rows
            if (!state || !marketName || !commodity || !priceDateStr) {
              return;
            }

            // Create unique key for mandi
            const mandiKey = `${state}_${district}_${marketName}`.toLowerCase();

            if (!mandisMap.has(mandiKey)) {
              // Get approximate coordinates for state
              const stateCoords = STATE_COORDINATES[state] || { lat: 23.0225, lng: 77.4126 }; // Default to India center
              
              // Add small random offset to differentiate mandis in same state
              const lat = stateCoords.lat + (Math.random() - 0.5) * 2;
              const lng = stateCoords.lng + (Math.random() - 0.5) * 2;

              mandisMap.set(mandiKey, {
                name: marketName,
                state: state,
                district: district,
                commodity: commodity, // Primary commodity
                commodities: [commodity], // Will be updated to include all commodities
                latitude: lat,
                longitude: lng
              });
            } else {
              // Add commodity to existing mandi's commodities array
              const mandi = mandisMap.get(mandiKey);
              if (!mandi.commodities.includes(commodity)) {
                mandi.commodities.push(commodity);
              }
            }

            // Parse date (handle format: 6/6/2023 or 2023-06-06)
            let priceDate;
            if (priceDateStr.includes('/')) {
              const [month, day, year] = priceDateStr.split('/');
              priceDate = new Date(year, month - 1, day);
            } else {
              priceDate = new Date(priceDateStr);
            }

            if (isNaN(priceDate.getTime())) {
              return; // Skip invalid dates
            }

            prices.push({
              state: state,
              district: district,
              marketName: marketName,
              commodity: commodity,
              variety: variety,
              grade: grade,
              minPrice: minPrice,
              maxPrice: maxPrice,
              modalPrice: modalPrice,
              priceDate: priceDate
            });

            if (rowCount % 10000 === 0) {
              console.log(`Processed ${rowCount} rows...`);
            }
          } catch (error) {
            console.error(`Error processing row ${rowCount}:`, error.message);
          }
        })
        .on('end', async () => {
          console.log(`\nFinished reading CSV. Processed ${rowCount} rows.`);
          console.log(`Found ${mandisMap.size} unique mandis`);
          console.log(`Found ${prices.length} price records`);

          try {
            // Insert mandis
            const mandisArray = Array.from(mandisMap.values());
            console.log('\nInserting mandis...');
            
            for (const mandi of mandisArray) {
              await Mandi.updateOne(
                { name: mandi.name, state: mandi.state, district: mandi.district },
                { $set: mandi },
                { upsert: true }
              );
            }
            
            console.log(`✓ Inserted/Updated ${mandisArray.length} mandis`);

            // Insert prices in batches
            console.log('\nInserting price records...');
            const batchSize = 1000;
            let inserted = 0;

            for (let i = 0; i < prices.length; i += batchSize) {
              const batch = prices.slice(i, i + batchSize);
              await Price.insertMany(batch, { ordered: false }).catch(err => {
                // Ignore duplicate key errors
                if (err.code !== 11000) {
                  console.error('Batch insert error:', err.message);
                }
              });
              inserted += batch.length;
              if (i % (batchSize * 10) === 0) {
                console.log(`Inserted ${inserted}/${prices.length} prices...`);
              }
            }

            console.log(`✓ Inserted ${inserted} price records`);
            console.log('\n✅ Database seeding completed successfully!');
            console.log('\n⚠️  Note: Mandi coordinates are approximate (based on state).');
            console.log('   For accurate coordinates, use Google Maps Geocoding API to update them.');
            
            await mongoose.disconnect();
            resolve();
          } catch (error) {
            console.error('Error inserting data:', error);
            await mongoose.disconnect();
            reject(error);
          }
        })
        .on('error', (error) => {
          console.error('Error reading CSV:', error);
          reject(error);
        });
    });
  } catch (error) {
    console.error('Error seeding database:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
}

// Run the seed script
seedDatabase().catch(console.error);
