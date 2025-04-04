// App.tsx
import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom';

const Header: React.FC = () => {
  return (
    <header className="fixed top-0 left-0 w-full flex justify-between items-center px-8 py-5 bg-white/70 backdrop-blur-md shadow-lg z-50 border-b border-gray-200">
      <div className="text-4xl font-bold tracking-tight text-indigo-700">Lernplatz+</div>
      <Link
        to="/login"
        className="bg-indigo-900 text-white px-6 py-3 rounded-full font-medium hover:bg-indigo-800 transition"
      >
        Admin Panel
      </Link>
    </header>
  );
};

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white py-4 fixed bottom-0 w-full">
      <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row items-center justify-between">
        <p className="text-base">© 2025 Lernplatz+ - Alle Rechte vorbehalten</p>
        <div className="flex space-x-6 mt-2 md:mt-0">
          <a
            href="https://github.com/halva2251/BBB-Leitsystem/tree/main"
            className="text-base hover:text-indigo-400 transition"
          >
            Github
          </a>
          <a
            href="https://www.baden-hackt.ch"
            className="text-base hover:text-indigo-400 transition"
          >
            Webseite Baden Hackt 2025
          </a>
        </div>
      </div>
    </footer>
  );
};

const LoginPage: React.FC = () => {
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Login attempt");
    navigate('/admin');
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center pt-32 pb-20 bg-gradient-to-br from-white to-blue-50">
      <form
        onSubmit={handleLogin}
        className="bg-white/90 backdrop-blur-lg p-10 rounded-3xl shadow-2xl w-full max-w-lg"
      >
        <h2 className="text-4xl font-bold text-center text-gray-800 mb-6">Admin Login</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-base font-semibold text-gray-600">Email</label>
            <input
              type="email"
              className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-base"
              required
            />
          </div>
          <div>
            <label className="block text-base font-semibold text-gray-600">Password</label>
            <input
              type="password"
              className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-base"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition duration-300 mt-4 text-base"
          >
            Login
          </button>
        </div>
      </form>
    </div>
  );
};

const AdminDashboard: React.FC = () => {
  return (
    <div className="min-h-screen w-full p-10 pt-32 pb-20 bg-gradient-to-br from-white via-blue-50 to-green-50 text-gray-800">
      <h1 className="text-4xl font-extrabold mb-6 text-indigo-800">Admin Dashboard</h1>
      <p className="text-xl">
        Verwalte Accesspoints und Live-Belegungsdaten zentral an einem Ort.
      </p>
    </div>
  );
};

const InteractiveFloorPlan: React.FC = () => {
  const [selectedBuilding, setSelectedBuilding] = useState("Martinsberg");
  const [selectedFloor, setSelectedFloor] = useState("EG");

  // Beide Gebäude haben 6 Stockwerke: EG und 1.–5. Stock
  const floors = ["EG", "1", "2", "3", "4", "5"];

  return (
    <div>
      {/* Relative Container für die Karte mit Zoom-Overlay */}
      <div className="relative w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center shadow-inner">
        <p className="text-xl text-gray-600">Karte hier einfügen</p>
        {/* Zoom-Controls als Overlay */}
        <div className="absolute top-2 right-2 flex flex-col space-y-2">
          <button className="w-8 h-8 bg-white border border-gray-300 rounded-full flex items-center justify-center text-xl font-bold hover:bg-gray-100">
            +
          </button>
          <button className="w-8 h-8 bg-white border border-gray-300 rounded-full flex items-center justify-center text-xl font-bold hover:bg-gray-100">
            -
          </button>
        </div>
      </div>
      {/* Navigation unter der Karte */}
      <div className="mt-4 flex flex-row gap-4 justify-center">
        <div>
          <label className="block text-base font-semibold text-gray-700">Gebäude</label>
          <select
            value={selectedBuilding}
            onChange={(e) => {
              setSelectedBuilding(e.target.value);
              setSelectedFloor("EG"); // ggf. Floor zurücksetzen
            }}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md text-base text-black"
          >
            <option value="Martinsberg">Martinsberg</option>
            <option value="Bruggerstrasse">Bruggerstrasse</option>
          </select>
        </div>
        <div>
          <label className="block text-base font-semibold text-gray-700">Stockwerk</label>
          <select
            value={selectedFloor}
            onChange={(e) => setSelectedFloor(e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md text-base text-black"
          >
            {floors.map((floor) => (
              <option key={floor} value={floor}>
                {floor === "EG" ? "Erdgeschoss" : `${floor}. Stock`}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

const UserView: React.FC = () => {
  return (
    <div className="min-h-screen w-full pt-28 pb-20 px-8 bg-gradient-to-br from-white via-mint-50 to-indigo-100">
      <div className="text-center mb-14">
        <h1 className="text-6xl font-bold mb-4 text-indigo-800 drop-shadow-md">
          Willkommen bei Lernplatz+
        </h1>
        <p className="text-2xl text-gray-600">
          Finde deinen perfekten Arbeitsplatz – schnell, smart und immer aktuell.
        </p>
      </div>

      <div className="flex flex-row justify-center items-stretch gap-10">
        {/* Panel: Interaktiver Grundriss */}
        <div className="flex-1 bg-white/80 backdrop-blur-lg p-6 rounded-2xl shadow-xl">
          <h2 className="text-2xl font-semibold text-indigo-700 mb-4">Interaktiver Grundriss</h2>
          <InteractiveFloorPlan />
        </div>

        {/* Panel: Live-Auslastung */}
        <div className="flex-1 bg-white/80 backdrop-blur-lg p-6 rounded-2xl shadow-xl text-center flex flex-col gap-6 items-center justify-center">
          <p className="text-gray-600 text-base max-w-xs">
            Mit nur einem Klick erhältst du die aktuelle Auslastung deiner Wunschbereiche – bleib immer up-to-date.
          </p>
          {["URL kopieren", "URL kopieren", "URL kopieren"].map((btn, i) => (
            <div key={i} className="space-y-1">
              <button className="w-44 bg-indigo-600 text-white py-2 rounded-full hover:bg-indigo-700 transition font-medium shadow-md text-base">
                {btn}
              </button>
              <p className="text-sm text-gray-500">
                {i === 0
                  ? "Auslastung Martinsberg"
                  : i === 1
                  ? "Auslastung Bruggerstrasse"
                  : "Kombinierte Auslastung"}
              </p>
            </div>
          ))}
        </div>

        {/* Panel: Info & Über Uns */}
        <div className="flex-1 bg-white/80 backdrop-blur-lg p-6 rounded-2xl shadow-xl">
          <h2 className="text-2xl font-semibold text-indigo-700 mb-4">Info & Über Uns</h2>
          <div className="text-gray-700 text-base space-y-3">
            <p>
              <strong>Systemerklärung:</strong> Unser smartes System misst kontinuierlich die verbundenen Geräte der Accesspoints, die in den Gebäuden verteilt sind. Dadurch ermitteln wir in Echtzeit, wo gerade viel los ist – und du findest blitzschnell den freien Arbeitsplatz in der BBB.
            </p>
            <p>
              <strong>Über uns:</strong> Wir, Keanu Koelewijn, Julius Burlet, Alberto Manser, Enis Shorra & Yen Sauliak, haben dieses innovative Projekt mit Unterstützung der BBBaden im Hackathon 2025 "Baden Hackt" realisiert. Entdecke mehr auf unserem{' '}
              <a href="https://github.com/halva2251/BBB-Leitsystem/tree/main" className="text-indigo-600 underline">
                Github
              </a>{' '}
              oder besuche die{' '}
              <a href="https://www.baden-hackt.ch" className="text-indigo-600 underline">
                Webseite Baden Hackt 2025
              </a>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <div className="min-h-screen w-screen overflow-x-hidden font-sans pb-20">
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/" element={<UserView />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </div>
  );
};

export default App;
