import createBaseApi from "./base";
import { URLS } from "../config/urls";

const createDeviceApi = () => {
  const api = createBaseApi(URLS.base);
  return {
    // Register device - can be called with POST or GET
    registerDevice: (deviceData) => {
      // Try POST first, fallback to GET if needed
      return api.post("/register-device", deviceData).catch(() => {
        return api.get("/register-device", { params: deviceData });
      });
    },
  };
};

const deviceApi = createDeviceApi();

export default deviceApi;













