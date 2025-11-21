import axios from "axios";

const API_BASE = "http://localhost:8080/api/ips";

export const lookupIp = (ip) =>
  axios.post(`${API_BASE}/lookup`, { ip });

export const getIps = () =>
  axios.get(API_BASE);

export const deleteIp = (id) =>
  axios.delete(`${API_BASE}/${id}`);
