import Link from "next/link";
import { notFound } from "next/navigation";
import { contexto, getVideo, shortTitle, totalAulas, videoUrl } from "@/lib/videos";
import { sectionOf } from "@/lib/sections";
import Player from "./player";

export default async function VideoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const v = getVideo(id);
  if (!v) notFound();

  const { grupo, aula, posicao, anterior, proximo } = contexto(id);

  const curto = (x: { id: string; num: string; title: string }) => {
    const n = Number(x.id);
    return { id: x.id, num: x.num, title: shortTitle(x.title, Number.isFinite(n) ? sectionOf(n) : undefined) };
  };

  return (
    <>
      <div className="player-topo">
        <div className="player-topo-inner">
          <Link href="/" className="btn-icone" aria-label="Voltar para a lista">
            <svg width="21" height="21" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
          <div className="player-titulo">
            <div className="ctx">{grupo?.title ?? v.category}</div>
            <div className="pos">
              {v.num} &middot; {posicao} de {totalAulas}
            </div>
          </div>
          <Link
            href={anterior ? `/video/${anterior.id}` : "#"}
            className="btn-icone"
            aria-label="Aula anterior"
            aria-disabled={!anterior}
            style={anterior ? undefined : { opacity: 0.3, pointerEvents: "none" }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M18 5v14l-9-7z" fill="currentColor" />
              <path d="M7 5v14" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
            </svg>
          </Link>
          <Link
            href={proximo ? `/video/${proximo.id}` : "#"}
            className="btn-icone"
            aria-label="Proxima aula"
            aria-disabled={!proximo}
            style={proximo ? undefined : { opacity: 0.3, pointerEvents: "none" }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M6 5v14l9-7z" fill="currentColor" />
              <path d="M17 5v14" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
            </svg>
          </Link>
        </div>
      </div>

      <Player
        id={v.id}
        src={videoUrl(v)}
        titulo={aula?.title ?? v.title}
        anterior={anterior ? curto(anterior) : null}
        proximo={proximo ? curto(proximo) : null}
      />
    </>
  );
}
