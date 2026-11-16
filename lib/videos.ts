import data from "@/data/videos.json";
import { MOVIMENTOS, SECTIONS, SEM_VIDEO, type Section } from "@/lib/sections";

export type Video = { id: string; num: string; title: string; category: string; file: string };

export const videos = data as Video[];

export function videoUrl(v: Video) {
  const base = process.env.VIDEO_BASE_URL ?? "";
  return `${base}/${encodeURIComponent(v.file)}`;
}

/** Remove acentos e pontuacao para busca e comparacao de prefixos. */
export const norm = (s: string) =>
  s.normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9 ]/gi, "").replace(/\s+/g, " ").trim().toLowerCase();

/**
 * O titulo no JSON repete o nome da secao ("Finalizacao da guarda chave de braco").
 * Dentro da secao esse prefixo e ruido, entao exibimos so a parte util.
 */
export function shortTitle(title: string, section?: Section) {
  if (!section?.strip) return title;
  let out = title.trim();
  // Alguns titulos repetem o prefixo ("Passagem de guarda passagem de guarda laco...").
  for (let passo = 0; passo < 3; passo++) {
    const n = norm(out);
    const hit = section.strip.find((p) => n.startsWith(norm(p) + " "));
    if (!hit) break;
    const rest = out.split(/\s+/).slice(norm(hit).split(" ").length).join(" ");
    if (rest.length < 4) break;
    out = rest;
  }
  return out === title.trim() ? title : out.charAt(0).toUpperCase() + out.slice(1);
}

export type Aula = {
  /** id da rota; undefined quando o manual lista a tecnica mas o video nao existe. */
  id?: string;
  num: string;
  /** Numero do manual, usado para ordenar. */
  n: number;
  title: string;
  /** Titulo completo, para busca. */
  full: string;
  missing?: boolean;
};

export type Grupo = { title: string; short: string; aulas: Aula[] };

const byId = new Map(videos.map((v) => [v.id, v]));

/** Lista completa agrupada na ordem do manual. */
export const grupos: Grupo[] = [
  {
    title: MOVIMENTOS.title,
    short: MOVIMENTOS.short,
    aulas: MOVIMENTOS.ids.flatMap((id, i) => {
      const v = byId.get(id);
      return v ? [{ id: v.id, num: v.num, n: -100 + i, title: v.title, full: v.title }] : [];
    }),
  },
  ...SECTIONS.map((s) => {
    const aulas: Aula[] = [];
    for (let n = s.from; n <= s.to; n++) {
      const id = String(n).padStart(3, "0");
      const v = byId.get(id);
      if (v) {
        aulas.push({ id: v.id, num: v.num, n, title: shortTitle(v.title, s), full: v.title });
      } else if (SEM_VIDEO[n]) {
        aulas.push({ num: id, n, title: SEM_VIDEO[n], full: SEM_VIDEO[n], missing: true });
      }
    }
    return { title: s.title, short: s.short, aulas };
  }),
].filter((g) => g.aulas.length > 0);

/** Ordem de reproducao: mesma do manual, pulando o que nao tem video. */
export const ordem: string[] = grupos.flatMap((g) => g.aulas.filter((a) => a.id).map((a) => a.id!));

export const totalAulas = ordem.length;

export function contexto(id: string) {
  const grupo = grupos.find((g) => g.aulas.some((a) => a.id === id));
  const aula = grupo?.aulas.find((a) => a.id === id);
  const i = ordem.indexOf(id);
  return {
    grupo,
    aula,
    posicao: i + 1,
    anterior: i > 0 ? byId.get(ordem[i - 1]) : undefined,
    proximo: i >= 0 && i < ordem.length - 1 ? byId.get(ordem[i + 1]) : undefined,
  };
}

export function getVideo(id: string) {
  return byId.get(id);
}
