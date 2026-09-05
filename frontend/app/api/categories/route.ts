import { NextResponse } from "next/server";
import { apiClient } from "@/lib/serverApiClient";
import { getCategories } from "@/services/categoryService";

export async function GET() {
  const result = await getCategories();
  return NextResponse.json(result, { status: result.success ? 200 : 400 });
}


export async function POST(request: Request) {
  const body = await request.json();

  const { data,  } = await apiClient("/categories", "POST", body);

  return NextResponse.json(data, { status: 201 });
}