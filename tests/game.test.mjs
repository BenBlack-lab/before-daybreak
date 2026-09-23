import { test } from "node:test";
import assert from "node:assert/strict";
import { scenario } from "../data/case.mjs";
import { initialState, investigate, assess } from "../lib/game.mjs";
test("checks spend once, never exceed budget, and stop after commitment", () => {
  let s = initialState();
  s = investigate(s, "trial", scenario);
  assert.equal(s.credits, 4);
  assert.equal(investigate(s, "trial", scenario), s);
  s = investigate(s, "timing", scenario);
  s = investigate(s, "routes", scenario);
  assert.equal(s.credits, 0);
  assert.equal(investigate(s, "changes", scenario), s);
  assert.equal(investigate(s, "missing", scenario), s);
  const done = { ...initialState(), finished: true };
  assert.equal(investigate(done, "changes", scenario), done);
});
test("a correct guess is distinguished from controlled evidence", () => {
  assert.equal(assess(initialState(), "printer", scenario).controlled, false);
  let s = investigate(initialState(), "trial", scenario);
  assert.deepEqual(assess(s, "printer", scenario), {
    correct: true,
    controlled: true,
    supported: false,
  });
  assert.equal(assess(s, "routing", scenario).correct, false);
});
