// App.tsx
import React, { useState, useRef, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { UncontrolledReactSVGPanZoom } from 'react-svg-pan-zoom';

// ---------------------
// Header Component
// ---------------------
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

// ---------------------
// Footer Component
// ---------------------
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

// ---------------------
// LoginPage Component (Dummy-Implementierung)
// ---------------------
const LoginPage: React.FC = () => {
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Dummy Login - Navigiere zum Admin Dashboard");
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
            />
          </div>
          <div>
            <label className="block text-base font-semibold text-gray-600">Password</label>
            <input
              type="password"
              className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-base"
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

// ---------------------
// AdminDashboard Component
// ---------------------
interface AccessPoint {
  id: number;
  name: string;
  room: string;
  position: string;
}

const AdminDashboard: React.FC = () => {
  const [accessPoints, setAccessPoints] = useState<AccessPoint[]>([
    { id: 1, name: 'AP 1', room: 'Raum 101', position: 'EG' },
    { id: 2, name: 'AP 2', room: 'Raum 202', position: '1. Stock' },
  ]);
  const [selectedAP, setSelectedAP] = useState<AccessPoint | null>(accessPoints[0] || null);
  const [editName, setEditName] = useState(selectedAP?.name || '');
  const [editRoom, setEditRoom] = useState(selectedAP?.room || '');
  const [editPosition, setEditPosition] = useState(selectedAP?.position || '');

  const handleSelectAP = (ap: AccessPoint) => {
    setSelectedAP(ap);
    setEditName(ap.name);
    setEditRoom(ap.room);
    setEditPosition(ap.position);
  };

  const handleAddAP = () => {
    const newAP: AccessPoint = {
      id: Date.now(),
      name: 'Neuer AP',
      room: 'Raum X',
      position: 'EG',
    };
    const newList = [...accessPoints, newAP];
    setAccessPoints(newList);
    handleSelectAP(newAP);
  };

  const handleDeleteAP = () => {
    if (!selectedAP) return;
    const filtered = accessPoints.filter((ap) => ap.id !== selectedAP.id);
    setAccessPoints(filtered);
    if (filtered.length > 0) {
      handleSelectAP(filtered[0]);
    } else {
      setSelectedAP(null);
      setEditName('');
      setEditRoom('');
      setEditPosition('');
    }
  };

  const handleSaveChanges = () => {
    if (!selectedAP) return;
    const updatedList = accessPoints.map((ap) =>
      ap.id === selectedAP.id
        ? { ...ap, name: editName, room: editRoom, position: editPosition }
        : ap
    );
    setAccessPoints(updatedList);
    setSelectedAP({ ...selectedAP, name: editName, room: editRoom, position: editPosition });
  };

  return (
    <div className="min-h-screen w-full p-10 pt-32 pb-20 bg-gradient-to-br from-white via-blue-50 to-green-50 text-gray-800">
      <h1 className="text-4xl font-extrabold mb-6 text-indigo-800">Admin Dashboard</h1>
      <div className="flex gap-6">
        {/* Linke Spalte: Accesspoint-Liste */}
        <div className="w-1/3 bg-white p-6 shadow-lg rounded-lg flex flex-col">
          <h2 className="text-2xl font-bold mb-4">Accesspoints</h2>
          <div className="flex-1 overflow-y-auto space-y-2">
            {accessPoints.map((ap) => (
              <div
                key={ap.id}
                onClick={() => handleSelectAP(ap)}
                className={`p-3 rounded-md cursor-pointer hover:bg-gray-100 ${
                  selectedAP && selectedAP.id === ap.id ? 'bg-indigo-50' : ''
                }`}
              >
                <p className="font-semibold">{ap.name}</p>
                <p className="text-sm text-gray-600">{ap.room}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 flex justify-between">
            <button
              onClick={handleAddAP}
              className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition"
            >
              +
            </button>
            <button
              onClick={handleDeleteAP}
              className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
              disabled={!selectedAP}
            >
              -
            </button>
          </div>
        </div>
        {/* Rechte Spalte: Detailansicht */}
        <div className="w-2/3 bg-white p-6 shadow-lg rounded-lg">
          {selectedAP ? (
            <>
              <h2 className="text-2xl font-bold mb-4">Raum: {selectedAP.room}</h2>
              <div className="w-full h-48 bg-gray-200 rounded-md flex items-center justify-center mb-6">
                <p className="text-gray-500">Raumplan/Bild hier einfügen</p>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-semibold mb-1 text-gray-700">
                    Name
                  </label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full border border-gray-300 rounded-md p-2 text-base"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1 text-gray-700">
                    Raum
                  </label>
                  <input
                    type="text"
                    value={editRoom}
                    onChange={(e) => setEditRoom(e.target.value)}
                    className="w-full border border-gray-300 rounded-md p-2 text-base"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1 text-gray-700">
                    Position
                  </label>
                  <input
                    type="text"
                    value={editPosition}
                    onChange={(e) => setEditPosition(e.target.value)}
                    className="w-full border border-gray-300 rounded-md p-2 text-base"
                  />
                </div>
              </div>
              <button
                onClick={handleSaveChanges}
                className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition"
              >
                Änderungen speichern
              </button>
            </>
          ) : (
            <p className="text-lg text-gray-600">
              Wähle links einen Accesspoint oder füge einen neuen hinzu.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

// ---------------------
// InteractiveFloorPlan Component (mit Dictionary für File-Paths und Zoom-Container mit Hintergrund #1E1E1E)
// ---------------------
const InteractiveFloorPlan: React.FC = () => {
  const [selectedBuilding, setSelectedBuilding] = useState<keyof typeof floorPaths>("Bruggerstrasse");
  const [selectedFloor, setSelectedFloor] = useState<keyof typeof floorPaths["Bruggerstrasse"]>("EG");

  // Definierte Stockwerke – keys müssen exakt mit den Dictionary-Einträgen übereinstimmen
  const floors = ["EG", "1. Stock", "2. Stock", "3. Stock", "4. Stock", "5. Stock"];

  // Dictionary: Gebäude -> Stockwerk -> kompletter File-Path zum SVG (Dateien liegen im public-Ordner)
  const floorPaths: Record<string, Record<string, string>> = {
    Bruggerstrasse: {
      "EG": "../public/assets/Bruggerstrasse/B_EG.svg",
      "1. Stock": "../public/assets/Bruggerstrasse/B_1.svg",
      "2. Stock": "../public/assets/Bruggerstrasse/B_2.svg",
      "3. Stock": "../public/assets/Bruggerstrasse/B_3.svg",
      "4. Stock": "../public/assets/Bruggerstrasse/B_4.svg",
      "5. Stock": "../public/assets/Bruggerstrasse/B_5.svg",
    },
  };

  const selectedFile = floorPaths[selectedBuilding][selectedFloor];

  // Ref für den SVG-Pan/Zoom-Viewer
  const ViewerRef = useRef<any>(null);

  // Nach dem Rendern: Automatisches "Fit to Viewer"
  useEffect(() => {
    if (ViewerRef.current) {
      setTimeout(() => {
        ViewerRef.current.fitToViewer();
      }, 50);
    }
  }, [selectedFile]);

  return (
    <div className="p-4">
      {/* Auswahl der Gebäude und Stockwerke */}
      <div className="flex flex-row gap-4 justify-center">
        <div>
          <label className="block text-base font-semibold text-gray-700">Gebäude</label>
          <select
            value={selectedBuilding}
            onChange={(e) => {
              setSelectedBuilding(e.target.value as keyof typeof floorPaths);
              setSelectedFloor("EG");
            }}
            className="mt-1 block p-2 border border-gray-300 rounded-md text-base text-black"
          >
            {Object.keys(floorPaths).map((building) => (
              <option key={building} value={building}>
                {building}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-base font-semibold text-gray-700">Stockwerk</label>
          <select
            value={selectedFloor}
            onChange={(e) => setSelectedFloor(e.target.value as keyof typeof floorPaths["Bruggerstrasse"])}
            className="mt-1 block p-2 border border-gray-300 rounded-md text-base text-black"
          >
            {floors.map((floor) => (
              <option key={floor} value={floor}>
                {floor}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Anzeige der SVG-Karte in einem Zoom-Container */}
      <div className="mt-4 border border-gray-300 rounded-lg">
        <UncontrolledReactSVGPanZoom
          width={800}
          height={600}
          tool="auto"
          background="#1E1E1E" // Zoom-Container-Hintergrund auf #1E1E1E gesetzt
          ref={ViewerRef}
        >
          <svg width="1970" height="500" viewBox="0 0 1970 500">
            <image href={selectedFile} width="1970" height="500" />
          </svg>
        </UncontrolledReactSVGPanZoom>
      </div>
    </div>
  );
};

// ---------------------
// UserView Component
// ---------------------
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
        <div className="flex-1 bg-white/80 backdrop-blur-lg p-6 rounded-2xl shadow-xl">
          <h2 className="text-2xl font-semibold text-indigo-700 mb-4">Interaktiver Grundriss</h2>
          <InteractiveFloorPlan />
        </div>
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

//-------------------
//fullscreen Display
//-------------------

const floors = ["EG", "1. Stock", "2. Stock", "3. Stock", "4. Stock", "5. Stock"]

// Display-Komponente, die auf Vollbild läuft
const DisplayView: React.FC = () => {
  const [currentFloorIndex, setCurrentFloorIndex] = useState(0)

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentFloorIndex((prev) => (prev + 1) % floors.length)
    }, 5000)
    return () => clearInterval(intervalId)
  }, [])

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-black">
      <h1 className="text-white text-8xl">{floors[currentFloorIndex]}</h1>
    </div>
  )
}
// App-Komponente mit Routing
const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/display" element={<DisplayView />} />
        <Route path="/login" element={<LoginPage />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/" element={<UserView />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;
