import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Banner from './components/Banner';
import Row from './components/Row';
import Modal from './components/Modal';

export default function App() {
  const [selected, setSelected] = useState(null);

  return (
    <div className="bg-zinc-900 text-white min-h-screen">
      <Navbar />
      <main className="px-4 md:px-8 pt-20 max-w-7xl mx-auto">
        <Banner onOpen={setSelected} />
        <section className="space-y-8 mt-6 pb-12">
          <Row title="Trending Now" fetchPath="/api/trending" onOpen={setSelected} />
          <Row title="Netflix Originals" fetchPath="/api/netflix-originals" large onOpen={setSelected} />
          <Row title="Top Rated" fetchPath="/api/top-rated" onOpen={setSelected} />
          <Row title="Action" fetchPath="/api/genre/28" onOpen={setSelected} />
          <Row title="Comedy" fetchPath="/api/genre/35" onOpen={setSelected} />
        </section>
      </main>

      {selected && <Modal item={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}

