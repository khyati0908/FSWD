import React from 'react';
const base = 'https://image.tmdb.org/t/p/w500';

export default function MovieCard({ item, onOpen, large }) {
  const path = large ? item.poster_path || item.backdrop_path : item.poster_path || item.backdrop_path;
  const img = path ? `${base}${path}` : '/placeholder.png';

  return (
    <div className="cursor-pointer" onClick={() => onOpen(item)}>
      <img src={img} alt={item.title || item.name} className="rounded-md w-full h-auto object-cover" loading="lazy" />
      <p className="text-sm mt-2">{item.title || item.name}</p>
    </div>
  );
}
