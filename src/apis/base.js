import axios from "axios";
import Cookies from "js-cookie";

// Helper function to get token from cookies or localStorage
const getToken = () => {
  // First check cookies, then localStorage
  return Cookies.get("token") || localStorage.getItem("token") || "";
};

const createBaseApi = (url, headers = {}, config = {}) => {
  const deviceId = localStorage.getItem("deviceId");
  const token = getToken();

  return axios.create({
    baseURL: url,
    headers: {
      Authorization: token ? `Token ${token}` : "",
      "x-device-id": deviceId || "",
      "Content-Type": "application/json",
      ...headers,
    },
    withCredentials: true,
    ...config,
  });
};

export default createBaseApi;
