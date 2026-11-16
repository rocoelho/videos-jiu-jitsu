"use client";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { Aula, Grupo } from "@/lib/videos";
import { lerUltimo, lerVistos } from "@/lib/progresso";

const norm = (s: string) =>
  s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

function Seta() {
  return (
    <svg className="secao-seta" width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Check() {
  return (
    <svg className="check" width="15" height="15" viewBox="0 0 24 24" fill="none" aria-label="assistida">
      <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Anel({ feitas, total }: { feitas: number; total: number }) {
  const r = 11;
  const c = 2 * Math.PI * r;
  const pct = total ? feitas / total : 0;
  return (
    <svg className="pct" viewBox="0 0 30 30" aria-hidden>
      <circle cx="15" cy="15" r={r} fill="none" stroke="var(--bg-3)" strokeWidth="3" />
      {pct > 0 && (
        <circle
          cx="15" cy="15" r={r} fill="none"
          stroke={pct === 1 ? "var(--ok)" : "var(--red)"}
          strokeWidth="3" strokeLinecap="round"
          strokeDasharray={`${c * pct} ${c}`}
          transform="rotate(-90 15 15)"
        />
      )}
    </svg>
  );
}

function LinhaAula({ a, visto, secao }: { a: Aula; visto: boolean; secao?: string }) {
  if (a.missing) {
    return (
      <li className="aula">
        <div className="aula-off">
          <span className="num">{a.num}</span>
          <span className="aula-nome">
            {a.title}
            <span className="tag-off">sem video</span>
          </span>
        </div>
      </li>
    );
  }
  return (
    <li className="aula">
      <Link href={`/video/${a.id}`}>
        <span className={`num${visto ? " visto" : ""}`}>{a.num}</span>
        <span className="aula-nome">
          {a.title}
          {secao && <span className="res-secao">{secao}</span>}
        </span>
        {visto && <Check />}
      </Link>
    </li>
  );
}

export default function Lista({ grupos, total }: { grupos: Grupo[]; total: number }) {
  const [q, setQ] = useState("");
  const [abertas, setAbertas] = useState<Record<string, boolean>>({});
  const [vistos, setVistos] = useState<Record<string, true>>({});
  const [ultimo, setUltimo] = useState<string | null>(null);

  // localStorage so existe no cliente: lemos depois da hidratacao.
  useEffect(() => {
    setVistos(lerVistos());
    setUltimo(lerUltimo());
  }, []);

  const busca = norm(q.trim());

  const resultados = useMemo(() => {
    if (!busca) return null;
    const out: { a: Aula; secao: string }[] = [];
    for (const g of grupos) {
      for (const a of g.aulas) {
        if (norm(`${a.num} ${a.full} ${g.title}`).includes(busca)) out.push({ a, secao: g.title });
      }
    }
    return out;
  }, [busca, grupos]);

  const feitasTotal = Object.keys(vistos).length;

  const aulaUltima = useMemo(() => {
    if (!ultimo) return null;
    for (const g of grupos) {
      const a = g.aulas.find((x) => x.id === ultimo);
      if (a) return { a, secao: g.title };
    }
    return null;
  }, [ultimo, grupos]);

  return (
    <>
      <div className="topo">
        <div className="topo-inner">
          <h1>Estudo Faixa Preta</h1>
          <p className="sub">
            {total} aulas na ordem do manual
            {feitasTotal > 0 && ` · ${feitasTotal} assistidas`}
          </p>
          {feitasTotal > 0 && (
            <div className="barra">
              <i style={{ width: `${(feitasTotal / total) * 100}%` }} />
            </div>
          )}
          <div className="busca-box">
            <svg className="busca-icon" width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden>
              <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
              <path d="M20 20l-3.5-3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <input
              className="busca"
              type="search"
              inputMode="search"
              placeholder="Buscar numero ou tecnica"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              aria-label="Buscar aula"
            />
            {q && (
              <button type="button" className="busca-limpa" onClick={() => setQ("")} aria-label="Limpar busca">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>

      <main className="wrap">
        {!busca && aulaUltima?.a.id && (
          <Link href={`/video/${aulaUltima.a.id}`} className="continuar">
            <div className="continuar-txt">
              <div className="continuar-rot">Continuar</div>
              <div className="continuar-nome">
                {aulaUltima.a.num} &middot; {aulaUltima.a.title}
              </div>
            </div>
            <span className="continuar-play" aria-hidden>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z" />
              </svg>
            </span>
          </Link>
        )}

        {resultados ? (
          resultados.length ? (
            <ul className="aulas" style={{ marginTop: 14 }}>
              {resultados.map(({ a, secao }) => (
                <LinhaAula key={a.id ?? a.num} a={a} visto={!!(a.id && vistos[a.id])} secao={secao} />
              ))}
            </ul>
          ) : (
            <p className="vazio">Nenhuma aula encontrada para &ldquo;{q}&rdquo;.</p>
          )
        ) : (
          <div className="secoes">
            {grupos.map((g) => {
              const comVideo = g.aulas.filter((a) => a.id);
              const feitas = comVideo.filter((a) => vistos[a.id!]).length;
              const aberta = !!abertas[g.title];
              return (
                <section className="secao" key={g.title}>
                  <button
                    className="secao-btn"
                    aria-expanded={aberta}
                    onClick={() => setAbertas((s) => ({ ...s, [g.title]: !aberta }))}
                  >
                    <Seta />
                    <span className="secao-nome">{g.title}</span>
                    <span className="secao-meta">
                      <span>
                        {feitas}/{comVideo.length}
                      </span>
                      <Anel feitas={feitas} total={comVideo.length} />
                    </span>
                  </button>
                  {aberta && (
                    <ul className="aulas">
                      {g.aulas.map((a) => (
                        <LinhaAula key={a.id ?? a.num} a={a} visto={!!(a.id && vistos[a.id])} />
                      ))}
                    </ul>
                  )}
                </section>
              );
            })}
          </div>
        )}
      </main>
    </>
  );
}
