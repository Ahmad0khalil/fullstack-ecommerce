import { cookies } from "next/headers";

export async function getCurrentUser() {
  const cookieStore = await cookies();

  const cookieString = cookieStore
    .getAll()
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join("; ");

  const res = await fetch(`${process.env.API_URL}/auth/me`, {
    headers: {
      Cookie: cookieString,
    },
    cache: "no-store",
  });

  if (!res.ok) return null;

  return res.json();
}