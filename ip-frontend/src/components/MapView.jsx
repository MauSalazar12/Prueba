import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Icono del marcador (Leaflet necesita esto manualmente)
const icon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

export default function MapView({ lat, lng, ip }) {
  if (!lat || !lng) {
    return <p>No hay coordenadas para mostrar el mapa.</p>;
  }

  return (
    <MapContainer
      center={[lat, lng]}
      zoom={11}
      scrollWheelZoom={false}
      style={{
        width: "100%",
        height: "400px",
        marginTop: "28px",
        borderRadius: "14px",
        overflow: "hidden"
      }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap Contributors"
      />

      <Marker position={[lat, lng]} icon={icon}>
        <Popup>
          <strong>IP:</strong> {ip} <br />
          <strong>Lat:</strong> {lat} <br />
          <strong>Lng:</strong> {lng}
        </Popup>
      </Marker>
    </MapContainer>
  );
}
