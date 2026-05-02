import axios from "axios";

const api = axios.create({
  baseURL: "https://royalfly.imcbs.com/api/", // ✅ trailing slash REQUIRED
  headers: {
    "Content-Type": "application/json",
  },
});

const authApi = axios.create({
 baseURL: "https://royalfly.imcbs.com/api/",
  headers: {
    "Content-Type": "application/json",
  },
});

let isRefreshing = false;
let refreshPromise = null;
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

const decodeJwtPayload = (token) => {
  try {
    const payload = token.split('.')[1];
    if (!payload) {
      return null;
    }

    const normalized = payload.replace(/-/g, '+').replace(/_/g, '/');
    const base64 = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=');
    return JSON.parse(atob(base64));
  } catch (error) {
    return null;
  }
};

const isAuthEndpoint = (url = "") => {
  return url.includes("login/") || url.includes("login/refresh/");
};

const isTokenExpiringSoon = (token, bufferSeconds = 60) => {
  const payload = decodeJwtPayload(token);
  if (!payload?.exp) {
    return false;
  }

  const expiresAt = payload.exp * 1000;
  return Date.now() >= (expiresAt - bufferSeconds * 1000);
};

const refreshAccessToken = async () => {
  if (refreshPromise) {
    return refreshPromise;
  }

  const refreshToken = localStorage.getItem("refresh");
  if (!refreshToken) {
    throw new Error("Refresh token missing");
  }

  refreshPromise = authApi
    .post("login/refresh/", { refresh: refreshToken })
    .then((response) => {
      const newAccessToken = response.data.access;
      localStorage.setItem("access", newAccessToken);
      api.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;
      authApi.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;
      processQueue(null, newAccessToken);
      return newAccessToken;
    })
    .catch((error) => {
      processQueue(error, null);
      throw error;
    })
    .finally(() => {
      refreshPromise = null;
    });

  return refreshPromise;
};

// Add JWT token to all requests
api.interceptors.request.use(
  async (config) => {
    if (isAuthEndpoint(config.url || "")) {
      return config;
    }

    const token = localStorage.getItem("access");
    if (token) {
      if (isTokenExpiringSoon(token)) {
        try {
          const newAccessToken = await refreshAccessToken();
          config.headers.Authorization = `Bearer ${newAccessToken}`;
          return config;
        } catch (error) {
          return Promise.reject(error);
        }
      }

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

    if (!originalRequest || isAuthEndpoint(originalRequest.url || "")) {
      return Promise.reject(error);
    }

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

      return refreshAccessToken()
        .then((newAccessToken) => {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return api(originalRequest);
        })
        .catch((err) => {
          console.log("Token refresh failed, redirecting to login...");
          localStorage.clear();
          window.location.href = "/login";
          isRefreshing = false;
          return Promise.reject(err);
        });
    }
    return Promise.reject(error);
  }
);

export default api;