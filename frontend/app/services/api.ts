export function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

function hasBody(method?: string, body?: unknown) {
  if (!method) return Boolean(body);
  const m = method.toUpperCase();
  if (m === "GET" || m === "HEAD") return false;
  return body !== undefined && body !== null;
}

export async function apiFetch(path: string, options: RequestInit = {}) {
  const base = process.env.NEXT_PUBLIC_API_URL!;
  const token = getToken();

  const extraHeaders =
    options.headers instanceof Headers
      ? Object.fromEntries(options.headers.entries())
      : (options.headers ?? {});

  const headers: Record<string, string> = {
    ...(extraHeaders as Record<string, string>),
  };

  // Set JSON content-type ONLY if we actually send a body
  const sendBody = hasBody(options.method, options.body);
  if (sendBody && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }

  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${base}${path}`, { ...options, headers });

  // Some endpoints might return 204 No Content
  const text = await res.text();
  const data = text ? JSON.parse(text) : {};

  if (!res.ok) {
    throw new Error(
      (data as { message?: string })?.message || "Request failed",
    );
  }

  return data;
}
