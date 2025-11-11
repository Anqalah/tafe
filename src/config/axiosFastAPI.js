import axios from "axios";

const axiosFastAPI = axios.create({
  baseURL: "http://https://taml.onrender.com", // FastAPI URL
  // baseURL: "http://localhost:5000", // FastAPI URL
  headers: {
    "Content-Type": "multipart/form-data",
  },
});

export default axiosFastAPI;
