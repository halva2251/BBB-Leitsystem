import React from 'react';
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  return (
    <div className="min-h-screen p-4 bg-gray-100">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Admin Panel</h1>
        <button className="bg-red-500 text-white px-4 py-2 rounded">Logout</button>
      </header>
      <nav className="mb-4">
        <ul className="flex space-x-4">
          <li><Link to="/admin/users" className="text-blue-500 hover:underline">Nutzer</Link></li>
          <li><Link to="/admin/settings" className="text-blue-500 hover:underline">Einstellungen</Link></li>
        </ul>
      </nav>
      <section>
        <h2 className="text-2xl font-bold mb-4">Belegungsübersicht</h2>
        <div className="bg-white p-4 rounded shadow">
          <p>Hier kannst du die aktiven Accesspoints und Nutzerzahlen verwalten.</p>
          {/* Weitere Komponenten, wie Diagramme oder Listen, können hier ergänzt werden */}
        </div>
      </section>
    </div>
  );
}
