import axios from "axios";

const api = axios.create({
  baseURL: "https://royalfly.imcbs.com/api/",
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
