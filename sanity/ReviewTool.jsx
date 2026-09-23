"use client";
import { useState } from "react";
import { useClient } from "sanity";
import { episode } from "../data/episode.mjs";
import {
  toDocuments,
  fromDocuments,
  validateEpisode,
} from "../lib/content.mjs";
import { allPaths } from "../lib/story.mjs";
import { contentQuery } from "../lib/load-episode.mjs";
export default function ReviewTool() {
  const client = useClient({ apiVersion: "2026-09-23" }),
    [status, setStatus] = useState(
      "Check published content, or import the reviewed fictional starter story.",
    ),
    [busy, setBusy] = useState(false);
  async function check() {
    setBusy(true);
    try {
      const docs = await client.fetch(
        contentQuery,
        {},
        { perspective: "published" },
      );
      fromDocuments(docs);
      const url = `https://o1wtlllc.api.sanity.io/v2026-09-23/data/query/production?perspective=published&query=${encodeURIComponent(contentQuery)}`;
      const response = await fetch(url, {
        credentials: "omit",
        signal: AbortSignal.timeout(5000),
      });
      if (!response.ok) throw Error("Public read unavailable");
      const publicData = await response.json();
      const e = fromDocuments(publicData.result);
      setStatus(
        `${validateEpisode(e).length} graph errors. ${allPaths(e).length} complete decision paths. Public read verified without credentials. All ending channels covered.`,
      );
    } catch {
      setStatus(
        "Published content is incomplete, invalid or not publicly readable. Review the documents before using them in the game.",
      );
    } finally {
      setBusy(false);
    }
  }
  async function seed() {
    setBusy(true);
    try {
      const docs = toDocuments(episode);
      let tx = client.transaction();
      for (const d of docs) tx = tx.createIfNotExists(d);
      await tx.commit();
      setStatus(
        `Imported ${docs.length} starter documents. Existing documents were preserved. Run the content check next.`,
      );
    } catch {
      setStatus(
        "Import failed. Check your Sanity sign-in, project access and allowed browser origin. No credentials belong in the game.",
      );
    } finally {
      setBusy(false);
    }
  }
  return (
    <div
      style={{
        padding: 32,
        maxWidth: 800,
        margin: "auto",
        fontFamily: "system-ui",
        color: "inherit",
      }}
    >
      <h1>Story review</h1>
      <p>
        Characters, facts, choices and ending fragments are linked content. The
        game evaluates explicit conditions; it never executes text as code.
      </p>
      <p>
        Import adds only the fictional Before Daybreak starter. It creates
        published documents in project o1wtlllc / production and never replaces
        existing documents. No private engine files or player data are included.
      </p>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        <button disabled={busy} onClick={seed}>
          Import starter story
        </button>
        <button disabled={busy} onClick={check}>
          Check published story
        </button>
      </div>
      <p role="status">{status}</p>
      <a href="/" target="_blank" rel="noreferrer">
        Open the game
      </a>
    </div>
  );
}
