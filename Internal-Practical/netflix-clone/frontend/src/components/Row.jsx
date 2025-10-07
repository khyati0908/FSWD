import React, { useEffect, useRef, useState } from 'react';
import { fetchFrom } from '../api';
import MovieCard from './MovieCard';
import { motion } from 'framer-motion';

export default function Row({ title, fetchPath, large = false, onOpen }) {
  const [items, setItems] = useState([]);
  const ref = useRef(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const data = await fetchFrom(fetchPath);
      if (mounted) setItems(data || []);
    })();
    return () => (mounted = false);
  }, [fetchPath]);

  const scroll = (dir) => {
    if (!ref.current) return;
    const { clientWidth } = ref.current;
    ref.current.scrollBy({ left: dir === 'left' ? -clientWidth + 80 : clientWidth - 80, behavior: 'smooth' });
  };

  return (
    <div className="relative">
      <h2 className="text-lg font-semibold mb-2">{title}</h2>

      <button onClick={() => scroll('left')} className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-black/40 p-2 rounded">‹</button>

      <div ref={ref} className="flex gap-3 overflow-x-scroll scrollbar-hide py-2 scroll-smooth">
        {items.map(item => (
          <motion.div whileHover={{ scale: 1.05 }} key={item.id} className={`${large ? 'min-w-[220px]' : 'min-w-[150px]'} shrink-0`}>
            <MovieCard item={item} onOpen={onOpen} large={large} />
          </motion.div>
        ))}
      </div>

      <button onClick={() => scroll('right')} className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-black/40 p-2 rounded">›</button>
    </div>
  );
}
