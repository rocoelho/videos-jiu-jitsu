"use client";

// Progresso fica so no aparelho: nao ha backend nem conta de usuario.
const K_VISTOS = "fp:vistos";
const K_POS = "fp:pos";
const K_ULTIMO = "fp:ultimo";

function ler<T>(chave: string, padrao: T): T {
  if (typeof window === "undefined") return padrao;
  try {
    const cru = localStorage.getItem(chave);
    return cru ? (JSON.parse(cru) as T) : padrao;
  } catch {
    return padrao;
  }
}

function gravar(chave: string, valor: unknown) {
  try {
    localStorage.setItem(chave, JSON.stringify(valor));
  } catch {
    /* modo privado ou disco cheio: seguimos sem progresso */
  }
}

export const lerVistos = () => ler<Record<string, true>>(K_VISTOS, {});

export function marcarVisto(id: string, visto: boolean) {
  const v = lerVistos();
  if (visto) v[id] = true;
  else delete v[id];
  gravar(K_VISTOS, v);
  return v;
}

export const lerPosicoes = () => ler<Record<string, number>>(K_POS, {});

export function salvarPosicao(id: string, segundos: number) {
  const p = lerPosicoes();
  if (segundos > 5) p[id] = segundos;
  else delete p[id];
  gravar(K_POS, p);
}

export const lerUltimo = () => ler<string | null>(K_ULTIMO, null);
export const salvarUltimo = (id: string) => gravar(K_ULTIMO, id);
