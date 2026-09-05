import { apiClient } from "@/lib/serverApiClient";

export async function getCategories() {
  const res = await apiClient("/categories", "GET");
  if (!res.success) {
    console.error("Failed to fetch categories:", res.message);
    return [];
  }

  return res.data;
}
