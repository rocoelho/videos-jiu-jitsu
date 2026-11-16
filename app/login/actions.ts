"use server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { COOKIE, tokenFor } from "@/lib/auth";

export async function login(_: unknown, form: FormData) {
  if (form.get("password") !== process.env.SITE_PASSWORD) return { error: "Senha incorreta" };
  (await cookies()).set(COOKIE, await tokenFor(process.env.SITE_PASSWORD!), {
    httpOnly: true, secure: true, sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 365,
  });
  redirect("/");
}
