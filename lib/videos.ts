import data from "@/data/videos.json";

export type Video = { id: string; num: string; title: string; category: string; file: string };
export const videos = data as Video[];

export function videoUrl(v: Video) {
  const base = process.env.VIDEO_BASE_URL ?? "";
  return `${base}/${encodeURIComponent(v.file)}`;
}
