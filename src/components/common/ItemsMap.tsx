import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { Item } from '../../types';

interface ItemsMapProps {
  items: Item[];
  center?: [number, number];
  zoom?: number;
}

export const ItemsMap: React.FC<ItemsMapProps> = ({
  items,
  center = [37.4275, -122.1697],
  zoom = 13
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current).setView(center, zoom);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(map);

      const markersGroup = L.layerGroup().addTo(map);
      markersLayerRef.current = markersGroup;
      mapInstanceRef.current = map;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update markers when items change
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current) return;

    markersLayerRef.current.clearLayers();

    const bounds: L.LatLngTuple[] = [];

    items.forEach(item => {
      if (item.latitude && item.longitude) {
        const isLost = item.type === 'lost';
        const color = isLost ? '#E11D48' : '#0D9488'; // Rose for lost, Teal for found

        // Create custom SVG marker icon
        const iconHtml = `
          <div style="
            background-color: ${color};
            width: 28px;
            height: 28px;
            border-radius: 50%;
            border: 3px solid white;
            box-shadow: 0 4px 6px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 11px;
            font-weight: bold;
          ">
            ${isLost ? 'L' : 'F'}
          </div>
        `;

        const customIcon = L.divIcon({
          html: iconHtml,
          className: 'custom-leaflet-marker',
          iconSize: [28, 28],
          iconAnchor: [14, 14]
        });

        const marker = L.marker([item.latitude, item.longitude], { icon: customIcon });

        const popupContent = `
          <div style="font-family: inherit; max-width: 220px; padding: 2px;">
            <div style="font-size: 10px; font-weight: bold; text-transform: uppercase; color: ${color}; margin-bottom: 2px;">
              ${isLost ? 'Lost Item' : 'Found Item'} • ${item.category}
            </div>
            <div style="font-size: 13px; font-weight: 700; color: #0f172a; margin-bottom: 4px;">
              ${item.title}
            </div>
            <div style="font-size: 11px; color: #64748b; margin-bottom: 6px;">
              ${item.locationName}
            </div>
            <a href="/item/${item.id}" style="
              display: inline-block;
              font-size: 11px;
              font-weight: 600;
              color: white;
              background-color: #0d9488;
              padding: 4px 8px;
              border-radius: 6px;
              text-decoration: none;
            ">
              View Details &rarr;
            </a>
          </div>
        `;

        marker.bindPopup(popupContent);
        marker.addTo(markersLayerRef.current!);
        bounds.push([item.latitude, item.longitude]);
      }
    });

    if (bounds.length > 0 && mapInstanceRef.current) {
      mapInstanceRef.current.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
    }
  }, [items]);

  return (
    <div className="relative w-full h-[520px] rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
      <div ref={mapContainerRef} className="w-full h-full" />
      
      {/* Map Legend */}
      <div className="absolute bottom-4 left-4 z-[400] bg-white/95 backdrop-blur-md px-3 py-2 rounded-xl border border-slate-200 shadow-md text-xs flex items-center gap-4">
        <div className="flex items-center gap-1.5 font-semibold text-slate-700">
          <span className="w-3 h-3 rounded-full bg-rose-600 inline-block"></span>
          <span>Lost Items</span>
        </div>
        <div className="flex items-center gap-1.5 font-semibold text-slate-700">
          <span className="w-3 h-3 rounded-full bg-teal-600 inline-block"></span>
          <span>Found Items</span>
        </div>
      </div>
    </div>
  );
};
