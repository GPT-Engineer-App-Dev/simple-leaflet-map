import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import 'leaflet-draw';
import { Button } from "@/components/ui/button";

const Index = () => {
  const mapRef = useRef(null);
  const drawnItemsRef = useRef(null);

  useEffect(() => {
    if (!mapRef.current) {
      const map = L.map('map').setView([51.505, -0.09], 13);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);

      drawnItemsRef.current = new L.FeatureGroup();
      map.addLayer(drawnItemsRef.current);

      const drawControl = new L.Control.Draw({
        edit: {
          featureGroup: drawnItemsRef.current
        },
        draw: {
          polygon: true,
          polyline: true,
          rectangle: true,
          circle: true,
          marker: true
        }
      });
      map.addControl(drawControl);

      map.on(L.Draw.Event.CREATED, (event) => {
        const layer = event.layer;
        drawnItemsRef.current.addLayer(layer);
      });

      mapRef.current = map;
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  const handleClearDrawings = () => {
    if (drawnItemsRef.current) {
      drawnItemsRef.current.clearLayers();
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="flex justify-between items-center py-4 px-6 bg-gray-100">
        <h1 className="text-3xl font-bold">Interactive Map</h1>
        <Button onClick={handleClearDrawings}>Clear Drawings</Button>
      </div>
      <div id="map" className="flex-grow w-full" />
    </div>
  );
};

export default Index;