import { getCategoryById, deleteCategory, editCategory } from "@/services/categoryService";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { data, status } = await getCategoryById(id);
  return NextResponse.json(data, { status });
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const { data, status } = await editCategory(id, body);
  return NextResponse.json(data, { status });
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { data, status } = await deleteCategory(id);
  return NextResponse.json(data, { status });
}