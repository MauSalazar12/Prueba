import { useState } from "react";
import { lookupIp } from "../api";

export default function IpLookupForm({ onLookupSuccess, onDuplicate }) {
  const [ip, setIp] = useState("");

  const handleLookup = async () => {
    if (!ip) return;

    try {
      const res = await lookupIp(ip);
      onLookupSuccess(res.data);
      setIp("");
    } catch (err) {
      if (err.response?.status === 409) {
        onDuplicate(err.response.data);
      } else {
        alert("Error realizando la consulta");
      }
    }
  };

  return (
    <div className="lookup-form">
      <input
        type="text"
        placeholder="Ingresa una IP"
        value={ip}
        onChange={(e) => setIp(e.target.value)}
      />
      <button onClick={handleLookup}>Consultar</button>
    </div>
  );
}
