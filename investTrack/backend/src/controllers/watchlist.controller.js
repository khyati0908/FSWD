// backend/src/controllers/watchlist.controller.js
const Watchlist = require('../models/Watchlist');
const { fetchQuote } = require('../utils/alphavantage');

exports.getWatchlist = async (req, res) => {
  try {
    const wl = await Watchlist.findOne({ user: req.params.userId });
    if (!wl) return res.json({ symbols: [] });

    // fetch live prices (map)
    const symbols = wl.symbols || [];
    const prices = await Promise.all(symbols.map(async s => {
      const q = await fetchQuote(s).catch(()=>({ price: null, changePercent: null }));
      return { symbol: s, ...q };
    }));
    res.json({ symbols: prices });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

exports.add = async (req, res) => {
  try {
    const { userId, symbol } = req.body;
    if (req.user._id.toString() !== userId) return res.status(403).json({ message: 'Forbidden' });

    let wl = await Watchlist.findOne({ user: userId });
    if (!wl) {
      wl = new Watchlist({ user: userId, symbols: [symbol] });
    } else {
      if (!wl.symbols.includes(symbol)) wl.symbols.push(symbol);
    }
    await wl.save();
    res.json(wl);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

exports.remove = async (req, res) => {
  try {
    const { userId, symbol } = req.body;
    if (req.user._id.toString() !== userId) return res.status(403).json({ message: 'Forbidden' });

    let wl = await Watchlist.findOne({ user: userId });
    if (!wl) return res.status(404).json({ message: 'Watchlist not found' });
    wl.symbols = wl.symbols.filter(s => s !== symbol);
    await wl.save();
    res.json(wl);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};
