import { apiClient } from "@/lib/serverApiClient";
import type { Product } from "@/app/types/product";

export async function getProducts(
  page: number = 1,
  limit: number = 10,
  offset: number = 0,
  sort?: string,
  categories?: string,
  maxprice?: number
) {
  const params = new URLSearchParams();
  params.append("page", page.toString());
  params.append("limit", limit.toString());
  params.append("offset", offset.toString());
  if (sort) params.append("sort", sort);
  if (maxprice) params.append("maxprice", maxprice.toString());
  if (categories) params.append("categories", categories);
  return apiClient<Product[]>(`/products?${params.toString()}`, "GET");
}

export async function createProduct(data: any) {
  return await apiClient("/products", "POST", data);
}

export async function getProductById(id: string) {
  return await apiClient(`/products/${id}`, "GET");
}

export async function editProduct(id: string, data: any) {
  return await apiClient(`/products/${id}`, "PUT", data);
}

export async function deleteProduct(id: string) {
  console.log("Deleting product with ID:", id);
  return await apiClient(`/products/${id}`, "DELETE");
}