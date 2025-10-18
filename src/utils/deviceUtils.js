// Generate or retrieve device information
export const getDeviceInfo = () => {
  // Check if device ID already exists in localStorage
  let deviceId = localStorage.getItem("deviceId");

  if (!deviceId) {
    // Generate a unique device ID
    deviceId = generateDeviceId();
    localStorage.setItem("deviceId", deviceId);
  }

  // Get additional device information
  const deviceInfo = {
    deviceId,
    userAgent: navigator.userAgent,
    platform: navigator.platform,
    language: navigator.language,
    screenResolution: `${screen.width}x${screen.height}`,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    timestamp: new Date().toISOString(),
  };

  return deviceInfo;
};

// Generate a unique device ID
const generateDeviceId = () => {
  const timestamp = Date.now().toString(36);
  const randomString = Math.random().toString(36).substring(2, 15);
  return `${timestamp}-${randomString}`;
};

// Check if device is already registered
export const isDeviceRegistered = () => {
  return localStorage.getItem("deviceRegistered") === "true";
};

// Mark device as registered
export const markDeviceRegistered = () => {
  localStorage.setItem("deviceRegistered", "true");
};

// Retry device registration with exponential backoff
export const retryDeviceRegistration = async (
  deviceApi,
  deviceInfo,
  maxRetries = 3,
  baseDelay = 1000
) => {
  let lastError;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      await deviceApi.registerDevice(deviceInfo);
      return true; // Success
    } catch (error) {
      lastError = error;

      if (attempt === maxRetries) {
        throw lastError; // Final attempt failed
      }

      // Calculate delay with exponential backoff
      const delay = baseDelay * Math.pow(2, attempt - 1);

      // Wait before retrying
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw lastError;
};
