import { useContext } from "react";
import { UserContext } from "../Components/StoreLogic/Context/UserContext";

// Custom hook to easily access device information
export const useDevice = () => {
  const { Device, DeviceLoading, DeviceError, registerDevice } =
    useContext(UserContext);

  return {
    device: Device,
    deviceLoading: DeviceLoading,
    deviceError: DeviceError,
    registerDevice,
    deviceId: Device?.deviceId,
    isDeviceReady: Device && !DeviceLoading && !DeviceError,
  };
};


