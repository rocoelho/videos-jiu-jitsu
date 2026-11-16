"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { lerPosicoes, marcarVisto, salvarPosicao, salvarUltimo, lerVistos } from "@/lib/progresso";

const VELOCIDADES = [0.5, 0.75, 1, 1.25, 1.5, 2];

type Vizinho = { id: string; num: string; title: string } | null;

export default function Player({
  id,
  src,
  titulo,
  anterior,
  proximo,
}: {
  id: string;
  src: string;
  titulo: string;
  anterior: Vizinho;
  proximo: Vizinho;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const router = useRouter();
  const [erro, setErro] = useState(false);
  const [vel, setVel] = useState(1);
  const [visto, setVisto] = useState(false);
  const [auto, setAuto] = useState(false);
  const ultimoSalvo = useRef(0);

  // Estado guardado no aparelho.
  useEffect(() => {
    setVisto(!!lerVistos()[id]);
    setAuto(localStorage.getItem("fp:auto") === "1");
    salvarUltimo(id);
  }, [id]);

  const irPara = useCallback(
    (v: Vizinho) => {
      if (v) router.push(`/video/${v.id}`);
    },
    [router],
  );

  function aoCarregar() {
    const el = ref.current;
    if (!el) return;
    el.playbackRate = vel;
    const pos = lerPosicoes()[id];
    // Nao retoma se faltavam menos de 15s para acabar.
    if (pos && pos < el.duration - 15) el.currentTime = pos;
  }

  function aoAndar() {
    const el = ref.current;
    if (!el || !el.duration) return;
    if (Math.abs(el.currentTime - ultimoSalvo.current) > 4) {
      ultimoSalvo.current = el.currentTime;
      salvarPosicao(id, el.currentTime);
    }
    if (!visto && el.currentTime / el.duration > 0.9) {
      setVisto(true);
      marcarVisto(id, true);
    }
  }

  function aoTerminar() {
    setVisto(true);
    marcarVisto(id, true);
    salvarPosicao(id, 0);
    if (auto && proximo) irPara(proximo);
  }

  function pula(seg: number) {
    const el = ref.current;
    if (el) el.currentTime = Math.max(0, Math.min(el.duration || 0, el.currentTime + seg));
  }

  function trocaVel() {
    const prox = VELOCIDADES[(VELOCIDADES.indexOf(vel) + 1) % VELOCIDADES.length];
    setVel(prox);
    if (ref.current) ref.current.playbackRate = prox;
  }

  function alternaVisto() {
    const novo = !visto;
    setVisto(novo);
    marcarVisto(id, novo);
  }

  function alternaAuto() {
    const novo = !auto;
    setAuto(novo);
    localStorage.setItem("fp:auto", novo ? "1" : "0");
  }

  // Atalhos de teclado (desktop).
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const alvo = e.target as HTMLElement;
      if (alvo?.tagName === "INPUT" || alvo?.tagName === "TEXTAREA") return;
      const el = ref.current;
      switch (e.key.toLowerCase()) {
        case " ":
          e.preventDefault();
          if (el) (el.paused ? el.play() : el.pause());
          break;
        case "arrowleft": e.preventDefault(); pula(-5); break;
        case "arrowright": e.preventDefault(); pula(5); break;
        case "j": pula(-10); break;
        case "l": pula(10); break;
        case "n": irPara(proximo); break;
        case "p": irPara(anterior); break;
        case "f": el?.requestFullscreen?.(); break;
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [proximo, anterior, irPara]);

  return (
    <>
      <div className="palco">
        <div className="palco-inner">
          {erro ? (
            <div className="indisponivel">
              <b>Video ainda nao disponivel</b>
              <span>O arquivo desta aula ainda nao terminou de subir para o servidor. Tente de novo mais tarde.</span>
            </div>
          ) : (
            <video
              ref={ref}
              key={id}
              src={src}
              controls
              playsInline
              preload="metadata"
              onLoadedMetadata={aoCarregar}
              onTimeUpdate={aoAndar}
              onEnded={aoTerminar}
              onError={() => setErro(true)}
            />
          )}
        </div>
      </div>

      <main className="wrap">
        <h2 className="aula-titulo">{titulo}</h2>

        {!erro && (
          <div className="controles">
            <button onClick={() => pula(-10)} aria-label="Voltar 10 segundos">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M11 7H6.5a4.5 4.5 0 100 9H12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <path d="M9 4l-3 3 3 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              10s
            </button>
            <button onClick={() => pula(10)} aria-label="Avancar 10 segundos">
              10s
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M13 7h4.5a4.5 4.5 0 110 9H12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <path d="M15 4l3 3-3 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button onClick={trocaVel} className={vel !== 1 ? "ativo vel" : "vel"} aria-label="Velocidade">
              {vel}&times;
            </button>
          </div>
        )}

        <div className="controles">
          <button onClick={alternaVisto} className={visto ? "ativo" : ""}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {visto ? "Assistida" : "Marcar"}
          </button>
          <button onClick={alternaAuto} className={auto ? "ativo" : ""}>
            {auto ? "Auto ligado" : "Auto desligado"}
          </button>
        </div>

        <div className="navs">
          {proximo && (
            <Link href={`/video/${proximo.id}`} className="nav-card prox">
              <div className="txt">
                <div className="rot">Proxima aula</div>
                <div className="nome">
                  {proximo.num} &middot; {proximo.title}
                </div>
              </div>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          )}
          {anterior && (
            <Link href={`/video/${anterior.id}`} className="nav-card">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <div className="txt">
                <div className="rot">Anterior</div>
                <div className="nome">
                  {anterior.num} &middot; {anterior.title}
                </div>
              </div>
            </Link>
          )}
        </div>

        <Link href="/" className="btn-lista">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          Todas as aulas
        </Link>

      </main>
    </>
  );
}
