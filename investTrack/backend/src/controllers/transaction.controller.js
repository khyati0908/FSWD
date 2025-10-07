// backend/src/controllers/transaction.controller.js
const Transaction = require('../models/Transaction');
const User = require('../models/User');
const { fetchQuote } = require('../utils/alphavantage');

exports.getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.params.userId }).sort({ createdAt: -1 });
    res.json(transactions);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

exports.buy = async (req, res) => {
  try {
    const { userId, symbol, quantity } = req.body;
    if (!symbol || !quantity || quantity <= 0) return res.status(400).json({ message: 'Invalid inputs' });
    if (req.user._id.toString() !== userId) return res.status(403).json({ message: 'Forbidden' });

    const priceData = await fetchQuote(symbol).catch(()=>({ price: null }));
    const price = priceData.price;
    if (!price) return res.status(400).json({ message: 'Unable to fetch price' });

    const total = price * quantity;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (user.cash < total) return res.status(400).json({ message: 'Not enough cash' });

    // Deduct cash, add/update holding
    user.cash -= total;
    const holding = user.holdings.find(h => h.symbol === symbol);
    if (holding) {
      // new avg price
      const newQty = holding.quantity + quantity;
      holding.avgPrice = ((holding.avgPrice * holding.quantity) + (price * quantity)) / newQty;
      holding.quantity = newQty;
    } else {
      user.holdings.push({ symbol, quantity, avgPrice: price });
    }
    await user.save();

    const tx = new Transaction({ user: userId, type: 'BUY', symbol, quantity, price, total });
    await tx.save();

    res.json({ message: 'Bought', tx });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

exports.sell = async (req, res) => {
  try {
    const { userId, symbol, quantity } = req.body;
    if (!symbol || !quantity || quantity <= 0) return res.status(400).json({ message: 'Invalid inputs' });
    if (req.user._id.toString() !== userId) return res.status(403).json({ message: 'Forbidden' });

    const priceData = await fetchQuote(symbol).catch(()=>({ price: null }));
    const price = priceData.price;
    if (!price) return res.status(400).json({ message: 'Unable to fetch price' });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const holding = user.holdings.find(h => h.symbol === symbol);
    if (!holding || holding.quantity < quantity) return res.status(400).json({ message: 'Not enough holdings' });

    // Reduce holding
    holding.quantity -= quantity;
    // If zero, remove it
    if (holding.quantity === 0) {
      user.holdings = user.holdings.filter(h => h.symbol !== symbol);
    }
    const total = price * quantity;
    user.cash += total;
    await user.save();

    const tx = new Transaction({ user: userId, type: 'SELL', symbol, quantity, price, total });
    await tx.save();

    res.json({ message: 'Sold', tx });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};
