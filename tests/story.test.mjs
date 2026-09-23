import test from "node:test";
import assert from "node:assert/strict";
import { episode } from "../data/episode.mjs";
import {
  initialStory,
  advance,
  choicesFor,
  ending,
  restore,
  allPaths,
  fingerprint,
} from "../lib/story.mjs";
const play = (ids) =>
  ids.reduce((s, id) => advance(episode, s, id), initialStory(episode));
test("content changes use a different local save, while object key order does not", () => {
  const reordered = Object.fromEntries(Object.entries(episode).reverse());
  assert.equal(fingerprint(episode), fingerprint(reordered));
  const revised = structuredClone(episode);
  revised.rules[0].text = "A new ending";
  assert.notEqual(fingerprint(episode), fingerprint(revised));
});
test("all reachable decisions terminate, preserve immutable inputs, and stay within the scene contract", () => {
  let leaves = 0;
  function walk(state) {
    if (state.outcome) {
      leaves++;
      assert.equal(state.history.length, 3);
      assert.equal(choicesFor(episode, state).length, 0);
      assert.equal(advance(episode, state, "withhold"), state);
      return;
    }
    const choices = choicesFor(episode, state);
    assert.ok(choices.length);
    for (const choice of choices) {
      const before = JSON.stringify(state);
      const next = advance(episode, state, choice.id);
      assert.equal(JSON.stringify(state), before);
      assert.deepEqual(next, advance(episode, state, choice.id));
      assert.ok(next.history.length <= 3);
      walk(next);
    }
  }
  walk(initialStory(episode));
  assert.equal(leaves, 10);
});
test("secured passes and prepared redactions create materially different options and outcomes", () => {
  const passes = play(["private", "passes"]);
  const redacted = play(["open", "redact"]);
  assert.equal(advance(episode, passes, "publish_safe"), passes);
  const a = ending(advance(episode, passes, "withhold"));
  const b = ending(advance(episode, redacted, "publish_safe"));
  assert.equal(a.witnessesEscorted, true);
  assert.equal(b.witnessesEscorted, false);
  assert.equal(a.escorted, true);
  assert.equal(b.escorted, false);
  assert.ok(a.kept && b.kept);
});
test("promises can be broken without rewriting the earlier commitment or inventing a safe release", () => {
  for (const prep of ["passes", "redact"]) {
    const state = play(["private", prep, "publish_full"]);
    assert.equal(ending(state).kept, false);
    assert.equal(state.history[1].choice, prep);
    assert.match(ending(state).evidence, /identities/);
  }
  const withheld = play(["open", "redact", "withhold"]);
  assert.equal(ending(withheld).kept, true);
  assert.equal(ending(withheld).witnessesEscorted, false);
});
test("the opening conversation changes who bears a broken guarantee", () => {
  const privateEnding = ending(play(["private", "passes", "publish_full"]));
  const openEnding = ending(play(["open", "passes", "publish_full"]));
  assert.match(privateEnding.passage, /holds Alex/);
  assert.match(openEnding.passage, /holds you/);
  assert.notEqual(privateEnding.alex, openEnding.alex);
});
test("saved choice IDs reconstruct every complete route and reject impossible saves", () => {
  for (const state of allPaths(episode)) {
    const restored = restore(
      episode,
      state.history.map((h) => h.choice),
    );
    assert.deepEqual(restored.state, state);
    for (let i = 0; i < 3; i++)
      assert.equal(restored.snapshots[i].history.length, i);
  }
  assert.equal(restore(episode, ["private", "passes", "publish_safe"]), null);
  assert.equal(restore(episode, ["withhold"]), null);
  assert.equal(restore(episode, "invalid"), null);
});
test("knowledge is disclosed by defined transitions, not leaked from author data", () => {
  const start = initialStory(episode);
  assert.deepEqual(start.knowledge.you, ["offer"]);
  assert.equal(start.knowledge.alex.includes("names"), false);
  const next = advance(episode, start, "private");
  assert.ok(next.knowledge.you.includes("names"));
  assert.ok(next.knowledge.alex.includes("names"));
  assert.deepEqual(start.knowledge.you, ["offer"]);
});
