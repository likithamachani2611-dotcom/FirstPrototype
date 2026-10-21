import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { MapPin, Navigation, Compass } from 'lucide-react';

interface LocationPickerProps {
  initialLat?: number;
  initialLng?: number;
  initialLocationName?: string;
  onLocationSelect: (lat: number, lng: number, addressName?: string) => void;
}

const PRESET_LOCATIONS = [
  { name: 'Stanford Campus (Main Quad)', lat: 37.4275, lng: -122.1697 },
  { name: 'Central Transit Hub & Metro', lat: 37.7749, lng: -122.4194 },
  { name: 'Westfield Galleria Mall', lat: 37.4030, lng: -122.1150 },
  { name: 'Green Library 2nd Floor', lat: 37.4277, lng: -122.1695 },
  { name: 'Campus Recreation Center', lat: 37.4260, lng: -122.1650 }
];

export const LocationPicker: React.FC<LocationPickerProps> = ({
  initialLat = 37.4275,
  initialLng = -122.1697,
  onLocationSelect
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  const [coords, setCoords] = useState<{ lat: number; lng: number }>({
    lat: initialLat,
    lng: initialLng
  });

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      // Fix default Leaflet marker icon
      const customIcon = L.icon({
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
      });

      const map = L.map(mapContainerRef.current).setView([coords.lat, coords.lng], 14);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(map);

      const marker = L.marker([coords.lat, coords.lng], { icon: customIcon, draggable: true }).addTo(map);

      marker.on('dragend', () => {
        const position = marker.getLatLng();
        setCoords({ lat: position.lat, lng: position.lng });
        onLocationSelect(position.lat, position.lng);
      });

      map.on('click', (e) => {
        marker.setLatLng(e.latlng);
        setCoords({ lat: e.latlng.lat, lng: e.latlng.lng });
        onLocationSelect(e.latlng.lat, e.latlng.lng);
      });

      mapInstanceRef.current = map;
      markerRef.current = marker;
    }

    return () => {
      // Clean up map on unmount
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  const handlePresetSelect = (preset: typeof PRESET_LOCATIONS[0]) => {
    setCoords({ lat: preset.lat, lng: preset.lng });
    if (mapInstanceRef.current && markerRef.current) {
      mapInstanceRef.current.setView([preset.lat, preset.lng], 15);
      markerRef.current.setLatLng([preset.lat, preset.lng]);
    }
    onLocationSelect(preset.lat, preset.lng, preset.name);
  };

  const handleGetCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setCoords({ lat: latitude, lng: longitude });
          if (mapInstanceRef.current && markerRef.current) {
            mapInstanceRef.current.setView([latitude, longitude], 15);
            markerRef.current.setLatLng([latitude, longitude]);
          }
          onLocationSelect(latitude, longitude, 'My Current Location');
        },
        (err) => {
          console.warn('Geolocation denied or unavailable:', err);
        }
      );
    }
  };

  return (
    <div className="space-y-3">
      {/* Preset Quick Buttons */}
      <div className="flex flex-wrap items-center gap-1.5">
        <span className="text-xs font-semibold text-slate-500 flex items-center gap-1 mr-1">
          <Compass className="w-3.5 h-3.5" />
          Quick Places:
        </span>
        {PRESET_LOCATIONS.map(p => (
          <button
            key={p.name}
            type="button"
            onClick={() => handlePresetSelect(p)}
            className="px-2.5 py-1 text-xs rounded-lg font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
          >
            {p.name.split(' (')[0]}
          </button>
        ))}
        <button
          type="button"
          onClick={handleGetCurrentLocation}
          className="px-2.5 py-1 text-xs rounded-lg font-semibold bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 transition-colors flex items-center gap-1 ml-auto"
        >
          <Navigation className="w-3 h-3" />
          Use My GPS
        </button>
      </div>

      {/* Map container */}
      <div className="relative w-full h-64 rounded-2xl overflow-hidden border border-slate-200 shadow-inner">
        <div ref={mapContainerRef} className="w-full h-full" />
      </div>

      {/* Selected Coordinates Readout */}
      <div className="flex items-center justify-between text-xs text-slate-500 px-1">
        <span className="flex items-center gap-1 font-mono text-[11px]">
          <MapPin className="w-3.5 h-3.5 text-teal-600" />
          Pin: {coords.lat.toFixed(4)}, {coords.lng.toFixed(4)}
        </span>
        <span className="italic">Click map or drag pin to adjust exact spot</span>
      </div>
    </div>
  );
};
