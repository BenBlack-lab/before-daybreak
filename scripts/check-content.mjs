import { loadEpisode } from "../lib/load-episode.mjs";
import { allPaths } from "../lib/story.mjs";
const content = await loadEpisode();
console.log(
  JSON.stringify(
    {
      source: content.source,
      message: content.message,
      diagnostic: content.diagnostic,
      episode: content.episode.id,
      paths: allPaths(content.episode).length,
    },
    null,
    2,
  ),
);
if (content.source !== "sanity") process.exitCode = 1;
