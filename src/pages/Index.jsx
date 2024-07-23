import { useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const Index = () => {
  useEffect(() => {
    const map = L.map('map').setView([51.505, -0.09], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    return () => {
      map.remove();
    };
  }, []);

  return (
    <div className="flex flex-col h-screen">
      <h1 className="text-3xl font-bold text-center py-4">Welcome to Our Map</h1>
      <div id="map" className="flex-grow w-full" />
    </div>
  );
};

export default Index;