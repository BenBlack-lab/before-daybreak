import { episode as bundledEpisode } from "../data/episode.mjs";
export const matches = (state, conditions = {}) =>
  Object.entries(conditions).every(([key, value]) => state[key] === value);
// A content fingerprint scopes local saves; it is not a security primitive.
export function fingerprint(episode) {
  const stable = (v) =>
    Array.isArray(v)
      ? v.map(stable)
      : v && typeof v === "object"
        ? Object.fromEntries(
            Object.keys(v)
              .filter((k) => v[k] !== undefined)
              .sort()
              .map((k) => [k, stable(v[k])]),
          )
        : v;
  let hash = 2166136261;
  for (const c of JSON.stringify(stable(episode))) {
    hash ^= c.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(16);
}
export function initialStory(episode) {
  return {
    scene: 0,
    approach: null,
    guarantor: null,
    preparation: null,
    promise: null,
    knowledge: structuredClone(episode.initialKnowledge),
    history: [],
    outcome: null,
  };
}
function reveal(state, changes = {}) {
  for (const [person, facts] of Object.entries(changes))
    state.knowledge[person] = [
      ...new Set([...(state.knowledge[person] || []), ...facts]),
    ];
}
export function choicesFor(episode, state) {
  if (state.outcome) return [];
  return episode.scenes[state.scene].choices.filter((c) =>
    matches(state, c.requires),
  );
}
export function advance(episode, state, id) {
  const choice = choicesFor(episode, state).find((c) => c.id === id);
  if (!choice) return state;
  const next = structuredClone(state);
  Object.assign(next, choice.effects || {});
  reveal(next, choice.reveal);
  next.history.push({
    scene: state.scene,
    choice: id,
    label: choice.label,
    text: choice.event,
  });
  if (choice.outcome) next.outcome = choice.outcome;
  else {
    next.scene++;
    reveal(next, episode.scenes[next.scene].reveal);
  }
  return next;
}
export function restore(episode, ids) {
  if (!Array.isArray(ids) || ids.length > episode.scenes.length) return null;
  let state = initialStory(episode);
  const snapshots = [];
  for (const id of ids) {
    if (typeof id !== "string") return null;
    const next = advance(episode, state, id);
    if (next === state) return null;
    snapshots.push(state);
    state = next;
  }
  return { state, snapshots };
}
export function ending(state, episode = bundledEpisode) {
  if (!state.outcome) return null;
  const escorted = state.outcome === "withheld",
    kept =
      state.promise === "silence" ? escorted : state.outcome !== "original";
  const output = {};
  for (const channel of ["title", "passage", "evidence", "alex", "sam"])
    output[channel] =
      episode.rules.find((r) => r.channel === channel && matches(state, r.when))
        ?.text || "This ending needs an author review.";
  return {
    ...output,
    kept,
    escorted,
    witnessesEscorted: escorted && state.preparation === "passes",
    promise: kept ? "Your promise held." : "Your promise broke.",
    responsibility:
      state.preparation === "passes"
        ? state.guarantor === "alex"
          ? "Alex put their name behind your word."
          : "You signed in your own name."
        : "You promised to protect the witnesses’ identities.",
  };
}
export function allPaths(episode) {
  const leaves = [];
  function walk(state) {
    if (state.outcome) {
      leaves.push(state);
      return;
    }
    for (const c of choicesFor(episode, state))
      walk(advance(episode, state, c.id));
  }
  walk(initialStory(episode));
  return leaves;
}
