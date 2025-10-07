const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// parse urlencoded POST bodies
app.use(express.urlencoded({ extended: true }));

// set ejs as template engine (views/ folder)
app.set('view engine', 'ejs');

// helper: remove currency symbols/commas but keep digits, dot and minus
function sanitizeNumberInput(str) {
  if (typeof str !== 'string') return '';
  return str.replace(/[^0-9.\-]/g, '');
}

// homepage - show form
app.get('/', (req, res) => {
  res.render('form', { error: null, values: { income1: '', income2: '' } });
});

// handle POST, validate, calculate
app.post('/calculate', (req, res) => {
  const raw1 = req.body.income1 || '';
  const raw2 = req.body.income2 || '';

  const s1 = sanitizeNumberInput(raw1);
  const s2 = sanitizeNumberInput(raw2);

  const num1 = parseFloat(s1);
  const num2 = parseFloat(s2);

  const errors = [];
  if (!s1 || !isFinite(num1)) errors.push('Please enter a valid number for Income 1');
  if (!s2 || !isFinite(num2)) errors.push('Please enter a valid number for Income 2');
  if (num1 < 0 || num2 < 0) errors.push('Income values cannot be negative');

  if (errors.length) {
    return res.status(400).render('form', {
      error: errors.join('. '),
      values: { income1: raw1, income2: raw2 }
    });
  }

  const total = num1 + num2;
  // format result (2 decimal places, localized grouping)
  const formattedTotal = new Intl.NumberFormat('en-IN', {
    minimumFractionDigits: 2, maximumFractionDigits: 2
  }).format(total);

  res.render('result', { total, formattedTotal });
});

app.listen(PORT, () => console.log(`Server running: http://localhost:${PORT}`));
