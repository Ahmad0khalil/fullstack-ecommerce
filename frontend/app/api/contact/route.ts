import { NextResponse } from "next/server";
import { apiClient } from "@/lib/serverApiClient";
 
export async function POST(request: Request) {
  const body = await request.json();
  const result = await apiClient("/contact", "POST", body);
 
  return NextResponse.json(result, {
    status: result.status ?? (result.success ? 200 : 500),
  });
}
 