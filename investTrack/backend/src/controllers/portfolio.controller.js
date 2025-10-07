// backend/src/controllers/portfolio.controller.js
const User = require('../models/User');
const Holding = require('../models/Holding');
const { fetchQuote } = require('../utils/alphavantage');

exports.getPortfolio = async (req, res) => {
  try {
    const userId = req.params.userId;
    if (req.user._id.toString() !== userId) return res.status(403).json({ message: 'Forbidden' });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Get holdings from the Holding model
    const holdings = await Holding.find({ user: userId });
    
    // Get current prices for each holding
    const holdingsWithPrices = await Promise.all(holdings.map(async (holding) => {
      try {
        const quote = await fetchQuote(holding.symbol);
        const currentPrice = quote.price || holding.currentPrice || 0;
        
        // Update the holding with current price
        holding.currentPrice = currentPrice;
        holding.totalValue = currentPrice * holding.quantity;
        holding.pnl = holding.totalValue - holding.totalCost;
        holding.pnlPercentage = holding.totalCost > 0 ? (holding.pnl / holding.totalCost) * 100 : 0;
        holding.lastUpdated = new Date();
        
        await holding.save();
        
        return {
          symbol: holding.symbol,
          companyName: holding.companyName || holding.symbol,
          quantity: holding.quantity,
          avgPrice: holding.avgPrice,
          currentPrice: currentPrice,
          totalValue: holding.totalValue,
          totalCost: holding.totalCost,
          pnl: holding.pnl,
          pnlPercentage: holding.pnlPercentage,
          lastUpdated: holding.lastUpdated
        };
      } catch (error) {
        console.error(`Error fetching price for ${holding.symbol}:`, error);
        // Return holding with existing data if price fetch fails
        return {
          symbol: holding.symbol,
          companyName: holding.companyName || holding.symbol,
          quantity: holding.quantity,
          avgPrice: holding.avgPrice,
          currentPrice: holding.currentPrice || 0,
          totalValue: holding.totalValue || 0,
          totalCost: holding.totalCost,
          pnl: holding.pnl || 0,
          pnlPercentage: holding.pnlPercentage || 0,
          lastUpdated: holding.lastUpdated
        };
      }
    }));

    const totalHoldingValue = holdingsWithPrices.reduce((acc, h) => acc + (h.totalValue || 0), 0);
    const portfolioValue = (user.cash || 0) + totalHoldingValue;

    res.json({
      cash: user.cash || 0,
      holdings: holdingsWithPrices,
      totalHoldingValue,
      portfolioValue,
    });
  } catch (err) {
    console.error('Portfolio fetch error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
