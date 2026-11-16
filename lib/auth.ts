export const COOKIE = "fp_auth";

// Token derivado da senha: trocar a senha invalida todos os acessos.
export async function tokenFor(password: string) {
  const data = new TextEncoder().encode("faixa-preta:" + password);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash)).map((b) => b.toString(16).padStart(2, "0")).join("");
}
