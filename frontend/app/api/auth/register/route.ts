import { NextResponse } from "next/server";
import { apiClient } from "@/lib/serverApiClient";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const result = await apiClient("/auth/register", "POST", body);

    return NextResponse.json(result, { 
      status: result.success ? 201 : 400 
    });

  } catch (err) {
    console.error("Registration Route Error:", err);
    return NextResponse.json(
      { 
        success: false, 
        message: "Internal Server Error", 
        data: null 
      },
      { status: 500 }
    );
  }
}