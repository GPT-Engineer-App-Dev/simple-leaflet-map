import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import 'leaflet-draw';
import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch';
import 'leaflet-geosearch/dist/geosearch.css';
import { Button } from "@/components/ui/button";

const Index = () => {
  const mapRef = useRef(null);
  const drawnItemsRef = useRef(null);
  const [clickedAddress, setClickedAddress] = useState(null);

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

      // Add GeoSearch control
      const provider = new OpenStreetMapProvider();
      const searchControl = new GeoSearchControl({
        provider: provider,
        style: 'bar',
        showMarker: true,
        showPopup: false,
        autoClose: true,
        retainZoomLevel: false,
        animateZoom: true,
        keepResult: false,
        searchLabel: 'Search for address'
      });
      map.addControl(searchControl);

      // Add click event for reverse geocoding
      map.on('click', async (e) => {
        const { lat, lng } = e.latlng;
        try {
          const results = await provider.search({ query: `${lat}, ${lng}` });
          if (results.length > 0) {
            setClickedAddress(results[0].label);
          }
        } catch (error) {
          console.error('Error in reverse geocoding:', error);
        }
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
    setClickedAddress(null);
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="flex justify-between items-center py-4 px-6 bg-gray-100">
        <h1 className="text-3xl font-bold">Interactive Map</h1>
        <Button onClick={handleClearDrawings}>Clear Drawings</Button>
      </div>
      <div id="map" className="flex-grow w-full" />
      {clickedAddress && (
        <div className="absolute bottom-4 left-4 bg-white p-2 rounded shadow">
          <p><strong>Clicked Address:</strong> {clickedAddress}</p>
        </div>
      )}
    </div>
  );
};

export default Index;