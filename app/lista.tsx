"use client";
import Link from "next/link";
import { useMemo, useState } from "react";
import type { Video } from "@/lib/videos";

const norm = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

export default function Lista({ videos }: { videos: Video[] }) {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("Todas");
  const cats = ["Todas", ...Array.from(new Set(videos.map((v) => v.category)))];
  const lista = useMemo(() => videos.filter((v) =>
    (cat === "Todas" || v.category === cat) && norm(`${v.num} ${v.title}`).includes(norm(q))
  ), [videos, q, cat]);

  return (
    <>
      <input className="busca" placeholder="Buscar por numero ou nome (ex.: 095, triangulo)"
        value={q} onChange={(e) => setQ(e.target.value)} />
      <div className="cats">
        {cats.map((c) => (
          <button key={c} className={c === cat ? "on" : ""} onClick={() => setCat(c)}>{c}</button>
        ))}
      </div>
      <p className="total">{lista.length} aulas</p>
      <ul className="lista">
        {lista.map((v) => (
          <li key={v.id}>
            <Link href={`/video/${v.id}`}><span className="num">#{v.num}</span>{v.title}</Link>
          </li>
        ))}
      </ul>
    </>
  );
}
