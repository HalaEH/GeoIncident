import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface MapProps {
  incidents: any[];
  selectedIncident: any;
  zoom: number;
  handleIncidentClick: (incident: any) => void;
}

const Map = ({ incidents, selectedIncident, zoom, handleIncidentClick }: MapProps) => {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (mapRef.current && !mapInstanceRef.current) {
      // Initialize the map
      mapInstanceRef.current = L.map(mapRef.current, {
        center: [20, 0], // More centered view of the world
        zoom: 2,
        zoomControl: false, // Disable default zoom control
        maxBounds: [[-90, -180], [90, 180]], // Restrict panning to world bounds
        minZoom: 2, // Prevent zooming out too far
        maxZoom: 16 // Prevent zooming in too far
      });

      // Add a tile layer with light style
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        noWrap: true // Prevent the map from repeating horizontally
      }).addTo(mapInstanceRef.current);

      // Add custom zoom control
      L.control.zoom({
        position: 'topright'
      }).addTo(mapInstanceRef.current);
    }

    // Update markers whenever incidents change
    if (mapInstanceRef.current) {
      // Clear existing markers
      mapInstanceRef.current.eachLayer((layer) => {
        if (layer instanceof L.Marker) {
          mapInstanceRef.current?.removeLayer(layer);
        }
      });

      incidents.forEach(incident => {
        const customIcon = L.divIcon({
          className: 'custom-marker',
          html: `
            <div style="
              position: relative;
              width: 16px;
              height: 16px;
            ">
              <div style="
                position: absolute;
                top: 0;
                left: 0;
                width: 16px;
                height: 16px;
                border-radius: 50%;
                background-color: ${selectedIncident?.id === incident.id ? '#0d6efd' : '#dc3545'};
                opacity: 0.75;
                animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
              "></div>
              <div style="
                position: absolute;
                top: 0;
                left: 0;
                width: 16px;
                height: 16px;
                border-radius: 50%;
                background-color: ${selectedIncident?.id === incident.id ? '#0d6efd' : '#dc3545'};
              "></div>
            </div>
            <style>
              @keyframes ping {
                75%, 100% {
                  transform: scale(2);
                  opacity: 0;
                }
              }
            </style>
          `,
          iconSize: [16, 16],
          iconAnchor: [8, 8]
        });

        const marker = L.marker([incident.latitude, incident.longitude], { icon: customIcon })
          .addTo(mapInstanceRef.current!)
          .on('click', () => handleIncidentClick(incident));

        if (selectedIncident?.id === incident.id) {
          marker.bindPopup(incident.title).openPopup();
        }
      });
    }

    // Cleanup function
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [incidents, selectedIncident, handleIncidentClick]);

  // Update zoom when prop changes
  useEffect(() => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setZoom(zoom);
    }
  }, [zoom]);

  return (
    <div 
      ref={mapRef} 
      style={{ 
        height: '100%', 
        width: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: '#f8fafc'
      }} 
    />
  );
};

export default Map;