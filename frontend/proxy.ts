import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function proxy(request: any) {
  const token = request.cookies.get("token")?.value;
  // 1. Not logged in → login
  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  console.log("Verifying JWT token:", token);
  
  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.JWT_SECRET)
    );
    console.log("JWT payload:", payload);
    // 2. Logged in but not admin → access denied
    if (payload.role !== "admin") {
      console.log("User is not an admin.");
      return NextResponse.redirect(new URL("/access-denied", request.url));
    }
    // 3. Admin → allow
    console.log("User is an admin.");
    return NextResponse.next();
    
  } catch (err) {
    console.error("------------ failed: ------------", err);
    // invalid token → login
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

export const config = {
  matcher: ['/dashboard/:path*'],
};