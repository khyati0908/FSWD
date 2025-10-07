import React, { useEffect, useState } from 'react';
import { fetchFrom } from '../api';
import { motion } from 'framer-motion';

const imgBase = 'https://image.tmdb.org/t/p/original';

export default function Banner({ onOpen }) {
  const [movie, setMovie] = useState(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const results = await fetchFrom('/api/netflix-originals');
      if (!mounted) return;
      const pick = results[Math.floor(Math.random() * results.length)];
      setMovie(pick);
    })();
    return () => (mounted = false);
  }, []);

  if (!movie) return null;
  const bg = movie.backdrop_path ? `${imgBase}${movie.backdrop_path}` : '';

  return (
    <motion.header initial={{opacity:0}} animate={{opacity:1}} className="relative h-[60vh] md:h-[70vh] rounded overflow-hidden">
      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${bg})` }} />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
      <div className="absolute bottom-8 left-6 md:left-12 right-6 max-w-2xl">
        <h1 className="text-2xl md:text-4xl font-bold">{movie.title || movie.name}</h1>
        <p className="mt-2 text-sm md:text-base max-h-20 overflow-hidden">{movie.overview}</p>
        <div className="mt-4 flex gap-3">
          <button onClick={() => onOpen(movie)} className="px-4 py-2 bg-white text-black rounded font-semibold">Play Trailer</button>
          <button className="px-4 py-2 bg-zinc-800 rounded border border-zinc-700">My List</button>
        </div>
      </div>
    </motion.header>
  );
}
