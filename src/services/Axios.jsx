import axios from "axios";

const BASE_URL = "https://tyradex.app/api/v1";

export default axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});