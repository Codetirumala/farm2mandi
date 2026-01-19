const Price = require('../models/Price');

/**
 * Predict price for a commodity based on historical data
 * Simple average of recent modal prices (last 30 days)
 * Can be enhanced with LSTM/ARIMA later if needed
 */
async function predictPrice(commodity, date) {
  try {
    const queryDate = new Date(date);
    const thirtyDaysAgo = new Date(queryDate);
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Get recent prices for this commodity
    const recentPrices = await Price.find({
      commodity: { $regex: new RegExp(commodity, 'i') }, // Case-insensitive
      priceDate: { $gte: thirtyDaysAgo, $lte: queryDate }
    }).sort({ priceDate: -1 }).limit(100);

    if (recentPrices.length === 0) {
      // If no historical data, return a default price
      return { predictedPrice: 2000, confidence: 0 };
    }

    // Calculate average of modal prices
    const total = recentPrices.reduce((sum, price) => sum + price.modalPrice, 0);
    const average = total / recentPrices.length;

    // Simple trend calculation (comparing last 10 vs previous 10)
    const recent = recentPrices.slice(0, 10);
    const older = recentPrices.slice(10, 20);
    
    let trend = 0;
    if (older.length > 0 && recent.length > 0) {
      const recentAvg = recent.reduce((sum, p) => sum + p.modalPrice, 0) / recent.length;
      const olderAvg = older.reduce((sum, p) => sum + p.modalPrice, 0) / older.length;
      trend = (recentAvg - olderAvg) / olderAvg; // Percentage change
    }

    // Apply trend to prediction
    const predictedPrice = average * (1 + trend * 0.5); // Apply 50% of trend

    return {
      predictedPrice: Math.round(predictedPrice * 100) / 100,
      confidence: Math.min(1, recentPrices.length / 50), // Confidence based on data points
      historicalAverage: Math.round(average * 100) / 100
    };
  } catch (error) {
    console.error('Error predicting price:', error);
    return { predictedPrice: 2000, confidence: 0, error: error.message };
  }
}

module.exports = { predictPrice };
