import axios from "axios";
const api = axios.create({ baseURL: "https://backend.e-hisobchi.uz/api" });
export default api;