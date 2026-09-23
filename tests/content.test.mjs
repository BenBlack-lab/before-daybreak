import test from "node:test";
import assert from "node:assert/strict";
import { episode } from "../data/episode.mjs";
import {
  toDocuments,
  fromDocuments,
  validateEpisode,
} from "../lib/content.mjs";
import { allPaths, ending } from "../lib/story.mjs";
test("the referenced Sanity document graph preserves every playable ending", () => {
  const docs = toDocuments(episode);
  assert.ok(
    docs.every((d) => !d._id.includes(".")),
    "Public story IDs must remain at the root path.",
  );
  const content = fromDocuments(docs);
  assert.deepEqual(validateEpisode(content), []);
  const before = allPaths(episode),
    after = allPaths(content);
  assert.equal(after.length, before.length);
  after.forEach((s, i) =>
    assert.deepEqual(ending(s, content), ending(before[i], episode)),
  );
});
test("missing references, unrecognised effects and uncovered endings fail validation", () => {
  const docs = toDocuments(episode);
  assert.throws(
    () => fromDocuments(docs.filter((d) => d._id !== "bd-choice-private")),
    /reference/,
  );
  const bad = structuredClone(episode);
  bad.scenes[0].choices[0].effects.scene = 99;
  assert.ok(validateEpisode(bad).length);
  const missing = structuredClone(episode);
  missing.rules = missing.rules.filter((r) => r.channel !== "alex");
  assert.ok(validateEpisode(missing).some((e) => e.includes("alex")));
});
test("authoring changes propagate through content without editing game code", () => {
  const docs = toDocuments(episode);
  docs.find((d) => d._id === "bd-ending-six-leave").text =
    "Edited author ending.";
  const e = fromDocuments(docs);
  const state = allPaths(e).find(
    (s) => s.outcome === "withheld" && s.preparation === "passes",
  );
  assert.equal(ending(state, e).passage, "Edited author ending.");
});
