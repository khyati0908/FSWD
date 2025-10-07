import React, { useEffect, useState } from 'react';
import { fetchFrom } from '../api';
import ReactPlayer from "react-player";


export default function Modal({ item, onClose }) {
  const [key, setKey] = useState(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const type = item.media_type || (item.title ? 'movie' : 'tv');
      const videos = await fetchFrom(`/api/video/${type}/${item.id}`);
      const yt = videos.find(v => v.site === 'YouTube' && v.type === 'Trailer') || videos.find(v => v.site === 'YouTube');
      if (mounted) setKey(yt ? yt.key : null);
    })();
    return () => (mounted = false);
  }, [item]);

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
      <div className="bg-zinc-900 max-w-4xl w-full rounded overflow-hidden">
        <div className="flex justify-between items-center p-3 border-b border-zinc-800">
          <h3 className="font-bold">{item.title || item.name}</h3>
          <button onClick={onClose} className="text-xl">✕</button>
        </div>
        <div className="p-4">
          {key ? (
            <div className="aspect-w-16 aspect-h-9" style={{ position: 'relative', paddingTop: '56.25%' }}>
              <ReactPlayer url={`https://www.youtube.com/watch?v=${key}`} width="100%" height="100%" style={{ position: 'absolute', top: 0, left: 0 }} playing controls />
            </div>
          ) : (
            <p className="text-sm">Trailer not available.</p>
          )}
          <p className="mt-3 text-sm text-zinc-400">{item.overview}</p>
        </div>
      </div>
    </div>
  );
}
