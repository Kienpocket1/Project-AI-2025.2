import { useEffect } from 'react';
import { MapContainer, TileLayer, Polyline, Marker, Popup, Tooltip, useMap, CircleMarker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

const startIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
  iconRetinaUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41]
});

const endIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
  iconRetinaUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41]
});

const intermediateIcon = L.divIcon({
  className: 'custom-intermediate-icon',
  html: `<div style="width: 10px; height: 10px; background-color: #2563EB; border: 2px solid white; border-radius: 50%; box-shadow: 0 0 4px rgba(0,0,0,0.3);"></div>`,
  iconSize: [10, 10],
  iconAnchor: [5, 5]
});

const transferIcon = L.divIcon({
  className: 'custom-transfer-icon',
  html: `<div style="width: 14px; height: 14px; background-color: #F97316; border: 2px solid white; transform: rotate(45deg); box-shadow: 0 0 4px rgba(0,0,0,0.3);"></div>`,
  iconSize: [14, 14],
  iconAnchor: [7, 7]
});

const ChangeView = ({ positions }) => {
  const map = useMap();
  useEffect(() => {
    if (positions && positions.length > 0) {
      map.fitBounds(L.latLngBounds(positions), { padding: [40, 40] });
    }
  }, [map, positions]);
  return null;
};

const MapView = ({ allStations = [], pathData = [], totalTime }) => {
  const center = [40.4168, -3.7038];
  const pathIds = new Set(pathData.map(s => String(s.id)));
  const positions = pathData.length > 0 ? pathData.map(p => [p.lat, p.lon]) : [];
  const totalMinutes = totalTime ? Math.round(totalTime / 60) : 0;

  const getIcon = (station, index) => {
    if (index === 0) return startIcon;
    if (index === pathData.length - 1) return endIcon;
    if (pathData[index + 1] && station.name === pathData[index + 1].name) return transferIcon;
    return intermediateIcon;
  };

  return (
    <div className="h-full w-full relative">
      <MapContainer center={center} zoom={13} className="h-full w-full z-0">
        {positions.length > 0 && <ChangeView positions={positions} />}
        
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap"
        />

        {allStations.map((station) => {
          if (pathIds.has(String(station.id))) return null;

          if (!station.lat || !station.lon) return null;
          return (
            <CircleMarker 
              key={station.id} 
              center={[station.lat, station.lon]}
              radius={3.5}
              pathOptions={{ fillColor: '#94a3b8', color: '#f8fafc', weight: 1.5, fillOpacity: 0.8 }}
            >
              <Tooltip direction="top" offset={[0, -5]} opacity={0.9} className="font-semibold text-[11px]">
                {station.name}
              </Tooltip>
            </CircleMarker>
          );
        })}

        {positions.length > 0 && (
          <>
            <Polyline positions={positions} pathOptions={{ color: '#e30613', weight: 6, lineCap: 'round', lineJoin: 'round' }}>
              <Tooltip permanent direction="center" opacity={0.9} className="font-bold text-sm bg-white px-2 py-1 rounded shadow">
                <span>{totalMinutes} phút</span>
              </Tooltip>
            </Polyline>
            
            {pathData.map((station, index) => {
              const icon = getIcon(station, index);
              const isStartOrEnd = index === 0 || index === pathData.length - 1;
              
              return (
                <Marker key={index} position={[station.lat, station.lon]} icon={icon}>
                  <Popup>
                    <div className="text-sm">
                      <p className="font-bold">{station.name}</p>
                      {icon === transferIcon && <p className="text-[#F97316] font-medium mt-1">Đổi tuyến (Đi bộ)</p>}
                    </div>
                  </Popup>
                  {isStartOrEnd && (
                    <Tooltip permanent direction={index === 0 ? "top" : "bottom"} offset={[0, index === 0 ? -25 : 0]} className="font-bold">
                      {station.name}
                    </Tooltip>
                  )}
                </Marker>
              );
            })}
          </>
        )}
      </MapContainer>

      <div className="absolute bottom-6 right-6 z-[1000] bg-white/95 backdrop-blur p-4 rounded-xl shadow-lg border border-slate-200 pointer-events-none">
        <h4 className="font-bold text-sm mb-3 text-slate-800 border-b pb-2 uppercase tracking-wider">Chú thích</h4>
        <div className="space-y-3 text-xs text-slate-700 font-semibold">
          <div className="flex items-center gap-3">
            <img src="https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png" alt="start" className="w-4 h-6 object-contain" />
            <span>Ga xuất phát</span>
          </div>
          <div className="flex items-center gap-3">
            <img src="https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png" alt="end" className="w-4 h-6 object-contain" />
            <span>Ga kết thúc</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-3.5 h-3.5 bg-blue-600 rounded-full border-2 border-white shadow-sm ml-[2px]"></div>
            <span className="ml-[2px]">Ga trung gian</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-3.5 h-3.5 bg-orange-500 border-2 border-white rotate-45 shadow-sm ml-[2px]"></div>
            <span className="ml-[2px]">Đổi tuyến (Đi bộ)</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-5 h-1.5 bg-[#e30613] rounded-full ml-[-2px]"></div>
            <span>Lộ trình di chuyển</span>
          </div>
          <div className="flex items-center gap-3 pt-1 border-t border-slate-100">
            <div className="w-2.5 h-2.5 bg-slate-400 rounded-full border border-white shadow-sm ml-[4px]"></div>
            <span className="ml-[3px] text-slate-500">Các ga hệ thống</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapView;