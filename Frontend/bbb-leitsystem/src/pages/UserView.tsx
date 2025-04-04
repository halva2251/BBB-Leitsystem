import React from 'react';
import FloorPlanMap from '../components/FloorPlanMap';

export default function UserView() {
  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-center">Lernplatz-Leitsystem</h1>
      </header>
      <main>
        <div className="max-w-4xl mx-auto bg-white rounded shadow p-4">
          <FloorPlanMap />
        </div>
        <div className="mt-4 text-center">
          <button 
            onClick={() => { navigator.clipboard.writeText(window.location.href); }}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
          >
            Link kopieren
          </button>
        </div>
      </main>
    </div>
  );
}
