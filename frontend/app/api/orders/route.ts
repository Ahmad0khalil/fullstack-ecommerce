import { getOrders, createOrder } from "@/services/ordersService";
import { NextResponse } from "next/server";

export async function GET() {
  const { data, status } = await getOrders();
  return NextResponse.json(data, { status });
}

export async function POST(request: Request) {
  const body = await request.json();
  const { data, status } = await createOrder(body);
  return NextResponse.json(data, { status });
}