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
// LoginPage Component (ohne Header/Footer, full width & zentriert)
// ---------------------
const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (response.ok) {
        console.log("Login erfolgreich – Navigiere zum Admin Dashboard");
        navigate('/admin');
      } else {
        console.error("Login fehlgeschlagen");
      }
    } catch (error) {
      console.error("Fehler beim Login:", error);
    }
  };

  return (
    // Verwende w-screen und h-screen, damit der Container die volle Breite/Höhe hat
    <div className="w-screen h-screen flex items-center justify-center bg-gradient-to-br from-white to-blue-50">
      {/* Entferne max-w, damit das Formular die volle Breite einnimmt */}
      <form
        onSubmit={handleLogin}
        className="bg-white/90 backdrop-blur-lg p-10 rounded-3xl shadow-2xl w-full"
      >
        <h2 className="text-4xl font-bold text-center text-gray-800 mb-6">Admin Login</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-base font-semibold text-gray-600">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-base"
            />
          </div>
          <div>
            <label className="block text-base font-semibold text-gray-600">Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
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
// AdminDashboard Component (AccessPoint-Management)
// ---------------------
// Dieses Beispiel basiert auf dem Backend-Schema für AccessPointDto, AccessPointCreateDTO und AccessPointUpdateDTO
interface AccessPoint {
  id: number;
  name: string | null;
  mac: string | null;
  ipAddress: string | null;
  description: string | null;
  connectedDevices: number;
  group: string | null;
  status: string | null;
  model: string | null;
  swVersion: string | null;
  channel: string | null;
  band: string | null;
  uptime: string | null;
}

const AdminDashboard: React.FC = () => {
  const [accessPoints, setAccessPoints] = useState<AccessPoint[]>([]);
  const [selectedAP, setSelectedAP] = useState<AccessPoint | null>(null);
  // Beispielhafte Felder zum Bearbeiten
  const [editName, setEditName] = useState<string>('');
  const [editIp, setEditIp] = useState<string>('');
  const [editStatus, setEditStatus] = useState<string>('');

  // Beim Mounten die AccessPoints vom Backend laden
  useEffect(() => {
    fetch('http://localhost:5000/api/AccessPoints')
      .then(response => response.json())
      .then((data: AccessPoint[]) => {
        setAccessPoints(data);
        if (data.length > 0) {
          handleSelectAP(data[0]);
        }
      })
      .catch(error => console.error("Fehler beim Laden der AccessPoints:", error));
  }, []);

  const handleSelectAP = (ap: AccessPoint) => {
    setSelectedAP(ap);
    setEditName(ap.name || '');
    setEditIp(ap.ipAddress || '');
    setEditStatus(ap.status || '');
  };

  const handleAddAP = async () => {
    // Beispielhafte Daten für einen neuen AccessPoint
    const newAPData = {
      name: "Neuer AccessPoint",
      mac: "",
      ipAddress: "",
      description: "",
      connectedDevices: 0,
      group: "",
      status: "inactive",
      model: "",
      swVersion: "",
      channel: "",
      band: "",
      uptime: ""
    };
    try {
      const response = await fetch('http://localhost:5000/api/AccessPoints', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAPData)
      });
      if (response.ok) {
        const createdAP: AccessPoint = await response.json();
        const newList = [...accessPoints, createdAP];
        setAccessPoints(newList);
        handleSelectAP(createdAP);
      } else {
        console.error("Fehler beim Hinzufügen des AccessPoints");
      }
    } catch (error) {
      console.error("Fehler beim Hinzufügen des AccessPoints:", error);
    }
  };

  const handleDeleteAP = async () => {
    if (!selectedAP) return;
    try {
      const response = await fetch(`http://localhost:5000/api/AccessPoints/${selectedAP.id}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        const filtered = accessPoints.filter(ap => ap.id !== selectedAP.id);
        setAccessPoints(filtered);
        if (filtered.length > 0) {
          handleSelectAP(filtered[0]);
        } else {
          setSelectedAP(null);
          setEditName('');
          setEditIp('');
          setEditStatus('');
        }
      } else {
        console.error("Fehler beim Löschen des AccessPoints");
      }
    } catch (error) {
      console.error("Fehler beim Löschen des AccessPoints:", error);
    }
  };

  const handleSaveChanges = async () => {
    if (!selectedAP) return;
    const updatedAPData = {
      name: editName,
      mac: selectedAP.mac,
      ipAddress: editIp,
      description: selectedAP.description,
      connectedDevices: selectedAP.connectedDevices,
      group: selectedAP.group,
      status: editStatus,
      model: selectedAP.model,
      swVersion: selectedAP.swVersion,
      channel: selectedAP.channel,
      band: selectedAP.band,
      uptime: selectedAP.uptime,
    };
    try {
      const response = await fetch(`http://localhost:5000/api/AccessPoints/${selectedAP.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedAPData)
      });
      if (response.ok) {
        const updatedList = accessPoints.map(ap =>
          ap.id === selectedAP.id ? { ...ap, ...updatedAPData } : ap
        );
        setAccessPoints(updatedList);
        setSelectedAP({ ...selectedAP, ...updatedAPData });
      } else {
        console.error("Fehler beim Aktualisieren des AccessPoints");
      }
    } catch (error) {
      console.error("Fehler beim Aktualisieren des AccessPoints:", error);
    }
  };

  return (
    <div className="min-h-screen w-full p-10 pt-32 pb-20 bg-gradient-to-br from-white via-blue-50 to-green-50 text-gray-800">
      <h1 className="text-4xl font-extrabold mb-6 text-indigo-800">Admin Dashboard</h1>
      <div className="flex gap-6">
        {/* Linke Spalte: AccessPoint-Liste */}
        <div className="w-1/3 bg-white p-6 shadow-lg rounded-lg flex flex-col">
          <h2 className="text-2xl font-bold mb-4">AccessPoints</h2>
          <div className="flex-1 overflow-y-auto space-y-2">
            {accessPoints.map(ap => (
              <div
                key={ap.id}
                onClick={() => handleSelectAP(ap)}
                className={`p-3 rounded-md cursor-pointer hover:bg-gray-100 ${selectedAP && selectedAP.id === ap.id ? 'bg-indigo-50' : ''}`}
              >
                <p className="font-semibold">{ap.name}</p>
                <p className="text-sm text-gray-600">
                  IP: {ap.ipAddress || 'Nicht gesetzt'} | Status: {ap.status || 'n/a'}
                </p>
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
              <h2 className="text-2xl font-bold mb-4">AccessPoint: {selectedAP.name}</h2>
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-semibold mb-1 text-gray-700">Name</label>
                  <input
                    type="text"
                    value={editName}
                    onChange={e => setEditName(e.target.value)}
                    className="w-full border border-gray-300 rounded-md p-2 text-base"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1 text-gray-700">IP Address</label>
                  <input
                    type="text"
                    value={editIp}
                    onChange={e => setEditIp(e.target.value)}
                    className="w-full border border-gray-300 rounded-md p-2 text-base"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1 text-gray-700">Status</label>
                  <input
                    type="text"
                    value={editStatus}
                    onChange={e => setEditStatus(e.target.value)}
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
              Wähle links einen AccessPoint oder füge einen neuen hinzu.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

// ---------------------
// Room Position Mapping (nach Etagen) – momentan leer, bitte ergänze selbst!
export const roomPositions: Record<
  string,
  Record<string, { x: number; y: number; width: number; height: number }>
> = {
  EG: {
    // Werte aus B_EG
    "1": { x: 219.5, y: 82.5, width: 222, height: 165 },  // eg-Raum1
    "2": { x: 811.5, y: 82.5, width: 203, height: 165 },  // eg-Raum2
    "3": { x: 1425.5, y: 82.5, width: 369, height: 165 }, // eg-Raum3
    "4": { x: 1019.5, y: 82.5, width: 244, height: 165 }, // eg-Raum4
    "5": { x: 436.5, y: 82.5, width: 240, height: 165 },  // eg-Raum5
    "6": { x: 760.5, y: 252.5, width: 431, height: 165 }, // eg-Raum6
    "7": { x: 1710.5, y: 252.5, width: 84, height: 89 },  // eg-Raum7
    "8": { x: 1347.5, y: 252.5, width: 358, height: 165 },// eg-Raum8
    "9": { x: 400.5, y: 252.5, width: 222, height: 165 }, // eg-Raum9
    "10": { x: 169.5, y: 252.5, width: 226, height: 165 },// eg-Raum10
  },
  "1. Stock": {
    // Werte aus B_1
    "1": { x: 219.5, y: 82.5, width: 235, height: 165 },  // og1-Raum1
    "2": { x: 811.5, y: 82.5, width: 222, height: 165 },  // og1-Raum2
    "3": { x: 459.5, y: 82.5, width: 217, height: 165 },  // og1-Raum3
    "4": { x: 1615.5, y: 82.5, width: 179, height: 165 }, // og1-Raum4
    "5": { x: 1425.5, y: 82.5, width: 185, height: 165 }, // og1-Raum5
    "6": { x: 1038.5, y: 82.5, width: 225, height: 165 }, // og1-Raum8
    "7": { x: 1361.5, y: 252.5, width: 154, height: 165 }, // og1-Raum6
    "8": { x: 1520.5, y: 252.5, width: 185, height: 165 }, // og1-Raum7
    "9": { x: 1707.5, y: 252.5, width: 84, height: 89 },   // og1-Raum9
    "10": { x: 100, y: 250, width: 525, height: 170 },       // og1-Raum10 (graues Areal als Raum)
    "11": { x: 758, y: 250, width: 436, height: 170 },       // og1-Raum11 (graues Areal als Raum)
  },
  "2. Stock": {
    "1": { x: 445.5, y: 82.5, width: 231, height: 165 },   // og2-Raum1
    "2": { x: 391.5, y: 252.5, width: 210, height: 165 },   // og2-Raum2
    "3": { x: 219.5, y: 82.5, width: 222, height: 165 },    // og2-Raum3
    "4": { x: 811.5, y: 82.5, width: 222, height: 165 },    // og2-Raum4
    "5": { x: 1030.5, y: 82.5, width: 222, height: 165 },   // og2-Raum5
    "6": { x: 169.5, y: 252.5, width: 222, height: 165 },   // og2-Raum6
    "7": { x: 1361.5, y: 252.5, width: 154, height: 165 },  // og2-Raum7
    "8": { x: 1652.5, y: 82.5, width: 154, height: 165 },   // og2-Raum8
    "9": { x: 1434.5, y: 82.5, width: 213, height: 165 },   // og2-Raum9
    "10": { x: 1520.5, y: 252.5, width: 185, height: 165 },  // og2-Raum10
  },
  "3. Stock": {
    "1": { x: 1361.5, y: 252.5, width: 179, height: 165 },  // og3-Raum1
    "2": { x: 1631.5, y: 82.5, width: 175, height: 165 },   // og3-Raum2
    "3": { x: 1425.5, y: 82.5, width: 201, height: 165 },   // og3-Raum3
    "4": { x: 1544.5, y: 252.5, width: 161, height: 165 },  // og3-Raum4
    "5": { x: 970.5, y: 252.5, width: 222, height: 165 },   // og3-Raum5
    "6": { x: 731.5, y: 252.5, width: 234, height: 165 },   // og3-Raum6
    "7": { x: 873.5, y: 82.5, width: 379, height: 165 },    // og3-Raum7
    "8": { x: 218.5, y: 82.5, width: 222, height: 165 },    // og3-Raum8
    "9": { x: 391.5, y: 252.5, width: 205, height: 165 },   // og3-Raum9
    "10": { x: 169.5, y: 252.5, width: 222, height: 165 },  // og3-Raum10
    "11": { x: 445.5, y: 82.5, width: 222, height: 165 },   // og3-Raum11
    "12": { x: 1707.5, y: 252.5, width: 84, height: 89 },   // og3-Raum12
    "13": { x: 1197.5, y: 246.5, width: 55, height: 80 },   // og3-Raum13
    "14": { x: 601.5, y: 246.5, width: 66, height: 80 },    // og3-Raum14
    "15": { x: 777.5, y: 82.5, width: 94, height: 165 },    // og3-Raum15
  },
  "4. Stock": {
    "1": { x: 169.5, y: 252.5, width: 125, height: 165 }, // og4-Raum1
    "2": { x: 458.5, y: 252.5, width: 138, height: 165 }, // og4-Raum2
    "3": { x: 299.5, y: 252.5, width: 154, height: 165 }, // og4-Raum3
    "4": { x: 445.5, y: 82.5, width: 222, height: 165 },  // og4-Raum4
    "5": { x: 218.5, y: 82.5, width: 222, height: 165 },  // og4-Raum5
    "6": { x: 958.5, y: 252.5, width: 234, height: 165 }, // og4-Raum6
    "7": { x: 731.5, y: 252.5, width: 222, height: 165 }, // og4-Raum7
    "8": { x: 1018.5, y: 82.5, width: 234, height: 165 }, // og4-Raum8
    "9": { x: 777.5, y: 82.5, width: 234, height: 165 },  // og4-Raum9
    "10": { x: 1634.5, y: 82.5, width: 172, height: 165 },// og4-Raum10
    "11": { x: 1425.5, y: 82.5, width: 204, height: 165 },// og4-Raum11
    "12": { x: 1361.5, y: 252.5, width: 232, height: 165 },// og4-Raum12
    "13": { x: 1738.5, y: 252.5, width: 68, height: 80 },  // og4-Raum13
    "14": { x: 1197.5, y: 250.5, width: 55, height: 80 },  // og4-Raum14
    "15": { x: 601.5, y: 250.5, width: 66, height: 80 },   // og4-Raum15
    "16": { x: 1598.5, y: 252.5, width: 135, height: 165 } // og4-Raum16
  },
  "5. Stock": {
    "1": { x: 763.5, y: 82.5, width: 236, height: 165 },   // og5-Raum1
    "2": { x: 1620.5, y: 82.5, width: 172, height: 165 },   // og5-Raum2
    "3": { x: 1411.5, y: 82.5, width: 204, height: 165 },   // og5-Raum5
    "4": { x: 1002.5, y: 82.5, width: 236, height: 165 },   // og5-Raum8
    "5": { x: 444.5, y: 82.5, width: 209, height: 165 },    // og5-Raum9
    "6": { x: 204.5, y: 82.5, width: 236, height: 165 },    // og5-Raum12
    "7": { x: 1347.5, y: 252.5, width: 180, height: 165 },  // og5-Raum3
    "8": { x: 1532.5, y: 252.5, width: 187, height: 165 },  // og5-Raum4
    "9": { x: 958.5, y: 252.5, width: 220, height: 165 },   // og5-Raum6
    "10": { x: 717.5, y: 252.5, width: 236, height: 165 },  // og5-Raum7
    "11": { x: 396.5, y: 252.5, width: 186, height: 165 },  // og5-Raum10
    "12": { x: 155.5, y: 252.5, width: 236, height: 165 },  // og5-Raum11
    "13": { x: 587.5, y: 250.5, width: 66, height: 80 },    // og5-Raum13
    "14": { x: 1180.5, y: 250.5, width: 58, height: 80 },   // og5-Raum14
    "15": { x: 1724.5, y: 252.5, width: 68, height: 80 }    // og5-Raum15
  },
};


// ---------------------
// OccupancyOverlay Component (Berechnung der Raumauslastung mit vorhandenen Endpoints)
// ---------------------
interface OccupancyData {
  RoomId: number;
  Occupancy: number;
}

const OccupancyOverlay: React.FC<{ floor: string }> = ({ floor }) => {
  const [occupancyData, setOccupancyData] = useState<OccupancyData[]>([]);

  useEffect(() => {
    // Parallel alle benötigten Daten abrufen
    Promise.all([
      fetch('http://localhost:5000/api/Rooms').then(res => res.json()),
      fetch('http://localhost:5000/api/RoomAccessPoints').then(res => res.json()),
      fetch('http://localhost:5000/api/AccessPoints').then(res => res.json())
    ])
      .then(([rooms, roomAccessPoints, accessPoints]) => {
        // Filtere Räume, die dem gewünschten Stockwerk entsprechen
        const roomsOnFloor = rooms.filter((room: any) => room.floorName === floor);
        // Berechne für jeden Raum die Auslastung
        const computedOccupancy = roomsOnFloor.map((room: any) => {
          // Finde alle Zuordnungen für diesen Raum
          const mappings = roomAccessPoints.filter((map: any) => map.roomId === room.id);
          // Summe die connectedDevices der zugeordneten AccessPoints
          const occupancy = mappings.reduce((sum: number, map: any) => {
            const ap = accessPoints.find((a: any) => a.id === map.accesspointId);
            return sum + (ap ? ap.connectedDevices : 0);
          }, 0);
          return { RoomId: room.id, Occupancy: occupancy };
        });
        setOccupancyData(computedOccupancy);
      })
      .catch(error => console.error("Error fetching occupancy data:", error));
  }, [floor]);

  // roomPositions sollte wie gehabt definiert sein (Mapping: Stockwerk -> Raum-ID -> Position)
  const positions = roomPositions[floor];

  return (
    <>
      {occupancyData.map(data => {
        const pos = positions ? positions[data.RoomId.toString()] : undefined;
        if (!pos) return null;
        return (
          <rect
            key={data.RoomId}
            x={pos.x}
            y={pos.y}
            width={pos.width}
            height={pos.height}
            fill={getRoomColor(data.Occupancy)}
          />
        );
      })}
    </>
  );
};

function getRoomColor(occupancy: number): string {
  if (occupancy < 33) return "rgba(0,255,0,0.4)";   // Grün
  if (occupancy < 66) return "rgba(255,255,0,0.4)";   // Gelb
  return "rgba(255,0,0,0.4)";                          // Rot
}


// ---------------------
// InteractiveFloorPlan Component (für alle Stockwerke)
// ---------------------
const InteractiveFloorPlan: React.FC = () => {
  // Dictionary: Gebäude -> Stockwerk -> SVG-Pfad
  const floorPaths: Record<string, Record<string, string>> = {
    "Bruggerstrasse": {
      "EG": "/assets/Bruggerstrasse/B_EG.svg",
      "1. Stock": "/assets/Bruggerstrasse/B_1.svg",
      "2. Stock": "/assets/Bruggerstrasse/B_2.svg",
      "3. Stock": "/assets/Bruggerstrasse/B_3.svg",
      "4. Stock": "/assets/Bruggerstrasse/B_4.svg",
      "5. Stock": "/assets/Bruggerstrasse/B_5.svg",
    },
    "Martinsberg": {
      /*
      "EG": "/assets/Martinsberg/M_EG.svg",
      "1. Stock": "/assets/Martinsberg/M_1.svg",
      "2. Stock": "/assets/Martinsberg/M_2.svg",
      "3. Stock": "/assets/Martinsberg/M_3.svg",
      "4. Stock": "/assets/Martinsberg/M_4.svg",
      "5. Stock": "/assets/Martinsberg/M_5.svg",
      */
    },
  };

  const buildings = Object.keys(floorPaths);
  const floors = ["EG", "1. Stock", "2. Stock", "3. Stock", "4. Stock", "5. Stock"];
  const [selectedBuilding, setSelectedBuilding] = React.useState<string>(buildings[0]);
  const [selectedFloor, setSelectedFloor] = React.useState<string>("EG");

  const selectedFile = floorPaths[selectedBuilding][selectedFloor];

  const ViewerRef = React.useRef<any>(null);
  React.useEffect(() => {
    if (ViewerRef.current) {
      setTimeout(() => {
        ViewerRef.current.fitToViewer();
      }, 50);
    }
  }, [selectedFile]);

  return (
    <div className="p-4">
      <div className="flex flex-row gap-4 justify-center">
        <div>
          <label className="block text-base font-semibold text-gray-700">Gebäude</label>
          <select
            value={selectedBuilding}
            onChange={(e) => {
              setSelectedBuilding(e.target.value);
              setSelectedFloor("EG");
            }}
            className="mt-1 block p-2 border border-gray-300 rounded-md text-base text-black"
          >
            {buildings.map((building) => (
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
            onChange={(e) => setSelectedFloor(e.target.value)}
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
      <div className="relative mt-4 border border-gray-300 rounded-lg">
        <UncontrolledReactSVGPanZoom
          width={800}
          height={600}
          tool="auto"
          background="#1E1E1E"
          ref={ViewerRef}
        >
          <svg width="1970" height="500" viewBox="0 0 1970 500">
            <image href={selectedFile} width="1970" height="500" />
          </svg>
        </UncontrolledReactSVGPanZoom>
      </div>
      {/* Legende */}
      <div className="mt-4 flex justify-center space-x-4">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 bg-green-500" />
          <span className="text-base text-gray-700">Wenig Auslastung</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 bg-yellow-500" />
          <span className="text-base text-gray-700">Mässig Auslastung</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 bg-red-500" />
          <span className="text-base text-gray-700">Hohe Auslastung</span>
        </div>
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
        <div className="flex-1 bg-white/80 backdrop-blur-lg p-6 rounded-2xl shadow-xl text-center flex flex-col gap-4">
          <h2 className="text-2xl font-semibold text-indigo-700 mb-4">
            Live Auslastung anzeigen
          </h2>
          <p className="text-gray-600 text-base max-w-xs mx-auto">
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
              <a href="https://www.badnpm install --save-dev @types/react-router-domen-hackt.ch" className="text-indigo-600 underline">
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
// Fullscreen Display
//-------------------
const FullscreenFloorplan: React.FC = () => {
  // Dictionary: Gebäude -> Stockwerk -> kompletter File-Path zum SVG (Dateien liegen im public-Ordner)
  const floorPaths: Record<string, Record<string, string>> = {
    Bruggerstrasse: {
      "EG": "/assets/Bruggerstrasse/B_EG.svg",
      "1. Stock": "/assets/Bruggerstrasse/B_1.svg",
      "2. Stock": "/assets/Bruggerstrasse/B_2.svg",
      "3. Stock": "/assets/Bruggerstrasse/B_3.svg",
      "4. Stock": "/assets/Bruggerstrasse/B_4.svg",
      "5. Stock": "/assets/Bruggerstrasse/B_5.svg",
    },
  };

  const selectedBuilding = "Bruggerstrasse";
  const floors = ["EG", "1. Stock", "2. Stock", "3. Stock", "4. Stock", "5. Stock"];
  const [currentFloorIndex, setCurrentFloorIndex] = useState(0);
  const currentFloor = floors[currentFloorIndex];

  // Hole den File-Pfad aus dem Dictionary basierend auf dem aktuellen Stockwerk
  const selectedFile = floorPaths[selectedBuilding][currentFloor];

  // Automatischer Wechsel alle 5 Sekunden
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentFloorIndex(prev => (prev + 1) % floors.length);
    }, 5000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="w-screen h-screen flex flex-col" style={{ backgroundColor: "#1E1E1E" }}>
      {/* Fixierter Header mit der Hintergrundfarbe */}
      <header className="fixed top-0 left-0 w-full h-20 z-50 flex items-center justify-center" style={{ backgroundColor: "#1E1E1E" }}>
        {/* Optional: Header-Inhalt */}
      </header>

      {/* Hauptbereich: Abstand vom Header (pt-20) */}
      <div className="flex flex-col flex-1 pt-40 items-center justify-center" style={{ backgroundColor: "#1E1E1E" }}>
        {/* Text zwischen Header und Bild */}
        <div className="text-white text-4xl mb-4">
          {selectedBuilding} – {currentFloor}
        </div>
        <div className="mt-4 flex justify-center space-x-4">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 bg-green-500" />
          <span className="text-base text-white-700">Wenig Auslastung</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 bg-yellow-500" />
          <span className="text-base text-white-700">Mässig Auslastung</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 bg-red-500" />
          <span className="text-base text-white-700">Hohe Auslastung</span>
        </div>
      </div>
        {/* Bildbereich */}
        <div className="w-full flex-1 flex items-center justify-center">
          <img 
            src={selectedFile}
            alt={`Floorplan ${currentFloor}`}
            className="max-w-full max-h-full object-contain"
          />
        </div>
      </div>
    </div>
  );
}
// ---------------------
// Main App Component mit Routing
// ---------------------
const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/display" element={<FullscreenFloorplan />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/" element={<UserView />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
};

export default App;
