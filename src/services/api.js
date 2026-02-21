import axios from "axios";

const api = axios.create({
  baseURL: "https://royalfly.imcbs.com/api/",  // Production
  // baseURL: "http://127.0.0.1:8000/api/",  // Local development
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
