import { grupos, totalAulas } from "@/lib/videos";
import Lista from "./lista";

export default function Home() {
  return <Lista grupos={grupos} total={totalAulas} />;
}
