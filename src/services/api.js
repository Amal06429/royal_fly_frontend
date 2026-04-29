import axios from "axios";

const api = axios.create({
  baseURL: "https://royalfly.imcbs.com/api/", // ✅ trailing slash REQUIRED
  headers: {
    "Content-Type": "application/json",
  },
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  
  failedQueue = [];
};

// Add JWT token to all requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle 401 errors (unauthorized/token expired) with refresh token logic
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401) {
      const user = localStorage.getItem("user");
      
      // If no user data, they weren't logged in - just reject
      if (!user) {
        return Promise.reject(error);
      }

      // If already refreshing, queue this request
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        }).catch(err => Promise.reject(err));
      }

      // Try to refresh the token
      isRefreshing = true;
      const refreshToken = localStorage.getItem("refresh");

      if (!refreshToken) {
        // No refresh token, must login again
        console.log("No refresh token available, redirecting to login...");
        localStorage.clear();
        window.location.href = "/login";
        return Promise.reject(error);
      }

      return new Promise((resolve, reject) => {
        api.post("login/refresh/", { refresh: refreshToken })
          .then((response) => {
            const newAccessToken = response.data.access;
            localStorage.setItem("access", newAccessToken);
            api.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            processQueue(null, newAccessToken);
            isRefreshing = false;
            resolve(api(originalRequest));
          })
          .catch((err) => {
            // Refresh failed, must login again
            console.log("Token refresh failed, redirecting to login...");
            localStorage.clear();
            window.location.href = "/login";
            processQueue(err, null);
            isRefreshing = false;
            reject(err);
          });
      });
    }
    return Promise.reject(error);
  }
);

export default api;