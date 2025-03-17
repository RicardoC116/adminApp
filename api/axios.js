import axios from "axios";

const api = axios.create({
  // casa
  // baseURL: "http://192.168.80.235:3000/api",

  // oficina
  // baseURL: "http://192.168.14.71:3000/api",

  // Chilac
  // baseURL: "https://cobrobackend2-production.up.railway.app/api",

  // Virsac
  baseURL: "https://cobrobackend2-production-96fe.up.railway.app/api",

  // San Jose
  // baseURL: "https://cobrobackend2-production-8129.up.railway.app/api",
});

export default api;
