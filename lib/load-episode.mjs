import { episode as sample } from "../data/episode.mjs";
import { fromDocuments } from "./content.mjs";
export const projectId = "o1wtlllc";
export const contentQuery =
  '*[_id == "bd-episode" || _type in ["bdCharacter","bdFact","bdScene","bdChoice","bdEnding"]]';
export async function loadEpisode() {
  try {
    const url = `https://${projectId}.api.sanity.io/v2026-09-23/data/query/production?perspective=published&query=${encodeURIComponent(contentQuery)}`;
    const res = await fetch(url, {
      cache: "no-store",
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) throw Error("Content service unavailable.");
    const { result } = await res.json();
    const episode = fromDocuments(result);
    return {
      episode,
      source: "sanity",
      message: "Story loaded from Sanity Content Lake.",
    };
  } catch (error) {
    return {
      episode: sample,
      source: "sample",
      diagnostic: error.message,
      message:
        "Playing the bundled sample. Published Sanity content is not available or did not pass validation.",
    };
  }
}
