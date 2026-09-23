import { writeFile, mkdir } from "node:fs/promises";
import { episode } from "../data/episode.mjs";
import { toDocuments } from "../lib/content.mjs";
const target = new URL("../sanity/seed/", import.meta.url);
await mkdir(target, { recursive: true });
const docs = toDocuments(episode);
await writeFile(
  new URL("before-daybreak.ndjson", target),
  docs.map((d) => JSON.stringify(d)).join("\n") + "\n",
);
console.log(
  `Exported ${docs.length} fictional content documents. No remote writes performed.`,
);
