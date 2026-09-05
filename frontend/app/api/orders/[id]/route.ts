import { getOrderId, editOrder } from "@/services/ordersService";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { data, status } = await getOrderId(id);
  return NextResponse.json(data, { status });
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const { data, status } = await editOrder(id, body);
  return NextResponse.json(data, { status });
}
