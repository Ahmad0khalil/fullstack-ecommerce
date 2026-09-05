import { deleteProduct, editProduct, getProductById,  } from "@/services/productService";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { data, status } = await getProductById(id);
  return NextResponse.json(data, { status });
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const { data, status } = await editProduct(id, body);
  return NextResponse.json(data, { status });
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  console.log("Received request to delete product with ID:", id);
  const { data, status } = await deleteProduct(id);
  return NextResponse.json(data, { status });
}