import { apiClient } from "@/lib/serverApiClient";

export async function getCategories() {
  return await apiClient("/categories", "GET");
}

export async function getCategoryById(id: string) {
  return await apiClient(`/categories/${id}`, "GET");
}

export async function editCategory(id: string, data: any) {
  return await apiClient(`/categories/${id}`, "PUT", data);
}

export async function deleteCategory(id: string) {
  return await apiClient(`/categories/${id}`, "DELETE");
}