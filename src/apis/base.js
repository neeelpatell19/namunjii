import axios from "axios";

const createBaseApi = (url, headers = {}, config = {}) => {
  const deviceId = localStorage.getItem("deviceId");

  return axios.create({
    baseURL: url,
    headers: {
      Authorization: `Token ${localStorage.getItem("token")}`,
      "x-device-id": deviceId || "",
      "Content-Type": "application/json",
      ...headers,
    },
    withCredentials: true,
    ...config,
  });
};

export default createBaseApi;
