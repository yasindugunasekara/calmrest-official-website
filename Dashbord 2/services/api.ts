import axios from "axios";

// 1. Configure the custom axios instance (used in Login and adminRegister)
const api = axios.create({
  baseURL:
    (import.meta.env.VITE_API_BASE_URL as string) ||
    "http://localhost:5000/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 2. Configure the global axios instance interceptor (for legacy raw axios usages in dashboard components)
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers = config.headers || {};
    if (typeof config.headers.set === 'function') {
      config.headers.set('Authorization', `Bearer ${token}`);
    } else {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
  }
  return config;
});

// 3. Patch window.fetch globally (for legacy raw fetch usages in dashboard components)
if (typeof window !== "undefined") {
  const originalFetch = window.fetch;
  window.fetch = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
    const token = localStorage.getItem("token");
    if (token) {
      const fetchInit = { ...init };
      if (!fetchInit.headers) {
        fetchInit.headers = {};
      }

      if (fetchInit.headers instanceof Headers) {
        if (!fetchInit.headers.has("Authorization")) {
          fetchInit.headers.set("Authorization", `Bearer ${token}`);
        }
      } else if (Array.isArray(fetchInit.headers)) {
        const hasAuth = fetchInit.headers.some(
          ([key]) => key.toLowerCase() === "authorization"
        );
        if (!hasAuth) {
          fetchInit.headers.push(["Authorization", `Bearer ${token}`]);
        }
      } else {
        const hasAuth = Object.keys(fetchInit.headers).some(
          (key) => key.toLowerCase() === "authorization"
        );
        if (!hasAuth) {
          (fetchInit.headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;
        }
      }
      return originalFetch(input, fetchInit);
    }
    return originalFetch(input, init);
  };
}

export default api;
