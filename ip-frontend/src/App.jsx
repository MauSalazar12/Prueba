import { useEffect, useState } from "react";
import { getIps } from "./api";
import IpLookupForm from "./components/IpLookupForm";
import IpTable from "./components/IpTable";
import MapView from "./components/MapView";
import "./App.css";

export default function App() {
  const [ips, setIps] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);

  // Cargar datos al inicio
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const res = await getIps();
    setIps(res.data);
  };

  // Cuando se consulta una IP nueva
  const handleLookupSuccess = (newRecord) => {
    setIps((prev) => [newRecord, ...prev]);

    // Seleccionar nueva IP en el mapa
    setSelectedLocation({
      lat: newRecord.latitude,
      lng: newRecord.longitude,
      ip: newRecord.ip
    });
  };

  // Cuando se hace clic a una fila de la tabla
  const handleSelectFromTable = (record) => {
    setSelectedLocation({
      lat: record.latitude,
      lng: record.longitude,
      ip: record.ip
    });
  };

  // Cuando se elimina un registro
  const handleDelete = (id) => {
    setIps((prev) => prev.filter((i) => i.id !== id));

    // Limpiar mapa para evitar reselección automática
    setSelectedLocation(null);
  };

  return (
    <div className="container">
      <h1>Consulta de IPs</h1>

      <IpLookupForm
        onLookupSuccess={handleLookupSuccess}
        onDuplicate={(record) => alert("La IP ya existe")}
      />

      <IpTable 
        data={ips}
        onDelete={handleDelete}
        onRowClick={handleSelectFromTable}
      />

      {/* Mostrar mapa solo si hay una IP seleccionada */}
      {selectedLocation && (
        <MapView
          lat={selectedLocation.lat}
          lng={selectedLocation.lng}
          ip={selectedLocation.ip}
        />
      )}
    </div>
  );
}
