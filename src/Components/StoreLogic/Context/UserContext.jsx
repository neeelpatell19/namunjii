import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import homeApi from "../../../apis/home";
import deviceApi from "../../../apis/device";
import {
  getDeviceInfo,
  isDeviceRegistered,
  markDeviceRegistered,
  retryDeviceRegistration,
} from "../../../utils/deviceUtils";

// eslint-disable-next-line react-refresh/only-export-components
export const ContextTypes = {
  Home: "SET_HOME",
  HomeLoading: "SET_HOME_LOADING",
  HomeError: "SET_HOME_ERROR",
  Device: "SET_DEVICE",
  DeviceLoading: "SET_DEVICE_LOADING",
  DeviceError: "SET_DEVICE_ERROR",
};

const initialState = {
  Home: {},
  HomeLoading: true,
  HomeError: null,
  Device: null,
  DeviceLoading: false,
  DeviceError: null,
  dispatch: () => {},
};
// eslint-disable-next-line react-refresh/only-export-components
export const UserContext = createContext(initialState);

export const UserProvider = ({ children }) => {
  const [Home, setHome] = useState(initialState.Home);
  const [HomeLoading, setHomeLoading] = useState(true);
  const [HomeError, setHomeError] = useState(null);
  const [Device, setDevice] = useState(initialState.Device);
  const [DeviceLoading, setDeviceLoading] = useState(false);
  const [DeviceError, setDeviceError] = useState(null);
  const deviceRegistrationInitiated = useRef(false);

  const dispatch = (type, payload) => {
    switch (type) {
      case ContextTypes.Home:
        setHome(payload);
        break;
      case ContextTypes.HomeLoading:
        setHomeLoading(payload);
        break;
      case ContextTypes.HomeError:
        setHomeError(payload);
        break;
      case ContextTypes.Device:
        setDevice(payload);
        break;
      case ContextTypes.DeviceLoading:
        setDeviceLoading(payload);
        break;
      case ContextTypes.DeviceError:
        setDeviceError(payload);
        break;
      default:
        return;
    }
  };

  // Device registration function
  const registerDevice = useCallback(async () => {
    // Prevent multiple registrations
    if (DeviceLoading || deviceRegistrationInitiated.current) {
      return;
    }

    deviceRegistrationInitiated.current = true;

    try {
      setDeviceLoading(true);
      setDeviceError(null);

      // Get device information first (this ensures deviceId is generated)
      const deviceInfo = getDeviceInfo();

      // Store device info in context immediately
      setDevice(deviceInfo);

      // Check if device is already registered
      if (isDeviceRegistered()) {
        setDeviceLoading(false);
        return;
      }

      // Register device with server using retry logic
      await retryDeviceRegistration(deviceApi, deviceInfo);

      // Mark device as registered
      markDeviceRegistered();
    } catch (error) {
      setDeviceError(
        error.message ||
          error.response?.data?.message ||
          "Device registration failed"
      );
    } finally {
      setDeviceLoading(false);
    }
  }, [DeviceLoading]);

  useEffect(() => {
    setHomeLoading(true);
    homeApi
      .getHome()
      .then((res) => {
        setHome(res.data);
        setHomeError(null);
      })
      .catch((err) => {
        setHomeError(
          err.message || err.response.data.message || "Something went wrong"
        );
      })
      .finally(() => {
        setHomeLoading(false);
      });

    // Register device on page load
    registerDevice();
  }, [registerDevice]); // Include registerDevice in dependencies

  const value = useMemo(
    () => ({
      Home,
      HomeLoading,
      HomeError,
      Device,
      DeviceLoading,
      DeviceError,
      registerDevice,
      dispatch,
    }),
    [
      Home,
      HomeLoading,
      HomeError,
      Device,
      DeviceLoading,
      DeviceError,
      registerDevice,
    ]
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
