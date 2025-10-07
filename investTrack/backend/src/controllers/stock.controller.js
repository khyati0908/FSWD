// backend/src/controllers/stock.controller.js
const { fetchQuote, fetchDailyHistory } = require('../utils/alphavantage');

// Comprehensive stock database including Indian and US stocks
const STOCK_DATABASE = [
  // Indian Stocks (NSE)
  { symbol: 'TCS', name: 'Tata Consultancy Services Ltd', exchange: 'NSE' },
  { symbol: 'INFY', name: 'Infosys Ltd', exchange: 'NSE' },
  { symbol: 'RELIANCE', name: 'Reliance Industries Ltd', exchange: 'NSE' },
  { symbol: 'HDFCBANK', name: 'HDFC Bank Ltd', exchange: 'NSE' },
  { symbol: 'ICICIBANK', name: 'ICICI Bank Ltd', exchange: 'NSE' },
  { symbol: 'HINDUNILVR', name: 'Hindustan Unilever Ltd', exchange: 'NSE' },
  { symbol: 'ITC', name: 'ITC Ltd', exchange: 'NSE' },
  { symbol: 'SBIN', name: 'State Bank of India', exchange: 'NSE' },
  { symbol: 'BHARTIARTL', name: 'Bharti Airtel Ltd', exchange: 'NSE' },
  { symbol: 'AXISBANK', name: 'Axis Bank Ltd', exchange: 'NSE' },
  { symbol: 'KOTAKBANK', name: 'Kotak Mahindra Bank Ltd', exchange: 'NSE' },
  { symbol: 'ASIANPAINT', name: 'Asian Paints Ltd', exchange: 'NSE' },
  { symbol: 'MARUTI', name: 'Maruti Suzuki India Ltd', exchange: 'NSE' },
  { symbol: 'SUNPHARMA', name: 'Sun Pharmaceutical Industries Ltd', exchange: 'NSE' },
  { symbol: 'TATAMOTORS', name: 'Tata Motors Ltd', exchange: 'NSE' },
  { symbol: 'WIPRO', name: 'Wipro Ltd', exchange: 'NSE' },
  { symbol: 'ULTRACEMCO', name: 'UltraTech Cement Ltd', exchange: 'NSE' },
  { symbol: 'TITAN', name: 'Titan Company Ltd', exchange: 'NSE' },
  { symbol: 'BAJFINANCE', name: 'Bajaj Finance Ltd', exchange: 'NSE' },
  { symbol: 'NESTLEIND', name: 'Nestle India Ltd', exchange: 'NSE' },
  { symbol: 'POWERGRID', name: 'Power Grid Corporation of India Ltd', exchange: 'NSE' },
  { symbol: 'BAJAJFINSV', name: 'Bajaj Finserv Ltd', exchange: 'NSE' },
  { symbol: 'HCLTECH', name: 'HCL Technologies Ltd', exchange: 'NSE' },
  { symbol: 'ADANIENT', name: 'Adani Enterprises Ltd', exchange: 'NSE' },
  { symbol: 'JSWSTEEL', name: 'JSW Steel Ltd', exchange: 'NSE' },
  { symbol: 'ONGC', name: 'Oil & Natural Gas Corporation Ltd', exchange: 'NSE' },
  { symbol: 'COALINDIA', name: 'Coal India Ltd', exchange: 'NSE' },
  { symbol: 'TECHM', name: 'Tech Mahindra Ltd', exchange: 'NSE' },
  { symbol: 'TATACONSUM', name: 'Tata Consumer Products Ltd', exchange: 'NSE' },
  { symbol: 'BRITANNIA', name: 'Britannia Industries Ltd', exchange: 'NSE' },
  { symbol: 'DRREDDY', name: 'Dr Reddy\'s Laboratories Ltd', exchange: 'NSE' },
  { symbol: 'CIPLA', name: 'Cipla Ltd', exchange: 'NSE' },
  { symbol: 'EICHERMOT', name: 'Eicher Motors Ltd', exchange: 'NSE' },
  { symbol: 'HEROMOTOCO', name: 'Hero MotoCorp Ltd', exchange: 'NSE' },
  { symbol: 'DIVISLAB', name: 'Divi\'s Laboratories Ltd', exchange: 'NSE' },
  { symbol: 'SHREECEM', name: 'Shree Cement Ltd', exchange: 'NSE' },
  { symbol: 'GRASIM', name: 'Grasim Industries Ltd', exchange: 'NSE' },
  { symbol: 'HINDALCO', name: 'Hindalco Industries Ltd', exchange: 'NSE' },
  { symbol: 'VEDL', name: 'Vedanta Ltd', exchange: 'NSE' },
  { symbol: 'LT', name: 'Larsen & Toubro Ltd', exchange: 'NSE' },
  { symbol: 'MM', name: 'Mahindra & Mahindra Ltd', exchange: 'NSE' },
  { symbol: 'TATASTEEL', name: 'Tata Steel Ltd', exchange: 'NSE' },
  { symbol: 'BPCL', name: 'Bharat Petroleum Corporation Ltd', exchange: 'NSE' },
  { symbol: 'IOC', name: 'Indian Oil Corporation Ltd', exchange: 'NSE' },
  { symbol: 'UPL', name: 'UPL Ltd', exchange: 'NSE' },
  { symbol: 'ZEEL', name: 'Zee Entertainment Enterprises Ltd', exchange: 'NSE' },
  { symbol: 'BAJAJ-AUTO', name: 'Bajaj Auto Ltd', exchange: 'NSE' },
  { symbol: 'INDUSINDBK', name: 'IndusInd Bank Ltd', exchange: 'NSE' },
  { symbol: 'NTPC', name: 'NTPC Ltd', exchange: 'NSE' },
  { symbol: 'HINDCOPPER', name: 'Hindustan Copper Ltd', exchange: 'NSE' },
  { symbol: 'SAIL', name: 'Steel Authority of India Ltd', exchange: 'NSE' },
  { symbol: 'PNB', name: 'Punjab National Bank', exchange: 'NSE' },
  { symbol: 'CANBK', name: 'Canara Bank', exchange: 'NSE' },
  { symbol: 'UNIONBANK', name: 'Union Bank of India', exchange: 'NSE' },
  { symbol: 'BANKBARODA', name: 'Bank of Baroda', exchange: 'NSE' },
  { symbol: 'IDEA', name: 'Vodafone Idea Ltd', exchange: 'NSE' },
  { symbol: 'VEDL', name: 'Vedanta Ltd', exchange: 'NSE' },
  { symbol: 'JINDALSTEL', name: 'Jindal Steel & Power Ltd', exchange: 'NSE' },
  { symbol: 'TATAPOWER', name: 'Tata Power Company Ltd', exchange: 'NSE' },
  { symbol: 'ADANIPORTS', name: 'Adani Ports & Special Economic Zone Ltd', exchange: 'NSE' },
  { symbol: 'DLF', name: 'DLF Ltd', exchange: 'NSE' },
  { symbol: 'GODREJCP', name: 'Godrej Consumer Products Ltd', exchange: 'NSE' },
  { symbol: 'COLPAL', name: 'Colgate Palmolive India Ltd', exchange: 'NSE' },
  { symbol: 'DABUR', name: 'Dabur India Ltd', exchange: 'NSE' },
  { symbol: 'MARICO', name: 'Marico Ltd', exchange: 'NSE' },
  { symbol: 'UBL', name: 'United Breweries Ltd', exchange: 'NSE' },
  { symbol: 'MCDOWELL-N', name: 'United Spirits Ltd', exchange: 'NSE' },
  { symbol: 'ITC', name: 'ITC Ltd', exchange: 'NSE' },
  { symbol: 'VBL', name: 'Varun Beverages Ltd', exchange: 'NSE' },
  { symbol: 'RADICO', name: 'Radico Khaitan Ltd', exchange: 'NSE' },
  { symbol: 'EMAMILTD', name: 'Emami Ltd', exchange: 'NSE' },
  { symbol: 'GILLETTE', name: 'Gillette India Ltd', exchange: 'NSE' },
  { symbol: 'CASTROLIND', name: 'Castrol India Ltd', exchange: 'NSE' },
  { symbol: 'BERGEPAINT', name: 'Berger Paints India Ltd', exchange: 'NSE' },
  { symbol: 'KANSAINER', name: 'Kansai Nerolac Paints Ltd', exchange: 'NSE' },
  { symbol: 'AKZOINDIA', name: 'Akzo Nobel India Ltd', exchange: 'NSE' },
  { symbol: 'PIDILITIND', name: 'Pidilite Industries Ltd', exchange: 'NSE' },
  { symbol: 'PEL', name: 'Piramal Enterprises Ltd', exchange: 'NSE' },
  { symbol: 'BIOCON', name: 'Biocon Ltd', exchange: 'NSE' },
  { symbol: 'APOLLOHOSP', name: 'Apollo Hospitals Enterprise Ltd', exchange: 'NSE' },
  { symbol: 'FORTIS', name: 'Fortis Healthcare Ltd', exchange: 'NSE' },
  { symbol: 'NARAYANA', name: 'Narayana Hrudayalaya Ltd', exchange: 'NSE' },
  { symbol: 'ALKEM', name: 'Alkem Laboratories Ltd', exchange: 'NSE' },
  { symbol: 'TORNTPHARM', name: 'Torrent Pharmaceuticals Ltd', exchange: 'NSE' },
  { symbol: 'CADILAHC', name: 'Cadila Healthcare Ltd', exchange: 'NSE' },
  { symbol: 'LUPIN', name: 'Lupin Ltd', exchange: 'NSE' },
  { symbol: 'AUROPHARMA', name: 'Aurobindo Pharma Ltd', exchange: 'NSE' },
  { symbol: 'GLENMARK', name: 'Glenmark Pharmaceuticals Ltd', exchange: 'NSE' },
  { symbol: 'TORNTPOWER', name: 'Torrent Power Ltd', exchange: 'NSE' },
  { symbol: 'TATACOMM', name: 'Tata Communications Ltd', exchange: 'NSE' },
  { symbol: 'BHARTIARTL', name: 'Bharti Airtel Ltd', exchange: 'NSE' },
  { symbol: 'IDEA', name: 'Vodafone Idea Ltd', exchange: 'NSE' },
  { symbol: 'MTNL', name: 'Mahanagar Telephone Nigam Ltd', exchange: 'NSE' },
  { symbol: 'BSNL', name: 'Bharat Sanchar Nigam Ltd', exchange: 'NSE' },
  { symbol: 'RAILTEL', name: 'RailTel Corporation of India Ltd', exchange: 'NSE' },
  { symbol: 'TATACOMM', name: 'Tata Communications Ltd', exchange: 'NSE' },
  { symbol: 'STERLITECH', name: 'Sterlite Technologies Ltd', exchange: 'NSE' },
  { symbol: 'TEJASNET', name: 'Tejas Networks Ltd', exchange: 'NSE' },
  { symbol: 'ITI', name: 'ITI Ltd', exchange: 'NSE' },
  { symbol: 'HFCL', name: 'HFCL Ltd', exchange: 'NSE' },
  { symbol: 'VINDHYATEL', name: 'Vindhya Telelinks Ltd', exchange: 'NSE' },
  { symbol: 'OPTEL', name: 'Optel Telecommunication Ltd', exchange: 'NSE' },
  { symbol: 'TATACOMM', name: 'Tata Communications Ltd', exchange: 'NSE' },
  { symbol: 'BHARTIARTL', name: 'Bharti Airtel Ltd', exchange: 'NSE' },
  { symbol: 'IDEA', name: 'Vodafone Idea Ltd', exchange: 'NSE' },
  { symbol: 'MTNL', name: 'Mahanagar Telephone Nigam Ltd', exchange: 'NSE' },
  { symbol: 'BSNL', name: 'Bharat Sanchar Nigam Ltd', exchange: 'NSE' },
  { symbol: 'RAILTEL', name: 'RailTel Corporation of India Ltd', exchange: 'NSE' },
  { symbol: 'TATACOMM', name: 'Tata Communications Ltd', exchange: 'NSE' },
  { symbol: 'STERLITECH', name: 'Sterlite Technologies Ltd', exchange: 'NSE' },
  { symbol: 'TEJASNET', name: 'Tejas Networks Ltd', exchange: 'NSE' },
  { symbol: 'ITI', name: 'ITI Ltd', exchange: 'NSE' },
  { symbol: 'HFCL', name: 'HFCL Ltd', exchange: 'NSE' },
  { symbol: 'VINDHYATEL', name: 'Vindhya Telelinks Ltd', exchange: 'NSE' },
  { symbol: 'OPTEL', name: 'Optel Telecommunication Ltd', exchange: 'NSE' },
  
  // US Stocks (NASDAQ/NYSE)
  { symbol: 'AAPL', name: 'Apple Inc.', exchange: 'NASDAQ' },
  { symbol: 'GOOGL', name: 'Alphabet Inc.', exchange: 'NASDAQ' },
  { symbol: 'MSFT', name: 'Microsoft Corporation', exchange: 'NASDAQ' },
  { symbol: 'AMZN', name: 'Amazon.com Inc.', exchange: 'NASDAQ' },
  { symbol: 'TSLA', name: 'Tesla Inc.', exchange: 'NASDAQ' },
  { symbol: 'META', name: 'Meta Platforms Inc.', exchange: 'NASDAQ' },
  { symbol: 'NVDA', name: 'NVIDIA Corporation', exchange: 'NASDAQ' },
  { symbol: 'NFLX', name: 'Netflix Inc.', exchange: 'NASDAQ' },
  { symbol: 'JPM', name: 'JPMorgan Chase & Co.', exchange: 'NYSE' },
  { symbol: 'JNJ', name: 'Johnson & Johnson', exchange: 'NYSE' },
  { symbol: 'V', name: 'Visa Inc.', exchange: 'NYSE' },
  { symbol: 'WMT', name: 'Walmart Inc.', exchange: 'NYSE' },
  { symbol: 'PG', name: 'Procter & Gamble Co.', exchange: 'NYSE' },
  { symbol: 'UNH', name: 'UnitedHealth Group Inc.', exchange: 'NYSE' },
  { symbol: 'HD', name: 'The Home Depot Inc.', exchange: 'NYSE' },
  { symbol: 'DIS', name: 'The Walt Disney Company', exchange: 'NYSE' },
  { symbol: 'PYPL', name: 'PayPal Holdings Inc.', exchange: 'NASDAQ' },
  { symbol: 'ADBE', name: 'Adobe Inc.', exchange: 'NASDAQ' },
  { symbol: 'CRM', name: 'Salesforce Inc.', exchange: 'NYSE' },
  { symbol: 'INTC', name: 'Intel Corporation', exchange: 'NASDAQ' },
  { symbol: 'PFE', name: 'Pfizer Inc.', exchange: 'NYSE' },
  { symbol: 'ABT', name: 'Abbott Laboratories', exchange: 'NYSE' },
  { symbol: 'KO', name: 'The Coca-Cola Company', exchange: 'NYSE' },
  { symbol: 'PEP', name: 'PepsiCo Inc.', exchange: 'NASDAQ' },
  { symbol: 'TMO', name: 'Thermo Fisher Scientific Inc.', exchange: 'NYSE' },
  { symbol: 'COST', name: 'Costco Wholesale Corporation', exchange: 'NASDAQ' },
  { symbol: 'AVGO', name: 'Broadcom Inc.', exchange: 'NASDAQ' },
  { symbol: 'ACN', name: 'Accenture plc', exchange: 'NYSE' },
  { symbol: 'DHR', name: 'Danaher Corporation', exchange: 'NYSE' },
  { symbol: 'NEE', name: 'NextEra Energy Inc.', exchange: 'NYSE' },
  { symbol: 'LLY', name: 'Eli Lilly and Company', exchange: 'NYSE' },
  { symbol: 'TXN', name: 'Texas Instruments Incorporated', exchange: 'NASDAQ' },
  { symbol: 'HON', name: 'Honeywell International Inc.', exchange: 'NASDAQ' },
  { symbol: 'QCOM', name: 'QUALCOMM Incorporated', exchange: 'NASDAQ' },
  { symbol: 'LOW', name: 'Lowe\'s Companies Inc.', exchange: 'NYSE' },
  { symbol: 'UPS', name: 'United Parcel Service Inc.', exchange: 'NYSE' },
  { symbol: 'IBM', name: 'International Business Machines Corporation', exchange: 'NYSE' },
  { symbol: 'RTX', name: 'Raytheon Technologies Corporation', exchange: 'NYSE' },
  { symbol: 'CAT', name: 'Caterpillar Inc.', exchange: 'NYSE' },
  { symbol: 'SPGI', name: 'S&P Global Inc.', exchange: 'NYSE' },
  { symbol: 'GS', name: 'The Goldman Sachs Group Inc.', exchange: 'NYSE' },
  { symbol: 'MS', name: 'Morgan Stanley', exchange: 'NYSE' },
  { symbol: 'BA', name: 'The Boeing Company', exchange: 'NYSE' },
  { symbol: 'AMGN', name: 'Amgen Inc.', exchange: 'NASDAQ' },
  { symbol: 'ISRG', name: 'Intuitive Surgical Inc.', exchange: 'NASDAQ' },
  { symbol: 'GILD', name: 'Gilead Sciences Inc.', exchange: 'NASDAQ' },
  { symbol: 'MDLZ', name: 'Mondelez International Inc.', exchange: 'NASDAQ' },
  { symbol: 'BKNG', name: 'Booking Holdings Inc.', exchange: 'NASDAQ' },
  { symbol: 'ADI', name: 'Analog Devices Inc.', exchange: 'NASDAQ' },
  { symbol: 'REGN', name: 'Regeneron Pharmaceuticals Inc.', exchange: 'NASDAQ' },
  { symbol: 'VRTX', name: 'Vertex Pharmaceuticals Incorporated', exchange: 'NASDAQ' },
  { symbol: 'KLAC', name: 'KLA Corporation', exchange: 'NASDAQ' },
  { symbol: 'LRCX', name: 'Lam Research Corporation', exchange: 'NASDAQ' },
  { symbol: 'PANW', name: 'Palo Alto Networks Inc.', exchange: 'NASDAQ' },
  { symbol: 'SNPS', name: 'Synopsys Inc.', exchange: 'NASDAQ' },
  { symbol: 'CDNS', name: 'Cadence Design Systems Inc.', exchange: 'NASDAQ' },
  { symbol: 'MELI', name: 'MercadoLibre Inc.', exchange: 'NASDAQ' },
  { symbol: 'ZM', name: 'Zoom Video Communications Inc.', exchange: 'NASDAQ' },
  { symbol: 'ROKU', name: 'Roku Inc.', exchange: 'NASDAQ' },
  { symbol: 'SQ', name: 'Block Inc.', exchange: 'NYSE' },
  { symbol: 'SHOP', name: 'Shopify Inc.', exchange: 'NYSE' },
  { symbol: 'SPOT', name: 'Spotify Technology S.A.', exchange: 'NYSE' },
  { symbol: 'UBER', name: 'Uber Technologies Inc.', exchange: 'NYSE' },
  { symbol: 'LYFT', name: 'Lyft Inc.', exchange: 'NASDAQ' },
  { symbol: 'SNAP', name: 'Snap Inc.', exchange: 'NYSE' },
  { symbol: 'TWTR', name: 'Twitter Inc.', exchange: 'NYSE' },
  { symbol: 'PINS', name: 'Pinterest Inc.', exchange: 'NYSE' },
  { symbol: 'DASH', name: 'DoorDash Inc.', exchange: 'NYSE' },
  { symbol: 'ABNB', name: 'Airbnb Inc.', exchange: 'NASDAQ' },
  { symbol: 'COIN', name: 'Coinbase Global Inc.', exchange: 'NASDAQ' },
  { symbol: 'PLTR', name: 'Palantir Technologies Inc.', exchange: 'NYSE' },
  { symbol: 'SNOW', name: 'Snowflake Inc.', exchange: 'NYSE' },
  { symbol: 'CRWD', name: 'CrowdStrike Holdings Inc.', exchange: 'NASDAQ' },
  { symbol: 'OKTA', name: 'Okta Inc.', exchange: 'NASDAQ' },
  { symbol: 'TEAM', name: 'Atlassian Corporation plc', exchange: 'NASDAQ' },
  { symbol: 'DOCU', name: 'DocuSign Inc.', exchange: 'NASDAQ' },
  { symbol: 'WDAY', name: 'Workday Inc.', exchange: 'NASDAQ' },
  { symbol: 'SERV', name: 'ServiceNow Inc.', exchange: 'NYSE' },
  { symbol: 'ORCL', name: 'Oracle Corporation', exchange: 'NYSE' },
  { symbol: 'SAP', name: 'SAP SE', exchange: 'NYSE' }
];

exports.searchStocks = async (req, res) => {
  try {
    const { q } = req.query;
    console.log('Search query:', q); // Debug log
    
    if (!q || q.trim() === '') {
      return res.json([]);
    }

    const query = q.toUpperCase().trim();
    console.log('Processed query:', query); // Debug log
    
    // More flexible search - check if query starts with or contains the search term
    const results = STOCK_DATABASE.filter(stock => {
      const symbolMatch = stock.symbol.toUpperCase().includes(query);
      const nameMatch = stock.name.toUpperCase().includes(query);
      return symbolMatch || nameMatch;
    });
    
    console.log('Found results:', results.length); // Debug log
    
    // Sort results: exact symbol matches first, then partial matches
    const sortedResults = results.sort((a, b) => {
      const aExactSymbol = a.symbol.toUpperCase() === query;
      const bExactSymbol = b.symbol.toUpperCase() === query;
      
      if (aExactSymbol && !bExactSymbol) return -1;
      if (!aExactSymbol && bExactSymbol) return 1;
      
      // If both are exact or both are partial, sort by symbol
      return a.symbol.localeCompare(b.symbol);
    }).slice(0, 20); // Increased to 20 results

    // Add mock prices for demo (in real app, you'd fetch real prices)
    const resultsWithPrices = sortedResults.map(stock => ({
      ...stock,
      price: Math.random() * 1000 + 50 // Mock price between 50-1050
    }));

    console.log('Returning results:', resultsWithPrices.length); // Debug log
    res.json(resultsWithPrices);
  } catch (error) {
    console.error('Stock search error:', error);
    res.status(500).json({ message: 'Search failed' });
  }
};

exports.getStockQuote = async (req, res) => {
  try {
    const { symbol } = req.params;
    
    if (!symbol) {
      return res.status(400).json({ message: 'Stock symbol required' });
    }

    // Try to get real-time data from AlphaVantage
    let stockData;
    try {
      const quote = await fetchQuote(symbol);
      stockData = {
        symbol: symbol.toUpperCase(),
        companyName: getCompanyName(symbol),
        price: quote.price || 0,
        change: quote.change || 0,
        changePercent: quote.changePercent || 0,
        open: quote.open || 0,
        high: quote.high || 0,
        low: quote.low || 0,
        volume: quote.volume || 0,
        marketCap: quote.marketCap || 0,
        yearHigh: quote.yearHigh || 0,
        yearLow: quote.yearLow || 0,
        lastUpdated: new Date().toISOString()
      };
    } catch (error) {
      console.error('AlphaVantage error:', error);
      // Fallback to mock data
      stockData = {
        symbol: symbol.toUpperCase(),
        companyName: getCompanyName(symbol),
        price: Math.random() * 1000 + 50,
        change: (Math.random() - 0.5) * 20,
        changePercent: (Math.random() - 0.5) * 10,
        open: Math.random() * 1000 + 50,
        high: Math.random() * 1000 + 100,
        low: Math.random() * 500 + 25,
        volume: Math.floor(Math.random() * 10000000),
        marketCap: Math.random() * 1000000000000,
        yearHigh: Math.random() * 1200 + 100,
        yearLow: Math.random() * 500 + 25,
        lastUpdated: new Date().toISOString()
      };
    }

    res.json(stockData);
  } catch (error) {
    console.error('Get stock quote error:', error);
    res.status(500).json({ message: 'Failed to fetch stock data' });
  }
};

exports.getStockHistory = async (req, res) => {
  try {
    const { symbol } = req.params;
    const { period = '1month' } = req.query;
    
    if (!symbol) {
      return res.status(400).json({ message: 'Stock symbol required' });
    }

    let historyData;
    try {
      const history = await fetchDailyHistory(symbol);
      historyData = history;
    } catch (error) {
      console.error('AlphaVantage history error:', error);
      // Fallback to mock data
      historyData = generateMockHistory(period);
    }

    res.json(historyData);
  } catch (error) {
    console.error('Get stock history error:', error);
    res.status(500).json({ message: 'Failed to fetch stock history' });
  }
};

// Test endpoint to check available stocks
exports.getAllStocks = async (req, res) => {
  try {
    const { q } = req.query;
    let stocks = STOCK_DATABASE;
    
    if (q) {
      const query = q.toUpperCase().trim();
      stocks = STOCK_DATABASE.filter(stock => 
        stock.symbol.toUpperCase().includes(query) || 
        stock.name.toUpperCase().includes(query)
      );
    }
    
    res.json({
      total: stocks.length,
      stocks: stocks.slice(0, 50) // Return first 50 for testing
    });
  } catch (error) {
    console.error('Get all stocks error:', error);
    res.status(500).json({ message: 'Failed to fetch stocks' });
  }
};

// Helper function to get company name
function getCompanyName(symbol) {
  const stock = STOCK_DATABASE.find(s => s.symbol === symbol.toUpperCase());
  return stock ? stock.name : `${symbol.toUpperCase()} Corporation`;
}

// Helper function to generate mock history data
function generateMockHistory(period) {
  const days = period === '1week' ? 7 : period === '1month' ? 30 : period === '3months' ? 90 : 365;
  const data = [];
  let basePrice = Math.random() * 1000 + 50;
  
  for (let i = days; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    
    basePrice += (Math.random() - 0.5) * 10; // Random price movement
    basePrice = Math.max(basePrice, 10); // Ensure price doesn't go below 10
    
    data.push({
      date: date.toISOString().split('T')[0],
      close: basePrice,
      open: basePrice + (Math.random() - 0.5) * 5,
      high: basePrice + Math.random() * 10,
      low: basePrice - Math.random() * 10,
      volume: Math.floor(Math.random() * 10000000)
    });
  }
  
  return data;
}
