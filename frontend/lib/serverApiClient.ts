import { cookies } from "next/headers";

const API_URL = process.env.API_URL || "http://localhost:5000/api";

type Method = "GET" | "POST" | "PUT" | "DELETE";

// Define the shape of your backend's ApiResponse
interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
  status?: number;
  meta?: {
    totalCount?: number;
    page?: number;
    limit?: number;
    totalPages?: number;
  };
}

const getCookieHeader = async () => {
  const cookieStore = await cookies();
  return cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");
};

export async function apiClient<T = any>(
  endpoint: string,
  method: Method = "GET",
  body?: any,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const cookieHeader = await getCookieHeader();

    const res = await fetch(`${API_URL}${endpoint}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        Cookie: cookieHeader,
        ...options.headers,
      },
      ...(body && { body: JSON.stringify(body) }),
      ...options,
      // Optional: Add cache settings for Next.js 15+
      // next: { revalidate: 3600 } 
    });

    const result = await res.json();

    // If the backend sent a 400 or 500, it already follows our ApiResponse shape
    if (!res.ok) {
      return {
        success: false,
        message: result.message || "An error occurred",
        data: result.data ?? result.error ?? null,
        status: res.status,
      };
    }

    return { ...result, status: res.status }; // { success, message, data, meta, status }
  } catch (error) {
    console.error(`[API Client Error] ${endpoint}:`, error);
    return {
      success: false,
      message: "Network error or Server is down",
      data: null as any,
    };
  }
}