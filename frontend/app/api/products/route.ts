import { createProduct, getProducts} from "@/services/productService";
import { NextResponse } from "next/server";

export async function GET() {
  const { data, status } = await getProducts();
  return NextResponse.json(data, { status });
}

export async function POST(request: Request) {
  const body = await request.json();
  const { data, status } = await createProduct(body);
  return NextResponse.json(data, { status });
}