// Mock API handler for GitHub Pages & standalone demo mode
(function() {
  if (typeof window === 'undefined') return;
  
  // Initialize mock sensor state in localStorage so it persists across refreshes
  var defaultLogs = [
    { id: 162, sensorId: "SENSOR_ALPHA_01", state: "ON", recordedAt: new Date(Date.now() - 60000).toISOString(), durationSeconds: 60, triggeredBy: "admin@sensorsimulator.com", temperature: 49.2, vibration: 2.45, batteryLevel: 92, statusMessage: "Sensor turned ON. Active operational mode engaged." },
    { id: 161, sensorId: "SENSOR_ALPHA_01", state: "OFF", recordedAt: new Date(Date.now() - 180000).toISOString(), durationSeconds: 120, triggeredBy: "admin@sensorsimulator.com", temperature: 24.8, vibration: 0.05, batteryLevel: 93, statusMessage: "Sensor turned OFF. Standby power mode active." },
    { id: 160, sensorId: "SENSOR_ALPHA_01", state: "ON", recordedAt: new Date(Date.now() - 360000).toISOString(), durationSeconds: 180, triggeredBy: "admin@sensorsimulator.com", temperature: 48.6, vibration: 2.12, batteryLevel: 94, statusMessage: "Sensor turned ON. Node telemetry emitting." }
  ];

  if (!localStorage.getItem("mock_sensor_logs")) {
    localStorage.setItem("mock_sensor_logs", JSON.stringify(defaultLogs));
  }
  if (!localStorage.getItem("mock_sensor_state")) {
    localStorage.setItem("mock_sensor_state", "ON");
  }

  window.__isGitHubPages = window.location.hostname.includes("github.io");

  // Hook into axios when it is available
  function setupMockInterceptor(axiosInstance) {
    if (!axiosInstance || axiosInstance.__mockSetup) return;
    axiosInstance.__mockSetup = true;

    var originalRequest = axiosInstance.prototype ? axiosInstance.prototype.request : axiosInstance.request;

    // Use interceptors on any instance or axios itself
    axiosInstance.interceptors.request.use(async function(config) {
      var isGh = window.__isGitHubPages;
      var url = config.url || "";

      // If on GitHub Pages or if URL points to localhost:8080 and we are on HTTPS, mock the response
      if (isGh || (window.location.protocol === "https:" && url.includes("localhost:8080"))) {
        config.adapter = async function() {
          var state = localStorage.getItem("mock_sensor_state") || "ON";
          var logs = JSON.parse(localStorage.getItem("mock_sensor_logs") || "[]");

          // Route handling
          if (url.includes("/auth/login") || url.includes("/auth/register")) {
            var data = config.data ? (typeof config.data === "string" ? JSON.parse(config.data) : config.data) : {};
            var user = {
              id: 1,
              email: data.email || "admin@sensorsimulator.com",
              fullName: data.fullName || "Chief Telemetry Operator",
              role: "ROLE_ADMIN",
              phone: data.phone || "+1 (555) 234-5678",
              createdAt: "2026-10-01T08:00:00Z"
            };
            return {
              data: {
                success: true,
                message: "Authentication successful (Demo Cloud Session)",
                data: {
                  accessToken: "mock-jwt-" + Date.now(),
                  refreshToken: "mock-refresh-" + Date.now(),
                  user: user
                }
              },
              status: 200,
              statusText: "OK",
              headers: {},
              config: config
            };
          }

          if (url.includes("/user/profile")) {
            var storedUser = JSON.parse(localStorage.getItem("user") || "null") || {
              id: 1,
              email: "admin@sensorsimulator.com",
              fullName: "Chief Telemetry Operator",
              role: "ROLE_ADMIN",
              phone: "+1 (555) 234-5678"
            };
            if (config.method === "put" || config.method === "PUT") {
              var updateData = config.data ? (typeof config.data === "string" ? JSON.parse(config.data) : config.data) : {};
              if (updateData.fullName) storedUser.fullName = updateData.fullName;
              if (updateData.phone) storedUser.phone = updateData.phone;
              localStorage.setItem("user", JSON.stringify(storedUser));
            }
            return {
              data: { success: true, message: "Profile retrieved", data: storedUser },
              status: 200,
              statusText: "OK",
              headers: {},
              config: config
            };
          }

          if (url.includes("/sensor/status")) {
            var isOn = state === "ON";
            return {
              data: {
                success: true,
                message: "Sensor status retrieved",
                data: {
                  sensorId: "SENSOR_ALPHA_01",
                  currentState: state,
                  currentDurationSeconds: Math.floor((Date.now() - (window.__lastToggleTime || Date.now() - 145000)) / 1000),
                  lastSwitchedAt: new Date(window.__lastToggleTime || Date.now() - 145000).toISOString(),
                  totalSwitches: logs.length,
                  totalOnCount: logs.filter(function(l) { return l.state === "ON"; }).length,
                  totalOffCount: logs.filter(function(l) { return l.state === "OFF"; }).length,
                  uptimeFormatted: "02h 45m 12s",
                  lastTemperature: isOn ? 49.4 : 24.2,
                  lastVibration: isOn ? 2.45 : 0.02,
                  lastBatteryLevel: 91
                }
              },
              status: 200,
              statusText: "OK",
              headers: {},
              config: config
            };
          }

          if (url.includes("/sensor/toggle")) {
            var toggleReq = config.data ? (typeof config.data === "string" ? JSON.parse(config.data) : config.data) : {};
            var nextState = toggleReq.action || (state === "ON" ? "OFF" : "ON");
            localStorage.setItem("mock_sensor_state", nextState);
            window.__lastToggleTime = Date.now();
            var newEntry = {
              id: logs.length ? Math.max.apply(null, logs.map(function(l) { return l.id; })) + 1 : 1,
              sensorId: "SENSOR_ALPHA_01",
              state: nextState,
              recordedAt: new Date().toISOString(),
              durationSeconds: Math.floor(Math.random() * 45) + 5,
              triggeredBy: (JSON.parse(localStorage.getItem("user") || "{}")).email || "admin@sensorsimulator.com",
              temperature: nextState === "ON" ? 49.8 : 24.3,
              vibration: nextState === "ON" ? 2.65 : 0.02,
              batteryLevel: 90,
              statusMessage: "Sensor turned " + nextState + ". Operational telemetry dispatched."
            };
            logs.unshift(newEntry);
            localStorage.setItem("mock_sensor_logs", JSON.stringify(logs));
            return {
              data: { success: true, message: "Sensor state changed to " + nextState, data: newEntry },
              status: 200,
              statusText: "OK",
              headers: {},
              config: config
            };
          }

          if (url.includes("/sensor/history")) {
            if (config.method === "delete" || config.method === "DELETE") {
              localStorage.setItem("mock_sensor_logs", JSON.stringify([]));
              return { data: { success: true, message: "History cleared", data: [] }, status: 200, statusText: "OK", headers: {}, config: config };
            }
            return {
              data: { success: true, message: "History logs retrieved", data: logs },
              status: 200,
              statusText: "OK",
              headers: {},
              config: config
            };
          }

          if (url.includes("/auth/change-password") || url.includes("/auth/forgot-password") || url.includes("/auth/reset-password")) {
            return {
              data: { success: true, message: "Operation completed successfully" },
              status: 200,
              statusText: "OK",
              headers: {},
              config: config
            };
          }

          return {
            data: { success: true, message: "OK", data: {} },
            status: 200,
            statusText: "OK",
            headers: {},
            config: config
          };
        };
      }
      return config;
    });
  }

  // Hook globally
  if (window.axios) {
    setupMockInterceptor(window.axios);
  }
  var _create = window.axios ? window.axios.create : null;
  if (_create) {
    window.axios.create = function() {
      var instance = _create.apply(this, arguments);
      setupMockInterceptor(instance);
      return instance;
    };
  }
})();
