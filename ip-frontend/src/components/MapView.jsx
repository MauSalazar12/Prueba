import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix para el ícono del marcador
const icon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

export default function MapView({ lat, lng, ip }) {
  if (!lat || !lng) return <p>No hay coordenadas para mostrar en el mapa.</p>;

  return (
    <MapContainer
      center={[lat, lng]}
      zoom={10}
      scrollWheelZoom={false}
      style={{ height: "400px", width: "100%", marginTop: "20px" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />

      <Marker position={[lat, lng]} icon={icon}>
        <Popup>IP: {ip}</Popup>
      </Marker>
    </MapContainer>
  );
}
