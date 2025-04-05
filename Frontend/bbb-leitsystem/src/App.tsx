// App.tsx
import React, { useState, useRef, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet, useNavigate, Link } from 'react-router-dom';
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
const PrivateRoute: React.FC = () => {
  const isAuthenticated = localStorage.getItem('auth') === 'true';
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

// ----- LoginPage Component (Dummy-Implementierung) -----
const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Hier wird der Login simuliert – im echten System würde hier die Authentifizierung erfolgen.
    localStorage.setItem('auth', 'true');
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
// AdminDashboard Component (dynamisches Accesspoint-Management)
// ---------------------
// ----- Schnittstellen basierend auf dem Schema -----
// ----- Schnittstellen basierend auf dem Schema -----
export interface AccessPointDto {
  id: number;
  name?: string;
  mac?: string;
  ipAddress?: string;
  description?: string;
  connectedDevices: number;
  group?: string;
  status?: string;
  model?: string;
  swVersion?: string;
  channel?: string;
  band?: string;
  uptime?: string;
}

export interface AccessPointCreateDTO {
  name?: string;
  mac?: string;
  ipAddress?: string;
  description?: string;
  connectedDevices: number;
  group?: string;
  status?: string;
  model?: string;
  swVersion?: string;
  channel?: string;
  band?: string;
  uptime?: string;
}

export interface AccessPointUpdateDTO {
  name?: string;
  mac?: string;
  ipAddress?: string;
  description?: string;
  connectedDevices: number;
  group?: string;
  status?: string;
  model?: string;
  swVersion?: string;
  channel?: string;
  band?: string;
  uptime?: string;
}

export interface BuildingDTO {
  id: number;
  name?: string;
  description?: string;
}

export interface BuildingCreateDTO {
  name?: string;
  description?: string;
}

export interface BuildingUpdateDTO {
  name?: string;
  description?: string;
}

export interface FloorDTO {
  id: number;
  buildingId: number;
  name?: string;
  description?: string;
}

export interface FloorCreateDTO {
  buildingId: number;
  name?: string;
  description?: string;
}

export interface FloorUpdateDTO {
  buildingId: number;
  name?: string;
  description?: string;
}

export interface RoomDTO {
  id: number;
  name?: string;
  floorId: number;
  floorName?: string;
  capacity: number;
  type?: string;
  isActive: boolean;
}

export interface RoomCreateDTO {
  name?: string;
  floorId: number;
  capacity: number;
  type?: string;
  isActive: boolean;
}

export interface RoomUpdateDTO {
  name?: string;
  floorId: number;
  capacity: number;
  type?: string;
  isActive: boolean;
}

export interface RoomAccesspointDTO {
  roomId: number;
  accesspointId: number;
}

export interface RoomAccesspointCreateDTO {
  roomId: number;
  accesspointId: number;
}

// ----- Hilfsfunktion: API-Call -----
async function api<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, options);
  if (!res.ok) {
    throw new Error(`API Error: ${res.statusText}`);
  }
  return res.json();
}

// ----- AdminDashboard mit moderner, übersichtlicher UI -----
// Es gibt Tabs für die einzelnen Module. Die Erfassung neuer Datensätze erfolgt
// über integrierte Formulare, deren Daten per API in die Datenbank geschrieben werden.
const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    'accesspoints' | 'buildings' | 'floors' | 'rooms' | 'roomaccesspoints'
  >('accesspoints');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-green-50 text-gray-800">
      <div className="container mx-auto p-8 pt-32">
        <h1 className="text-5xl font-extrabold text-indigo-800 text-center mb-10">
          Admin Dashboard
        </h1>
        <nav className="mb-10">
          <ul className="flex justify-center gap-6">
            {[
              { id: 'accesspoints', label: 'Accesspoints' },
              { id: 'buildings', label: 'Gebäude' },
              { id: 'floors', label: 'Stockwerke' },
              { id: 'rooms', label: 'Räume' },
              { id: 'roomaccesspoints', label: 'Room-Accesspoints' },
            ].map((tab) => (
              <li key={tab.id}>
                <button
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-6 py-3 rounded-full transition-all font-semibold shadow-md ${
                    activeTab === tab.id
                      ? 'bg-indigo-600 text-white transform scale-105'
                      : 'bg-white text-gray-800 hover:bg-indigo-100'
                  }`}
                >
                  {tab.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>
        <div className="bg-white rounded-xl shadow-xl p-6">
          {activeTab === 'accesspoints' && <AccessPointAdmin />}
          {activeTab === 'buildings' && <BuildingAdmin />}
          {activeTab === 'floors' && <FloorAdmin />}
          {activeTab === 'rooms' && <RoomAdmin />}
          {activeTab === 'roomaccesspoints' && <RoomAccessPointAdmin />}
        </div>
      </div>
    </div>
  );
};

// ----- AccessPointAdmin Component -----
const AccessPointAdmin: React.FC = () => {
  const [accessPoints, setAccessPoints] = useState<AccessPointDto[]>([]);
  const [selectedAP, setSelectedAP] = useState<AccessPointDto | null>(null);
  const [editForm, setEditForm] = useState<AccessPointUpdateDTO>({ connectedDevices: 0 });
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [createForm, setCreateForm] = useState<AccessPointCreateDTO>({ connectedDevices: 0 });

  useEffect(() => {
    api<AccessPointDto[]>('/api/AccessPoints')
      .then((data) => {
        setAccessPoints(data);
        if (data.length) setSelectedAP(data[0]);
      })
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    if (selectedAP) {
      setEditForm({
        name: selectedAP.name,
        mac: selectedAP.mac,
        ipAddress: selectedAP.ipAddress,
        description: selectedAP.description,
        connectedDevices: selectedAP.connectedDevices,
        group: selectedAP.group,
        status: selectedAP.status,
        model: selectedAP.model,
        swVersion: selectedAP.swVersion,
        channel: selectedAP.channel,
        band: selectedAP.band,
        uptime: selectedAP.uptime,
      });
    }
  }, [selectedAP]);

  const handleSelectAP = (ap: AccessPointDto) => {
    setIsCreating(false);
    setSelectedAP(ap);
  };

  const handleCreate = async () => {
    try {
      const created = await api<AccessPointDto>('/api/AccessPoints', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(createForm),
      });
      setAccessPoints([...accessPoints, created]);
      setSelectedAP(created);
      setIsCreating(false);
      setCreateForm({ connectedDevices: 0 });
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteAP = async () => {
    if (!selectedAP) return;
    try {
      await api<void>(`/api/AccessPoints/${selectedAP.id}`, { method: 'DELETE' });
      const filtered = accessPoints.filter((ap) => ap.id !== selectedAP.id);
      setAccessPoints(filtered);
      setSelectedAP(filtered[0] || null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveChanges = async () => {
    if (!selectedAP) return;
    try {
      await api<void>(`/api/AccessPoints/${selectedAP.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm),
      });
      const updatedList = accessPoints.map((ap) =>
        ap.id === selectedAP.id ? ({ ...selectedAP, ...editForm } as AccessPointDto) : ap
      );
      setAccessPoints(updatedList);
      setSelectedAP({ ...selectedAP, ...editForm } as AccessPointDto);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Linke Spalte: Liste und Neuerfassung */}
      <div className="bg-gray-50 p-6 rounded-xl shadow-sm">
        <h2 className="text-2xl font-bold mb-4 border-b pb-2">Accesspoints</h2>
        <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
          {accessPoints.length === 0 ? (
            <p className="text-gray-500">Keine Einträge vorhanden.</p>
          ) : (
            accessPoints.map((ap) => (
              <div
                key={ap.id}
                onClick={() => handleSelectAP(ap)}
                className={`p-3 rounded-md cursor-pointer transition-colors ${
                  selectedAP && selectedAP.id === ap.id ? 'bg-indigo-100' : 'hover:bg-gray-100'
                }`}
              >
                <p className="font-semibold">{ap.name}</p>
                <p className="text-sm text-gray-600">ID: {ap.id}</p>
              </div>
            ))
          )}
        </div>
        <div className="mt-4 flex justify-around">
          <button
            onClick={() => setIsCreating(!isCreating)}
            className="bg-blue-500 text-white px-4 py-2 rounded-full shadow hover:bg-blue-600 transition"
          >
            {isCreating ? 'Abbrechen' : 'Neuer Accesspoint'}
          </button>
          <button
            onClick={handleDeleteAP}
            className="bg-red-500 text-white px-4 py-2 rounded-full shadow hover:bg-red-600 transition"
            disabled={!selectedAP}
          >
            Löschen
          </button>
        </div>
        {isCreating && (
          <div className="mt-6 p-4 border rounded-lg">
            <h3 className="font-bold mb-3">Neuen Accesspoint erstellen</h3>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Name"
                value={createForm.name || ''}
                onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
              <input
                type="text"
                placeholder="MAC"
                value={createForm.mac || ''}
                onChange={(e) => setCreateForm({ ...createForm, mac: e.target.value })}
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
              <input
                type="text"
                placeholder="IP Address"
                value={createForm.ipAddress || ''}
                onChange={(e) => setCreateForm({ ...createForm, ipAddress: e.target.value })}
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
              <textarea
                placeholder="Beschreibung"
                value={createForm.description || ''}
                onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })}
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>
            <div className="mt-4 flex justify-end">
              <button
                onClick={handleCreate}
                className="bg-green-600 text-white px-6 py-2 rounded-full shadow hover:bg-green-700 transition"
              >
                Erstellen
              </button>
            </div>
          </div>
        )}
      </div>
      {/* Rechte Spalte: Bearbeiten */}
      <div className="bg-gray-50 p-6 rounded-xl shadow-sm">
        {selectedAP ? (
          <>
            <h2 className="text-2xl font-bold mb-4 border-b pb-2">Accesspoint bearbeiten</h2>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Name"
                value={editForm.name || ''}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
              <input
                type="text"
                placeholder="MAC"
                value={editForm.mac || ''}
                onChange={(e) => setEditForm({ ...editForm, mac: e.target.value })}
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
              <input
                type="text"
                placeholder="IP Address"
                value={editForm.ipAddress || ''}
                onChange={(e) => setEditForm({ ...editForm, ipAddress: e.target.value })}
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
              <textarea
                placeholder="Beschreibung"
                value={editForm.description || ''}
                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={handleSaveChanges}
                className="bg-indigo-600 text-white px-6 py-2 rounded-full shadow hover:bg-indigo-700 transition"
              >
                Speichern
              </button>
            </div>
          </>
        ) : (
          <p className="text-gray-500 text-lg">Wähle einen Accesspoint zum Bearbeiten aus.</p>
        )}
      </div>
    </div>
  );
};

// ----- BuildingAdmin Component -----
const BuildingAdmin: React.FC = () => {
  const [buildings, setBuildings] = useState<BuildingDTO[]>([]);
  const [selectedBuilding, setSelectedBuilding] = useState<BuildingDTO | null>(null);
  const [editForm, setEditForm] = useState<BuildingUpdateDTO>({});
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [createForm, setCreateForm] = useState<BuildingCreateDTO>({});

  useEffect(() => {
    api<BuildingDTO[]>('/api/Buildings')
      .then((data) => {
        // Nur die Gebäude "Bruggerstrasse" und "Martinsberg"
        const filtered = data.filter(
          (b) =>
            b.name?.toLowerCase() === 'bruggerstrasse' ||
            b.name?.toLowerCase() === 'martinsberg'
        );
        setBuildings(filtered);
        if (filtered.length) setSelectedBuilding(filtered[0]);
      })
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    if (selectedBuilding) {
      setEditForm({ name: selectedBuilding.name, description: selectedBuilding.description });
    }
  }, [selectedBuilding]);

  const handleSelectBuilding = (b: BuildingDTO) => {
    setIsCreating(false);
    setSelectedBuilding(b);
  };

  const handleCreate = async () => {
    try {
      const created = await api<BuildingDTO>('/api/Buildings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(createForm),
      });
      if (
        created.name?.toLowerCase() === 'bruggerstrasse' ||
        created.name?.toLowerCase() === 'martinsberg'
      ) {
        setBuildings([...buildings, created]);
        setSelectedBuilding(created);
        setIsCreating(false);
        setCreateForm({});
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteBuilding = async () => {
    if (!selectedBuilding) return;
    try {
      await api<void>(`/api/Buildings/${selectedBuilding.id}`, { method: 'DELETE' });
      const filtered = buildings.filter((b) => b.id !== selectedBuilding.id);
      setBuildings(filtered);
      setSelectedBuilding(filtered[0] || null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveChanges = async () => {
    if (!selectedBuilding) return;
    try {
      await api<void>(`/api/Buildings/${selectedBuilding.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm),
      });
      const updatedList = buildings.map((b) =>
        b.id === selectedBuilding.id ? ({ ...selectedBuilding, ...editForm } as BuildingDTO) : b
      );
      setBuildings(updatedList);
      setSelectedBuilding({ ...selectedBuilding, ...editForm } as BuildingDTO);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Linke Spalte: Liste und Neuerfassung */}
      <div className="bg-gray-50 p-6 rounded-xl shadow-sm">
        <h2 className="text-2xl font-bold mb-4 border-b pb-2">Gebäude</h2>
        <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
          {buildings.length === 0 ? (
            <p className="text-gray-500">Keine Einträge vorhanden.</p>
          ) : (
            buildings.map((b) => (
              <div
                key={b.id}
                onClick={() => handleSelectBuilding(b)}
                className={`p-3 rounded-md cursor-pointer transition-colors ${
                  selectedBuilding && selectedBuilding.id === b.id ? 'bg-indigo-100' : 'hover:bg-gray-100'
                }`}
              >
                <p className="font-semibold">{b.name}</p>
                <p className="text-sm text-gray-600">{b.description}</p>
              </div>
            ))
          )}
        </div>
        <div className="mt-4 flex justify-around">
          <button
            onClick={() => setIsCreating(!isCreating)}
            className="bg-blue-500 text-white px-4 py-2 rounded-full shadow hover:bg-blue-600 transition"
          >
            {isCreating ? 'Abbrechen' : 'Neues Gebäude'}
          </button>
          <button
            onClick={handleDeleteBuilding}
            disabled={!selectedBuilding}
            className="bg-red-500 text-white px-4 py-2 rounded-full shadow hover:bg-red-600 transition"
          >
            Löschen
          </button>
        </div>
        {isCreating && (
          <div className="mt-6 p-4 border rounded-lg">
            <h3 className="font-bold mb-3">Neues Gebäude erstellen</h3>
            <input
              type="text"
              placeholder="Name (Bruggerstrasse oder Martinsberg)"
              value={createForm.name || ''}
              onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
              className="w-full p-2 border rounded-md mb-3 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
            <textarea
              placeholder="Beschreibung"
              value={createForm.description || ''}
              onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })}
              className="w-full p-2 border rounded-md mb-3 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
            <div className="flex justify-end">
              <button
                onClick={handleCreate}
                className="bg-green-600 text-white px-6 py-2 rounded-full shadow hover:bg-green-700 transition"
              >
                Erstellen
              </button>
            </div>
          </div>
        )}
      </div>
      {/* Rechte Spalte: Bearbeiten */}
      <div className="bg-gray-50 p-6 rounded-xl shadow-sm">
        {selectedBuilding ? (
          <>
            <h2 className="text-2xl font-bold mb-4 border-b pb-2">Gebäude bearbeiten</h2>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Name"
                value={editForm.name || ''}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
              <textarea
                placeholder="Beschreibung"
                value={editForm.description || ''}
                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={handleSaveChanges}
                className="bg-indigo-600 text-white px-6 py-2 rounded-full shadow hover:bg-indigo-700 transition"
              >
                Speichern
              </button>
            </div>
          </>
        ) : (
          <p className="text-gray-500 text-lg">Wähle ein Gebäude zum Bearbeiten aus.</p>
        )}
      </div>
    </div>
  );
};

// ----- FloorAdmin Component -----
const FloorAdmin: React.FC = () => {
  const buildingNameToId: Record<string, number> = { Bruggerstrasse: 1, Martinsberg: 2 };
  const buildingOptions = Object.keys(buildingNameToId);
  const [selectedBuildingName, setSelectedBuildingName] = useState<string>(buildingOptions[0]);
  const [selectedBuildingId, setSelectedBuildingId] = useState<number>(buildingNameToId[buildingOptions[0]]);
  const [floors, setFloors] = useState<FloorDTO[]>([]);
  const [selectedFloor, setSelectedFloor] = useState<FloorDTO | null>(null);
  const [editForm, setEditForm] = useState<FloorUpdateDTO>({ buildingId: selectedBuildingId });
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [createForm, setCreateForm] = useState<FloorCreateDTO>({ buildingId: selectedBuildingId });

  useEffect(() => {
    api<FloorDTO[]>(`/api/Buildings/${selectedBuildingId}/floors`)
      .then((data) => {
        setFloors(data);
        if (data.length) setSelectedFloor(data[0]);
      })
      .catch((err) => console.error(err));
  }, [selectedBuildingId]);

  useEffect(() => {
    if (selectedFloor) {
      setEditForm({
        buildingId: selectedFloor.buildingId,
        name: selectedFloor.name,
        description: selectedFloor.description,
      });
    }
  }, [selectedFloor]);

  const handleAddFloor = async () => {
    try {
      const created = await api<FloorDTO>('/api/Floors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(createForm),
      });
      setFloors([...floors, created]);
      setSelectedFloor(created);
      setIsCreating(false);
      setCreateForm({ buildingId: selectedBuildingId });
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteFloor = async () => {
    if (!selectedFloor) return;
    try {
      await api<void>(`/api/Floors/${selectedFloor.id}`, { method: 'DELETE' });
      const filtered = floors.filter((f) => f.id !== selectedFloor.id);
      setFloors(filtered);
      setSelectedFloor(filtered[0] || null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveChanges = async () => {
    if (!selectedFloor) return;
    try {
      await api<void>(`/api/Floors/${selectedFloor.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm),
      });
      const updatedList = floors.map((f) =>
        f.id === selectedFloor.id ? ({ ...selectedFloor, ...editForm } as FloorDTO) : f
      );
      setFloors(updatedList);
      setSelectedFloor({ ...selectedFloor, ...editForm } as FloorDTO);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Gebäude-Auswahl */}
      <div className="bg-gray-50 p-6 rounded-xl shadow-sm">
        <label className="block font-bold mb-2">Gebäude</label>
        <select
          value={selectedBuildingName}
          onChange={(e) => {
            const name = e.target.value;
            setSelectedBuildingName(name);
            setSelectedBuildingId(buildingNameToId[name]);
            setSelectedFloor(null);
            setCreateForm({ buildingId: buildingNameToId[name] });
          }}
          className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
        >
          {buildingOptions.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
      </div>
      {/* Floor-Liste */}
      <div className="bg-gray-50 p-6 rounded-xl shadow-sm lg:col-span-1">
        <h2 className="text-2xl font-bold mb-4 border-b pb-2">
          Stockwerke ({selectedBuildingName})
        </h2>
        <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
          {floors.length === 0 ? (
            <p className="text-gray-500">Keine Einträge vorhanden.</p>
          ) : (
            floors.map((f) => (
              <div
                key={f.id}
                onClick={() => setSelectedFloor(f)}
                className={`p-3 rounded-md cursor-pointer transition-colors ${
                  selectedFloor && selectedFloor.id === f.id ? 'bg-indigo-100' : 'hover:bg-gray-100'
                }`}
              >
                <p className="font-semibold">{f.name}</p>
              </div>
            ))
          )}
        </div>
        <div className="mt-4 flex justify-around">
          <button
            onClick={() => setIsCreating(!isCreating)}
            className="bg-blue-500 text-white px-4 py-2 rounded-full shadow hover:bg-blue-600 transition"
          >
            {isCreating ? 'Abbrechen' : 'Neues Stockwerk'}
          </button>
          <button
            onClick={handleDeleteFloor}
            disabled={!selectedFloor}
            className="bg-red-500 text-white px-4 py-2 rounded-full shadow hover:bg-red-600 transition"
          >
            Löschen
          </button>
        </div>
        {isCreating && (
          <div className="mt-6 p-4 border rounded-lg">
            <h3 className="font-bold mb-3">Neues Stockwerk erstellen</h3>
            <input
              type="text"
              placeholder="Name"
              value={createForm.name || ''}
              onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
              className="w-full p-2 border rounded-md mb-3 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
            <textarea
              placeholder="Beschreibung"
              value={createForm.description || ''}
              onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })}
              className="w-full p-2 border rounded-md mb-3 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
            <div className="flex justify-end">
              <button
                onClick={handleAddFloor}
                className="bg-green-600 text-white px-6 py-2 rounded-full shadow hover:bg-green-700 transition"
              >
                Erstellen
              </button>
            </div>
          </div>
        )}
      </div>
      {/* Detailansicht */}
      <div className="bg-gray-50 p-6 rounded-xl shadow-sm lg:col-span-1">
        {selectedFloor ? (
          <>
            <h2 className="text-2xl font-bold mb-4 border-b pb-2">Stockwerk bearbeiten</h2>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Name"
                value={editForm.name || ''}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
              <textarea
                placeholder="Beschreibung"
                value={editForm.description || ''}
                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={handleSaveChanges}
                className="bg-indigo-600 text-white px-6 py-2 rounded-full shadow hover:bg-indigo-700 transition"
              >
                Speichern
              </button>
            </div>
          </>
        ) : (
          <p className="text-gray-500 text-lg">Wähle ein Stockwerk zum Bearbeiten aus.</p>
        )}
      </div>
    </div>
  );
};

// ----- RoomAdmin Component -----
const RoomAdmin: React.FC = () => {
  const [rooms, setRooms] = useState<RoomDTO[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<RoomDTO | null>(null);
  const [editForm, setEditForm] = useState<RoomUpdateDTO>({ floorId: 0, capacity: 0, isActive: true });
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [createForm, setCreateForm] = useState<RoomCreateDTO>({ floorId: 1, capacity: 0, isActive: true });

  useEffect(() => {
    api<RoomDTO[]>('/api/Rooms')
      .then((data) => {
        setRooms(data);
        if (data.length) setSelectedRoom(data[0]);
      })
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    if (selectedRoom) {
      setEditForm({
        name: selectedRoom.name,
        floorId: selectedRoom.floorId,
        capacity: selectedRoom.capacity,
        type: selectedRoom.type,
        isActive: selectedRoom.isActive,
      });
    }
  }, [selectedRoom]);

  const handleAddRoom = async () => {
    try {
      const created = await api<RoomDTO>('/api/Rooms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(createForm),
      });
      setRooms([...rooms, created]);
      setSelectedRoom(created);
      setIsCreating(false);
      setCreateForm({ floorId: 1, capacity: 0, isActive: true });
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteRoom = async () => {
    if (!selectedRoom) return;
    try {
      await api<void>(`/api/Rooms/${selectedRoom.id}`, { method: 'DELETE' });
      const filtered = rooms.filter((r) => r.id !== selectedRoom.id);
      setRooms(filtered);
      setSelectedRoom(filtered[0] || null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveChanges = async () => {
    if (!selectedRoom) return;
    try {
      await api<void>(`/api/Rooms/${selectedRoom.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm),
      });
      const updatedList = rooms.map((r) =>
        r.id === selectedRoom.id ? ({ ...selectedRoom, ...editForm } as RoomDTO) : r
      );
      setRooms(updatedList);
      setSelectedRoom({ ...selectedRoom, ...editForm } as RoomDTO);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Linke Spalte: Liste und Neuerfassung */}
      <div className="bg-gray-50 p-6 rounded-xl shadow-sm">
        <h2 className="text-2xl font-bold mb-4 border-b pb-2">Räume</h2>
        <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
          {rooms.length === 0 ? (
            <p className="text-gray-500">Keine Einträge vorhanden.</p>
          ) : (
            rooms.map((r) => (
              <div
                key={r.id}
                onClick={() => {
                  setIsCreating(false);
                  setSelectedRoom(r);
                }}
                className={`p-3 rounded-md cursor-pointer transition-colors ${
                  selectedRoom && selectedRoom.id === r.id ? 'bg-indigo-100' : 'hover:bg-gray-100'
                }`}
              >
                <p className="font-semibold">{r.name}</p>
                <p className="text-sm text-gray-600">Kapazität: {r.capacity}</p>
              </div>
            ))
          )}
        </div>
        <div className="mt-4 flex justify-around">
          <button
            onClick={() => setIsCreating(!isCreating)}
            className="bg-blue-500 text-white px-4 py-2 rounded-full shadow hover:bg-blue-600 transition"
          >
            {isCreating ? 'Abbrechen' : 'Neuen Raum'}
          </button>
          <button
            onClick={handleDeleteRoom}
            disabled={!selectedRoom}
            className="bg-red-500 text-white px-4 py-2 rounded-full shadow hover:bg-red-600 transition"
          >
            Löschen
          </button>
        </div>
        {isCreating && (
          <div className="mt-6 p-4 border rounded-lg">
            <h3 className="font-bold mb-3">Neuen Raum erstellen</h3>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Name"
                value={createForm.name || ''}
                onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
              <input
                type="number"
                placeholder="Kapazität"
                value={createForm.capacity.toString()}
                onChange={(e) =>
                  setCreateForm({ ...createForm, capacity: parseInt(e.target.value, 10) })
                }
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
              <input
                type="text"
                placeholder="Typ"
                value={createForm.type || ''}
                onChange={(e) => setCreateForm({ ...createForm, type: e.target.value })}
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={createForm.isActive}
                  onChange={(e) =>
                    setCreateForm({ ...createForm, isActive: e.target.checked })
                  }
                  className="mr-2"
                />
                <span className="font-semibold">Aktiv</span>
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <button
                onClick={handleAddRoom}
                className="bg-green-600 text-white px-6 py-2 rounded-full shadow hover:bg-green-700 transition"
              >
                Erstellen
              </button>
            </div>
          </div>
        )}
      </div>
      {/* Rechte Spalte: Bearbeiten */}
      <div className="bg-gray-50 p-6 rounded-xl shadow-sm">
        {selectedRoom ? (
          <>
            <h2 className="text-2xl font-bold mb-4 border-b pb-2">Raum bearbeiten</h2>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Name"
                value={editForm.name || ''}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
              <input
                type="number"
                placeholder="Kapazität"
                value={editForm.capacity.toString()}
                onChange={(e) => setEditForm({ ...editForm, capacity: parseInt(e.target.value, 10) })}
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
              <input
                type="text"
                placeholder="Typ"
                value={editForm.type || ''}
                onChange={(e) => setEditForm({ ...editForm, type: e.target.value })}
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={editForm.isActive}
                  onChange={(e) => setEditForm({ ...editForm, isActive: e.target.checked })}
                  className="mr-2"
                />
                <span className="font-semibold">Aktiv</span>
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={handleSaveChanges}
                className="bg-indigo-600 text-white px-6 py-2 rounded-full shadow hover:bg-indigo-700 transition"
              >
                Speichern
              </button>
            </div>
          </>
        ) : (
          <p className="text-gray-500 text-lg">Wähle einen Raum zum Bearbeiten aus.</p>
        )}
      </div>
    </div>
  );
};

// ----- RoomAccessPointAdmin Component -----
const RoomAccessPointAdmin: React.FC = () => {
  const [links, setLinks] = useState<RoomAccesspointDTO[]>([]);
  const [selectedRoomId, setSelectedRoomId] = useState<number | null>(null);
  const [selectedAPId, setSelectedAPId] = useState<number | null>(null);

  useEffect(() => {
    api<RoomAccesspointDTO[]>('/api/RoomAccessPoints')
      .then((data) => setLinks(data))
      .catch((err) => console.error(err));
  }, []);

  const handleAddLink = async () => {
    if (selectedRoomId === null || selectedAPId === null) return;
    const newLink: RoomAccesspointCreateDTO = { roomId: selectedRoomId, accesspointId: selectedAPId };
    try {
      const created = await api<RoomAccesspointDTO>('/api/RoomAccessPoints', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newLink),
      });
      setLinks([...links, created]);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteLink = async (roomId: number, accesspointId: number) => {
    try {
      await api<void>(`/api/RoomAccessPoints/${roomId}/${accesspointId}`, { method: 'DELETE' });
      setLinks(links.filter((link) => !(link.roomId === roomId && link.accesspointId === accesspointId)));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Eingabe */}
      <div className="bg-gray-50 p-6 rounded-xl shadow-sm">
        <h2 className="text-2xl font-bold mb-4 border-b pb-2">Neue Verknüpfung</h2>
        <div className="space-y-4">
          <input
            type="number"
            placeholder="Raum-ID"
            value={selectedRoomId || ''}
            onChange={(e) => setSelectedRoomId(parseInt(e.target.value, 10))}
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <input
            type="number"
            placeholder="AccessPoint-ID"
            value={selectedAPId || ''}
            onChange={(e) => setSelectedAPId(parseInt(e.target.value, 10))}
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </div>
        <div className="mt-6 flex justify-center">
          <button
            onClick={handleAddLink}
            className="bg-green-600 text-white px-6 py-2 rounded-full shadow hover:bg-green-700 transition"
            disabled={selectedRoomId === null || selectedAPId === null}
          >
            Verknüpfen
          </button>
        </div>
      </div>
      {/* Liste */}
      <div className="bg-gray-50 p-6 rounded-xl shadow-sm">
        <h2 className="text-2xl font-bold mb-4 border-b pb-2">Bestehende Verknüpfungen</h2>
        {links.length === 0 ? (
          <p className="text-gray-500">Keine Verknüpfungen vorhanden.</p>
        ) : (
          <ul className="space-y-3 max-h-80 overflow-y-auto pr-2">
            {links.map((link, index) => (
              <li key={index} className="flex justify-between items-center p-3 bg-white rounded-md shadow-sm">
                <span className="font-medium">Room: {link.roomId} | AP: {link.accesspointId}</span>
                <button
                  onClick={() => handleDeleteLink(link.roomId, link.accesspointId)}
                  className="bg-red-500 text-white px-4 py-1 rounded-full shadow hover:bg-red-600 transition"
                >
                  Löschen
                </button>
              </li>
            ))}
          </ul>
        )}
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
// OccupancyOverlay Component (mit API-Call)
// ---------------------
const OccupancyOverlay: React.FC<{ floor: string }> = ({ floor }) => {
  const [occupancyData, setOccupancyData] = useState<{ RoomId: number; Occupancy: number }[]>([]);

  useEffect(() => {
    // Passe hier den API-Endpunkt an
    fetch(`http://your-backend-url/api/occupancy?floor=${encodeURIComponent(floor)}`)
      .then(response => response.json())
      .then(data => setOccupancyData(data))
      .catch(error => console.error("Error fetching occupancy data:", error));
  }, [floor]);

  // Wähle das passende Mapping für die aktuelle Etage
  const positions = roomPositions[floor];

  return (
    <>
      {occupancyData.map((data) => {
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
  if (occupancy < 33) return "rgba(0,255,0,0.4)";    // Grün
  if (occupancy < 66) return "rgba(255,255,0,0.4)";    // Gelb
  return "rgba(255,0,0,0.4)";                           // Rot
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
        <Route path="/login" element={<LoginPage />} />
        {/* Protected Routes */}
        <Route element={<PrivateRoute />}>
          <Route path="/admin" element={<AdminDashboard />} />
        </Route>
        <Route path="/display" element={<FullscreenFloorplan />} />
        <Route path="/" element={<UserView />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
};

export default App;
