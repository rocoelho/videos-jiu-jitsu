// Estrutura oficial do manual "Exame da Faixa Preta" (10a edicao, p. 59-64).
// A numeracao 1..247 do manual corresponde 1:1 ao id/num dos videos.

export type Section = {
  /** Titulo exatamente como aparece no manual. */
  title: string;
  /** Rotulo curto, usado na navegacao rapida em telas pequenas. */
  short: string;
  /** Primeiro numero do manual nesta secao. */
  from: number;
  /** Ultimo numero do manual nesta secao. */
  to: number;
  /** Prefixos redundantes removidos do titulo do video ao exibir dentro da secao. */
  strip?: string[];
};

/** As aulas de movimentacao abrem o manual e nao recebem numero. */
export const MOVIMENTOS = {
  title: "Movimentacao",
  short: "Movimentacao",
  ids: ["mov1", "mov2", "mov3", "mov4", "mov5"],
};

export const SECTIONS: Section[] = [
  { title: "Passagem de guarda", short: "Passagem", from: 1, to: 15, strip: ["passagem de guarda", "abertura de guarda"] },
  { title: "Passagem de 1/2 guarda", short: "Passagem 1/2", from: 16, to: 19, strip: ["passagem de 12 guarda", "passagem da 12 guarda"] },
  { title: "Defesa da posicao 50/50", short: "Defesa 50/50", from: 20, to: 20, strip: ["defesa da 5050"] },
  { title: "Finalizacoes da 50/50", short: "Final. 50/50", from: 21, to: 23, strip: ["finalizacao da 5050", "finalizacoes da 5050"] },
  { title: "Passagem e 1/2 guarda invertida", short: "1/2 invertida", from: 24, to: 24, strip: ["passagem de 12 guarda invertida"] },
  { title: "Passagem de guarda aberta", short: "Guarda aberta", from: 25, to: 26, strip: ["passagem de guarda aberta", "passagem de guarda"] },
  { title: "Finalizacoes da guarda", short: "Final. guarda", from: 27, to: 42, strip: ["finalizacao da guarda", "finalizacoes da guarda"] },
  { title: "Finalizacoes passando a guarda", short: "Final. passando", from: 43, to: 45, strip: ["finalizacao passando a guarda", "finalizacoes passando a guarda"] },
  { title: "Defesa de finalizacoes da guarda", short: "Def. final. guarda", from: 46, to: 61, strip: ["defesa de finalizacao da guarda", "defesa de finalizacoes da guarda"] },
  { title: "Defesa de finalizacoes passando a guarda", short: "Def. passando", from: 62, to: 63, strip: ["defesa de finalizacao passando a guarda", "defesa de finalizacoes passando a guarda"] },
  { title: "Finalizacoes da 1/2 guarda por cima", short: "1/2 por cima", from: 64, to: 66, strip: ["finalizacao da 12 guarda por cima", "finalizacoes da 12 guarda por cima"] },
  { title: "Defesa do katagatame", short: "Def. katagatame", from: 67, to: 68, strip: ["defesa do katagatame"] },
  { title: "Finalizacoes da 1/2 guarda por baixo", short: "1/2 por baixo", from: 69, to: 70, strip: ["finalizacao da 12 guarda por baixo", "finalizacoes da 12 guarda por baixo"] },
  { title: "Finalizacoes da montada", short: "Final. montada", from: 71, to: 76, strip: ["finalizacao da montada", "finalizacoes da montada"] },
  { title: "Finalizacao pelas costas com os ganchos", short: "Pelas costas", from: 77, to: 79, strip: ["finalizacao pelas costas com os ganchos", "finalizacoes pelas costas com os ganchos"] },
  { title: "Defesa de finalizacoes da montada", short: "Def. montada", from: 80, to: 81, strip: ["defesa de finalizacao da montada", "defesa de finalizacoes da montada"] },
  { title: "Defesa do estrangulamento pelas costas com os ganchos", short: "Def. costas", from: 82, to: 84, strip: ["defesa dos estrangulamento pelas costas com os ganchos", "defesa do estrangulamento pelas costas com os ganchos", "defesa das costas com os ganchos defesa do estrangulamento", "defesa das costas com os ganchos"] },
  { title: "Finalizacoes do cem quilos", short: "Cem quilos", from: 85, to: 89, strip: ["finalizacao cem quilos", "finalizacoes do cem quilos", "finalizacao do cem quilos"] },
  { title: "Defesa de finalizacoes do cem quilos", short: "Def. cem quilos", from: 90, to: 92, strip: ["defesa de finalizacoes do cem quilos", "defesa de finalizacao do cem quilos", "defesa das finalizacoes do cem quilos"] },
  { title: "Finalizacoes do joelho na barriga", short: "Joelho na barriga", from: 93, to: 95, strip: ["finalizacoes do joelho na barriga", "finalizacao do joelho na barriga"] },
  { title: "Defesa de finalizacoes do joelho na barriga", short: "Def. joelho", from: 96, to: 97, strip: ["defesa de finalizacoes do joelho na barriga", "defesa de finalizacao do joelho na barriga"] },
  { title: "Finalizacoes da 1/2 invertida", short: "1/2 invertida", from: 98, to: 99, strip: ["finalizacao da 12 guarda invertida", "finalizacoes da 12 invertida", "finalizacao da 12 invertida"] },
  { title: "Posicao de quatro por cima de frente", short: "Quatro cima/frente", from: 100, to: 105, strip: ["posicao de quatro por cima de frente"] },
  { title: "Posicao de quatro por baixo de frente", short: "Quatro baixo/frente", from: 106, to: 111, strip: ["posicao de quatro por baixo de frente"] },
  { title: "Posicao de quatro por baixo de costas", short: "Quatro baixo/costas", from: 112, to: 114, strip: ["posicao de quatro por baixo e de costas", "posicao de quatro por baixo de costas"] },
  { title: "Posicao de quatro por cima de costas", short: "Quatro cima/costas", from: 115, to: 116, strip: ["posicao de quatro por cima de costas"] },
  { title: "Defesa do cem quilos", short: "Def. cem quilos", from: 117, to: 121, strip: ["defesa do cem quilos", "defesa cem quilos", "posicao da"] },
  { title: "Defesa do leque", short: "Def. leque", from: 122, to: 122, strip: ["defesa do leque"] },
  { title: "Raspagem da guarda", short: "Raspagem guarda", from: 123, to: 159, strip: ["raspagem da guarda", "raspagem de guarda"] },
  { title: "Posicao da guarda para as costas", short: "Guarda p/ costas", from: 160, to: 163, strip: ["posicao da guarda para as costas", "posicao de guarda para as costas"] },
  { title: "Defesa do berimbolo", short: "Def. berimbolo", from: 164, to: 164, strip: ["defesa do berimbolo"] },
  { title: "Combinacoes de golpes da guarda", short: "Combinacoes", from: 165, to: 167, strip: ["combinacoes de golpes guarda", "combinacoes de golpes da guarda"] },
  { title: "Raspagem de 1/2 guarda", short: "Raspagem 1/2", from: 168, to: 179, strip: ["raspagem da 12 guarda", "raspagem de 12 guarda", "raspagem da meia guarda", "raspagem de meia guarda"] },
  { title: "Raspagem de 1/2 guarda invertida", short: "Raspagem 1/2 inv.", from: 180, to: 180, strip: ["raspagem de 12 guarda invertida"] },
  { title: "Raspagem de 1/2 guarda contra a passagem de 1/2 guarda em pe com a mao na gola", short: "Raspagem c/ passagem", from: 181, to: 186, strip: ["raspagem de 12 contra passagem", "raspagem de 12 guarda contra a passagem"] },
  { title: "Dominando a manga cruzada 1/2 guarda aberta em pe", short: "Manga cruzada", from: 187, to: 190, strip: ["dominando a manga cruzada 12"] },
  { title: "Finalizacoes da 1/2 guarda invertida", short: "Final. 1/2 inv.", from: 191, to: 192, strip: ["finalizacoes da 12 guarda invertida", "finalizacao da 12 guarda invertida"] },
  { title: "Finalizacoes da montada", short: "Final. montada", from: 193, to: 197, strip: ["finalizacoes da montada", "finalizacao da montada"] },
  { title: "Finalizacao em pe", short: "Final. em pe", from: 198, to: 198, strip: ["finalizacao em pe"] },
  { title: "Defesa de finalizacao em pe", short: "Def. em pe", from: 199, to: 199, strip: ["defesa de finalizacao em pe"] },
  { title: "Quedas", short: "Quedas", from: 200, to: 210, strip: ["quedas"] },
  { title: "Defesa de quedas", short: "Def. quedas", from: 211, to: 213, strip: ["defesa de quedas"] },
  { title: "Defesa pessoal", short: "Defesa pessoal", from: 214, to: 247, strip: ["defesa pessoal"] },
];

/**
 * Numeros que constam no manual mas ainda nao tem video correspondente.
 * Aparecem na lista como pendentes para o checklist do exame ficar completo.
 */
export const SEM_VIDEO: Record<number, string> = {
  71: "Chave de braco",
  222: "Empurrando o tronco e subindo",
  223: "Passando a perna por cima da cabeca finalizando na chave de braco arm-lock com o punho preso nas axilas",
  224: "Com o braco preso",
  225: "Abracando e aplicando o upa por cima da cabeca",
};

export function sectionOf(num: number): Section | undefined {
  return SECTIONS.find((s) => num >= s.from && num <= s.to);
}
