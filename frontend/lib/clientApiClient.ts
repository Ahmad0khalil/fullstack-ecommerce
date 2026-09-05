export async function clientApiClient<T = any>(
  endpoint: string,
  method: string = "GET",
  body?: any
) {
  try {
    // Calls Next.js route handlers relative to the browser domain
    const res = await fetch(`/api${endpoint}`, {
      method,
      headers: { "Content-Type": "application/json" },
      ...(body && { body: JSON.stringify(body) }),
    });

    const result = await res.json();
    return { ...result, success: res.ok, status: res.status };
  } catch (error) {
    return { success: false, status: 0, message: "Network connection error" };
  }
}