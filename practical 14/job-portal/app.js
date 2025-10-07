import express from 'express';
import multer from 'multer';
import path from 'path';

const app = express();

// Set EJS as template engine
app.set('view engine', 'ejs');

// Serve static files (optional, for CSS or JS if needed)
app.use(express.static('public'));

// Multer configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // unique file name
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB limit
  fileFilter: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    if (ext !== '.pdf') {
      return cb(new Error('Only PDF files are allowed'));
    }
    cb(null, true);
  }
});

// Routes
app.get('/upload', (req, res) => {
  res.render('upload');
});

app.post('/upload', upload.single('resume'), (req, res) => {
  if (!req.file) {
    return res.render('result', { message: 'Please select a PDF file to upload.' });
  }
  res.render('result', { message: 'File uploaded successfully!' });
});

// Error handling for Multer
app.use((err, req, res, next) => {
  if (err) {
    return res.render('result', { message: err.message });
  }
  next();
});

// Start server
app.listen(3000, () => {
  console.log('Server running at http://localhost:3000/upload');
});
