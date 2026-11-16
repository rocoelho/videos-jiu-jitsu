import { NextRequest, NextResponse } from "next/server";
import { COOKIE, tokenFor } from "@/lib/auth";

export async function middleware(req: NextRequest) {
  const expected = await tokenFor(process.env.SITE_PASSWORD ?? "");
  if (req.cookies.get(COOKIE)?.value === expected) return NextResponse.next();
  return NextResponse.redirect(new URL("/login", req.url));
}

export const config = { matcher: ["/((?!login|_next|favicon.ico).*)"] };
