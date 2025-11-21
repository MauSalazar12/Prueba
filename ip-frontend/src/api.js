import axios from "axios";

const API_BASE = "https://prueba-production-7db2.up.railway.app/api/ips";

export const lookupIp = (ip) =>
  axios.post(`${API_BASE}/lookup`, { ip });

export const getIps = () =>
  axios.get(API_BASE);

export const deleteIp = (id) =>
  axios.delete(`${API_BASE}/${id}`);
