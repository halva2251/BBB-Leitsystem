import React, { useEffect, useState } from 'react';

type OccupancyItem = {
  room: string;
  count: number;
  top: string;
  left: string;
};

export default function FloorPlanMap() {
  const [occupancyData, setOccupancyData] = useState<OccupancyItem[]>([]);

  useEffect(() => {
    // Hier kannst du über deinen Backend-Endpunkt die Live-Daten abrufen.
    // Vorläufiges Beispiel mit statischen Daten:
    setOccupancyData([
      { room: 'Raum A', count: 10, top: '20%', left: '30%' },
      { room: 'Raum B', count: 5, top: '50%', left: '60%' }
    ]);
  }, []);

  return (
    <div className="relative">
      {/* Ersetze den src-Pfad mit dem tatsächlichen Grundrissbild */}
      <img src="/floorplan.jpg" alt="Grundriss" className="w-full" />
      {occupancyData.map((item, index) => (
        <div 
          key={index}
          className="absolute bg-red-500 text-white rounded-full flex items-center justify-center w-8 h-8 text-sm"
          style={{ top: item.top, left: item.left }}
          title={`${item.room}: ${item.count} Nutzer`}
        >
          {item.count}
        </div>
      ))}
    </div>
  );
}
