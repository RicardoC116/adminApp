import axios from "axios";

const api = axios.create({
  // casa
  baseURL: "http://192.168.80.235:3000/api",

  // trabajo
  // baseURL: "http://192.168.1.110:3000/api",
});

export default api;
