import { useEffect, useState } from "react";
import { getIps } from "./api";
import IpLookupForm from "./components/IpLookupForm";
import IpTable from "./components/IpTable";
import MapView from "./components/MapView";
import "./App.css";

export default function App() {
  const [ips, setIps] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const res = await getIps();
    setIps(res.data);
  };

  const handleLookupSuccess = (newRecord) => {
    setIps((prev) => [newRecord, ...prev]);
    setSelectedLocation({
      lat: newRecord.latitude,
      lng: newRecord.longitude,
      ip: newRecord.ip
    });
  };

  const handleSelectFromTable = (record) => {
    setSelectedLocation({
      lat: record.latitude,
      lng: record.longitude,
      ip: record.ip
    });
  };

  return (
    <div className="container">
      <h1>Consulta de IPs</h1>

      <IpLookupForm
        onLookupSuccess={handleLookupSuccess}
        onDuplicate={(r) => alert("Duplicada")}
      />

      <IpTable data={ips} onRowClick={handleSelectFromTable} />

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
