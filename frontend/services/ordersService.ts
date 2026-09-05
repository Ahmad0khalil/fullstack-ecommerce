import { apiClient } from "@/lib/serverApiClient";

export async function getOrders(limit: number = 20) {
  return await apiClient(`/orders?limit=${limit}`, "GET");
}

export async function createOrder(data: any) {
  return await apiClient("/orders", "POST", data);
}

export async function getOrderId(id: string) {
  return await apiClient(`/orders/${id}`, "GET");
}

export async function editOrder(id: string, data: any) {
  return await apiClient(`/orders/${id}`, "PUT", data);
}

export async function deleteOrder(id: string) {
  console.log("Deleting order with ID:", id);
  return await apiClient(`/orders/${id}`, "DELETE");
}