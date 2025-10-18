import axios from "axios";

const createBaseApi = (url, headers = {}, config = {}) => {
  return axios.create({
    baseURL: url,
    headers: {
      Authorization: `Token ${localStorage.getItem("token")}`,
      "x-device-id": localStorage.getItem("deviceId"),
      "Content-Type": "application/json",
      ...headers,
    },
    withCredentials: true,
    ...config,
  });
};

export default createBaseApi;
