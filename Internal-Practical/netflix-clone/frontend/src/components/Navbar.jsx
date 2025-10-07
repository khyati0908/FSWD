import React, { useEffect, useState } from 'react';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <nav className={`fixed w-full top-0 z-50 transition-colors ${scrolled ? 'bg-black/80 backdrop-blur' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-4">
          <img src="/logo192.png" alt="logo" className="h-8 w-8 object-contain" />
          <ul className="hidden md:flex gap-6 text-sm">
            <li className="hover:underline cursor-pointer">Home</li>
            <li className="hover:underline cursor-pointer">TV Shows</li>
            <li className="hover:underline cursor-pointer">Movies</li>
            <li className="hover:underline cursor-pointer">My List</li>
          </ul>
        </div>

        <div className="flex items-center gap-3">
          <input placeholder="Search" className="hidden md:block bg-zinc-800 px-2 py-1 rounded text-sm" />
          <img src="/profile.png" alt="profile" className="h-8 w-8 rounded" />
        </div>
      </div>
    </nav>
  );
}
