import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import 'leaflet-draw';
import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch';
import 'leaflet-geosearch/dist/geosearch.css';
import MarkerClusterGroup from 'react-leaflet-markercluster';
import 'react-leaflet-markercluster/dist/styles.min.css';
import { Button } from "@/components/ui/button";
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';

const Index = () => {
  const [clickedAddress, setClickedAddress] = useState(null);
  const [markers, setMarkers] = useState([]);
  const drawnItemsRef = useRef(null);

  useEffect(() => {
    drawnItemsRef.current = new L.FeatureGroup();
  }, []);

  const MapControls = () => {
    const map = useMap();

    useEffect(() => {
      if (!map) return;

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
        map.addLayer(drawnItemsRef.current);
      });

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

      map.on('click', async (e) => {
        const { lat, lng } = e.latlng;
        try {
          const results = await provider.search({ query: `${lat}, ${lng}` });
          if (results.length > 0) {
            setClickedAddress(results[0].label);
            setMarkers(prevMarkers => [...prevMarkers, { position: [lat, lng], popup: results[0].label }]);
          }
        } catch (error) {
          console.error('Error in reverse geocoding:', error);
        }
      });

      return () => {
        map.removeControl(drawControl);
        map.removeControl(searchControl);
      };
    }, [map]);

    return null;
  };

  const handleClearDrawings = () => {
    if (drawnItemsRef.current) {
      drawnItemsRef.current.clearLayers();
    }
    setClickedAddress(null);
    setMarkers([]);
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="flex justify-between items-center py-4 px-6 bg-gray-100">
        <h1 className="text-3xl font-bold">Interactive Map</h1>
        <Button onClick={handleClearDrawings}>Clear Drawings</Button>
      </div>
      <div className="flex-grow w-full">
        <MapContainer center={[51.505, -0.09]} zoom={13} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <MapControls />
          <MarkerClusterGroup>
            {markers.map((marker, index) => (
              <Marker key={index} position={marker.position}>
                <Popup>{marker.popup}</Popup>
              </Marker>
            ))}
          </MarkerClusterGroup>
        </MapContainer>
      </div>
      {clickedAddress && (
        <div className="absolute bottom-4 left-4 bg-white p-2 rounded shadow">
          <p><strong>Clicked Address:</strong> {clickedAddress}</p>
        </div>
      )}
    </div>
  );
};

export default Index;