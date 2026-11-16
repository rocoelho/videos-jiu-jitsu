import { videos } from "@/lib/videos";
import Lista from "./lista";
export default function Home() {
  return (
    <main className="wrap">
      <h1>Estudo Faixa Preta</h1>
      <Lista videos={videos} />
    </main>
  );
}
