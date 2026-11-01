export const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || "/api"
).replace(/\/$/, "");
const catalogueCache = new Map<
  string,
  { expires: number; response: Response }
>();
export async function apiFetch(input: RequestInfo | URL, init?: RequestInit) {
  const url = String(input);
  const cacheable =
    (!init?.method || init.method === "GET") &&
    !init?.signal &&
    /^.*\/rooms(?:\/[a-f0-9]{24})?$/.test(url);
  const cached = catalogueCache.get(url);
  if (cacheable && cached && cached.expires > Date.now())
    return cached.response.clone();
  if (init?.method && init.method !== "GET") catalogueCache.clear();
  const response = await fetch(input, {
    ...init,
    signal: init?.signal || AbortSignal.timeout(20000),
  });
  if (response.status === 401 && String(input).startsWith(API_BASE_URL + "/")) {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }
  if (!response.ok) {
    let message = "Unable to complete your request.";
    try {
      const data = await response.json();
      message = data.error || data.message || message;
    } catch {
      /* Non-JSON gateway error. */
    }
    throw new Error(message);
  }
  if (cacheable) {
    if (catalogueCache.size > 30) catalogueCache.clear();
    catalogueCache.set(url, {
      expires: Date.now() + 20000,
      response: response.clone(),
    });
  }
  return response;
}
