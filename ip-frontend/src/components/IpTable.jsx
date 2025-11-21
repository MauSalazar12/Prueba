import { deleteIp } from "../api";
import { useState, useMemo } from "react";

export default function IpTable({ data, onDelete, onRowClick }) {
  const [countryFilter, setCountryFilter] = useState(null);
  const [typeFilter, setTypeFilter] = useState(null);
  const [cityFilter, setCityFilter] = useState(null);

  const clearFilters = () => {
    setCountryFilter(null);
    setTypeFilter(null);
    setCityFilter(null);
  };

  // ------------------------------------
  //    GENERAR LISTAS DINÁMICAS
  // ------------------------------------
  const countries = useMemo(() => {
    const set = new Set();
    data.forEach((row) => row.country && set.add(row.country));
    return [...set];
  }, [data]);

  const types = useMemo(() => {
    const set = new Set();
    data.forEach((row) => row.ipType && set.add(row.ipType));
    return [...set];
  }, [data]);

  const cities = useMemo(() => {
    const set = new Set();
    data.forEach((row) => row.city && set.add(row.city));
    return [...set];
  }, [data]);

  // ------------------------------------
  //           FILTRADO FINAL
  // ------------------------------------
  const filtered = data.filter((row) => {
    const matchCountry = countryFilter ? row.country === countryFilter : true;
    const matchType = typeFilter ? row.ipType === typeFilter : true;
    const matchCity = cityFilter ? row.city === cityFilter : true;

    return matchCountry && matchType && matchCity;
  });

  // ------------------------------------
  //               RENDER
  // ------------------------------------
  return (
    <div>
      {/* ---------------------------- */}
      {/*        FILTROS DINÁMICOS     */}
      {/* ---------------------------- */}

      <div style={{ marginBottom: "20px" }}>
        <strong>País:</strong>
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          {countries.map((c) => (
            <button
              key={c}
              onClick={() => setCountryFilter(c)}
              style={{
                background: countryFilter === c ? "#d9534f" : "white",
                color: countryFilter === c ? "white" : "black",
                border: "1px solid #ccc",
                padding: "4px 10px",
                borderRadius: "4px",
                cursor: "pointer"
              }}
            >
              {c}
            </button>
          ))}
        </div>

        <strong>Tipo:</strong>
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          {types.map((t) => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              style={{
                background: typeFilter === t ? "#5bc0de" : "white",
                color: typeFilter === t ? "white" : "black",
                border: "1px solid #ccc",
                padding: "4px 10px",
                borderRadius: "4px",
                cursor: "pointer"
              }}
            >
              {t}
            </button>
          ))}
        </div>

        <strong>Ciudad:</strong>
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          {cities.map((city) => (
            <button
              key={city}
              onClick={() => setCityFilter(city)}
              style={{
                background: cityFilter === city ? "#5cb85c" : "white",
                color: cityFilter === city ? "white" : "black",
                border: "1px solid #ccc",
                padding: "4px 10px",
                borderRadius: "4px",
                cursor: "pointer"
              }}
            >
              {city}
            </button>
          ))}
        </div>

        <button
          onClick={clearFilters}
          style={{
            marginTop: "10px",
            padding: "5px 15px",
            background: "#333",
            color: "white",
            border: "none",
            cursor: "pointer",
            borderRadius: "4px"
          }}
        >
          Limpiar filtros
        </button>
      </div>

      {/* ---------------------------- */}
      {/*             TABLA            */}
      {/* ---------------------------- */}

      <table>
        <thead>
          <tr>
            <th>IP</th>
            <th>Tipo</th>
            <th>País</th>
            <th>Región</th>
            <th>Ciudad</th>
            <th>ISP</th>
            <th>Amenaza</th>
            <th></th>
          </tr>
        </thead>

        <tbody>
          {filtered.length === 0 && (
            <tr>
              <td colSpan="8" style={{ textAlign: "center" }}>
                No hay datos disponibles
              </td>
            </tr>
          )}

          {filtered.map((row) => (
            <tr
              key={row.id}
              onClick={() => onRowClick(row)}
              style={{ cursor: "pointer" }}
            >
              <td>{row.ip}</td>
              <td>{row.ipType}</td>
              <td>{row.country}</td>
              <td>{row.region}</td>
              <td>{row.city}</td>
              <td>{row.isp}</td>
              <td>{String(row.threatInfo)}</td>
              <td>
                <button
                  className="delete"
                  onClick={(e) => {
                    e.preventDefault(); // Evita comportamiento por defecto
                    e.stopPropagation(); // Evita ejecutar el click del TR
                    onDelete(row.id); // Elimina el registro
                  }}
                  style={{
                    cursor: "pointer",
                    background: "transparent",
                    border: "1px solid #ff5c8a",
                    padding: "4px 10px",
                    borderRadius: "6px",
                    color: "#ff5c8a"
                  }}
                >
                  ❌
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
