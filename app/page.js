import Story from "./story";
import { loadEpisode } from "../lib/load-episode.mjs";
export const dynamic = "force-dynamic";
export default async function Page() {
  const content = await loadEpisode();
  return <Story {...content} />;
}
