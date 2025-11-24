import axios from "axios";
import { URLS } from "../config/urls";

// Create a base API instance for auth endpoints (without authorization header)
const createAuthApi = () => {
  const deviceId = localStorage.getItem("deviceId");

  return axios.create({
    baseURL: URLS.base,
    headers: {
      "x-device-id": deviceId || "",
      "Content-Type": "application/json",
    },
    withCredentials: true,
  });
};

const createAuthApiInstance = () => {
  const api = createAuthApi();
  return {
    // Send OTP to phone number
    sendOTP: (mobileNumber) =>
      api
        .post("/send-otp", { mobileNumber })
        .then((res) => res.data)
        .catch((error) => {
          throw error.response?.data || error;
        }),

    // Verify OTP and login/register
    verifyOTP: (otp, mobileNumber) =>
      api
        .post("/verify-otp", { otp, mobileNumber })
        .then((res) => res.data)
        .catch((error) => {
          throw error.response?.data || error;
        }),
  };
};

const authApi = createAuthApiInstance();

export default authApi;

