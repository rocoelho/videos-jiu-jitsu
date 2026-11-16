import Link from "next/link";
import { notFound } from "next/navigation";
import { videos, videoUrl } from "@/lib/videos";

export default async function VideoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const i = videos.findIndex((v) => v.id === id);
  if (i < 0) notFound();
  const v = videos[i], prev = videos[i - 1], next = videos[i + 1];
  return (
    <main className="wrap">
      <Link href="/" className="voltar">Todas as aulas</Link>
      <h1><span className="num">#{v.num}</span>{v.title}</h1>
      <p className="cat">{v.category}</p>
      <video key={v.id} src={videoUrl(v)} controls playsInline preload="metadata" />
      <nav className="nav">
        {prev ? <Link href={`/video/${prev.id}`}>Anterior: #{prev.num}</Link> : <span />}
        {next && <Link href={`/video/${next.id}`}>Proxima: #{next.num}</Link>}
      </nav>
    </main>
  );
}
