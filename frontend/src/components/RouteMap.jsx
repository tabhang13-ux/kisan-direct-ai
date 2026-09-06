import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';

// Custom Map Markers SVG Icons
const createCustomIcon = (color, emoji) => {
  return L.divIcon({
    className: 'custom-leaflet-icon',
    html: `
      <div style="
        background-color: ${color};
        width: 32px;
        height: 32px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 16px;
        box-shadow: 0 4px 10px rgba(0,0,0,0.3);
        border: 2px solid white;
      ">
        ${emoji}
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
  });
};

const farmerIcon = createCustomIcon('#16a34a', '🌾');
const fpoIcon = createCustomIcon('#0284c7', '🏢');
const buyerIcon = createCustomIcon('#d97706', '🛒');
const vehicleIcon = createCustomIcon('#7c3aed', '🚚');

const RouteMap = ({ waypoints = [], center = [18.8, 73.9], zoom = 10, height = "400px" }) => {
  // Default demo locations around Pune if no waypoints passed
  const defaultLocations = [
    { name: 'Ramesh Kulkarni Farm (Manchar)', lat: 19.0039, lng: 73.9431, type: 'FARMER', crop: 'Tomato (2,000 kg)' },
    { name: 'Pune Sahakari FPO Hub (Khed)', lat: 18.8475, lng: 73.9105, type: 'FPO', crop: 'Aggregation Center' },
    { name: 'Junnar Valley Agro Hub', lat: 19.2064, lng: 73.8762, type: 'FPO', crop: 'Collection Hub' },
    { name: 'FreshBasket Hadapsar Depot', lat: 18.5089, lng: 73.9260, type: 'BUYER', crop: 'Buyer Supermarket' },
    { name: 'MH-12-QX-4012 Express Fleet', lat: 18.7606, lng: 73.8596, type: 'VEHICLE', crop: 'In Transit' }
  ];

  const locationsToDisplay = waypoints.length > 0 ? waypoints : defaultLocations;

  const polylinePositions = locationsToDisplay.map(loc => [
    loc.lat || loc.latitude || 18.5,
    loc.lng || loc.longitude || 73.8
  ]);

  return (
    <div style={{ height, width: '100%' }} className="relative rounded-2xl overflow-hidden shadow-inner border border-slate-200">
      <MapContainer center={center} zoom={zoom} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {locationsToDisplay.map((loc, idx) => {
          const lat = loc.lat || loc.latitude || 18.5;
          const lng = loc.lng || loc.longitude || 73.8;
          const type = loc.type || (idx === locationsToDisplay.length - 1 ? 'BUYER' : idx === 0 ? 'FARMER' : 'FPO');

          let icon = farmerIcon;
          if (type === 'FPO') icon = fpoIcon;
          if (type === 'BUYER') icon = buyerIcon;
          if (type === 'VEHICLE') icon = vehicleIcon;

          return (
            <Marker key={idx} position={[lat, lng]} icon={icon}>
              <Popup>
                <div className="p-1 font-sans">
                  <div className="flex items-center gap-1 mb-1">
                    <span className="text-xs font-bold text-slate-900">{loc.name || `Waypoint #${idx + 1}`}</span>
                  </div>
                  <p className="text-[11px] text-slate-600 font-medium">{loc.crop || loc.location || 'Agri Hub Node'}</p>
                  <p className="text-[10px] text-slate-400 mt-1 font-mono">{lat.toFixed(4)}, {lng.toFixed(4)}</p>
                </div>
              </Popup>
            </Marker>
          );
        })}

        {/* Route Polyline connecting waypoints */}
        {polylinePositions.length > 1 && (
          <Polyline
            positions={polylinePositions}
            pathOptions={{ color: '#16a34a', weight: 4, opacity: 0.8, dashArray: '8, 8' }}
          />
        )}
      </MapContainer>

      {/* Map Legend Overlay */}
      <div className="absolute bottom-3 left-3 z-[400] bg-white/90 backdrop-blur-md px-3 py-2 rounded-xl shadow-lg border border-slate-200 text-[11px] font-semibold flex items-center gap-3">
        <span className="flex items-center gap-1 text-emerald-700">🌾 Farmer</span>
        <span className="flex items-center gap-1 text-sky-700">🏢 FPO Hub</span>
        <span className="flex items-center gap-1 text-amber-700">🛒 Buyer</span>
        <span className="flex items-center gap-1 text-purple-700">🚚 Vehicle</span>
      </div>
    </div>
  );
};

export default RouteMap;
