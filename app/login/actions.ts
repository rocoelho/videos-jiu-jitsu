"use server";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { timingSafeEqual } from "node:crypto";
import { COOKIE, tokenFor } from "@/lib/auth";

export type Estado = { error: string; espera?: number } | null;

/**
 * Um PIN de 6 digitos tem so 1 milhao de combinacoes, entao limitamos tentativas
 * por IP. E memoria do processo: na Vercel cada instancia tem a sua e ela some
 * em um cold start, o que freia um ataque casual mas nao um distribuido.
 */
const MAX_LIVRE = 5;
const JANELA = 15 * 60 * 1000;
const tentativas = new Map<string, { n: number; ate: number }>();

function limite(ip: string) {
  const agora = Date.now();
  const reg = tentativas.get(ip);
  if (reg && reg.ate < agora) tentativas.delete(ip);

  const atual = tentativas.get(ip);
  if (!atual) return { bloqueado: false as const, espera: 0 };

  if (atual.n >= MAX_LIVRE) {
    // 30s, 60s, 120s... a partir da 6a tentativa, teto de 15 min.
    const castigo = Math.min(30_000 * 2 ** (atual.n - MAX_LIVRE), JANELA);
    const liberaEm = atual.ate - JANELA + castigo;
    if (agora < liberaEm) {
      return { bloqueado: true as const, espera: Math.ceil((liberaEm - agora) / 1000) };
    }
  }
  return { bloqueado: false as const, espera: 0 };
}

function registraFalha(ip: string) {
  const reg = tentativas.get(ip);
  tentativas.set(ip, { n: (reg?.n ?? 0) + 1, ate: Date.now() + JANELA });
  if (tentativas.size > 5000) {
    const agora = Date.now();
    for (const [k, v] of tentativas) if (v.ate < agora) tentativas.delete(k);
  }
}

function iguais(a: string, b: string) {
  const ba = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ba.length !== bb.length) return false;
  return timingSafeEqual(ba, bb);
}

export async function login(_: Estado, form: FormData): Promise<Estado> {
  const h = await headers();
  const ip = (h.get("x-forwarded-for") ?? "").split(",")[0].trim() || "local";

  const { bloqueado, espera } = limite(ip);
  if (bloqueado) {
    return { error: `Muitas tentativas. Tente de novo em ${espera}s.`, espera };
  }

  const pin = String(form.get("password") ?? "");
  const esperado = process.env.SITE_PASSWORD ?? "";

  // Atrasa toda tentativa invalida para encarecer a forca bruta.
  if (!/^\d{6}$/.test(pin) || !esperado || !iguais(pin, esperado)) {
    registraFalha(ip);
    await new Promise((r) => setTimeout(r, 400));
    return { error: "Senha incorreta" };
  }

  tentativas.delete(ip);
  (await cookies()).set(COOKIE, await tokenFor(esperado), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });
  redirect("/");
}
