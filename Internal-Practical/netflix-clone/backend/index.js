// backend/index.js
require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const TMDB_KEY = process.env.TMDB_API_KEY;
const BASE = 'https://api.themoviedb.org/3';

if (!TMDB_KEY) {
  console.warn('WARNING: TMDB_API_KEY not set in backend/.env');
}

// helper
async function tmdbGet(path, params = {}) {
  const res = await axios.get(`${BASE}${path}`, {
    params: { api_key: TMDB_KEY, language: 'en-US', ...params },
  });
  return res.data;
}

// Endpoints (frontend will call /api/...)
app.get('/api/trending', async (req, res) => {
  try {
    const data = await tmdbGet('/trending/all/week');
    return res.json(data.results);
  } catch (e) { console.error(e); res.status(500).json({ error: 'tmdb error' }); }
});

app.get('/api/netflix-originals', async (req, res) => {
  try {
    const data = await tmdbGet('/discover/tv', { with_networks: 213 });
    return res.json(data.results);
  } catch (e) { console.error(e); res.status(500).json({ error: 'tmdb error' }); }
});

app.get('/api/top-rated', async (req, res) => {
  try {
    const data = await tmdbGet('/movie/top_rated');
    return res.json(data.results);
  } catch (e) { console.error(e); res.status(500).json({ error: 'tmdb error' }); }
});

app.get('/api/genre/:genreId', async (req, res) => {
  try {
    const { genreId } = req.params;
    const data = await tmdbGet('/discover/movie', { with_genres: genreId });
    return res.json(data.results);
  } catch (e) { console.error(e); res.status(500).json({ error: 'tmdb error' }); }
});

// Search (optional)
app.get('/api/search', async (req, res) => {
  try {
    const { q } = req.query;
    const data = await tmdbGet('/search/multi', { query: q });
    return res.json(data.results);
  } catch (e) { console.error(e); res.status(500).json({ error: 'tmdb error' }); }
});

// Get videos (trailer) for movie or tv
app.get('/api/video/:type/:id', async (req, res) => {
  try {
    const { type, id } = req.params; // type = movie | tv
    const data = await tmdbGet(`/${type}/${id}/videos`);
    return res.json(data.results);
  } catch (e) { console.error(e); res.status(500).json({ error: 'tmdb error' }); }
});

app.listen(PORT, () => console.log(`Backend listening on http://localhost:${PORT}`));
