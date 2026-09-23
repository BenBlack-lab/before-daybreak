import { allPaths, matches } from "./story.mjs";
export const stateValues = {
  approach: ["private", "open"],
  guarantor: ["alex", "you"],
  preparation: ["passes", "redact"],
  promise: ["silence", "sources"],
  outcome: ["withheld", "redacted", "original"],
};
export function validateEpisode(e) {
  const errors = [];
  const require = (ok, message) => {
    if (!ok) errors.push(message);
  };
  try {
    require(e?.version === 2, "Unsupported content version.");
    require(typeof e?.id === "string" &&
      typeof e.title === "string" &&
      typeof e.subtitle === "string", "Missing story identity.");
    require(Array.isArray(e.scenes) &&
      e.scenes.length === 3, "This episode needs exactly three scenes.");
    require(Array.isArray(e.characters) &&
      e.characters.length === 3, "Three characters are required.");
    const people = new Set(["you", ...e.characters.map((c) => c.id)]),
      facts = new Set(Object.keys(e.facts)),
      ids = new Set();
    for (const c of e.characters)
      require(["id", "name", "role", "motive"].every(
        (k) => typeof c[k] === "string",
      ), "Incomplete character.");
    function conditions(obj, effects = false) {
      for (const [k, v] of Object.entries(obj || {})) {
        require(Object.hasOwn(stateValues, k) &&
          stateValues[k].includes(v), "Unknown state condition or effect.");
        if (effects)
          require(k !==
            "outcome", "Use an ending action, not an outcome effect.");
      }
    }
    function knowledge(obj) {
      for (const [p, list] of Object.entries(obj || {})) {
        require(people.has(p) &&
          Array.isArray(list), "Invalid knowledge owner.");
        require(list.every((f) => facts.has(f)), "Unknown fact in disclosure.");
      }
    }
    knowledge(e.initialKnowledge);
    require(Array.isArray(
      e.initialKnowledge.you,
    ), "Player knowledge is missing.");
    for (const [i, s] of e.scenes.entries()) {
      require(["id", "title", "chapter", "prompt", "time", "place"].every(
        (k) => typeof s[k] === "string",
      ), "Incomplete scene.");
      require(Array.isArray(s.paragraphs) &&
        s.paragraphs.every(
          (p) => typeof p === "string",
        ), "Invalid scene prose.");
      require(Array.isArray(s.choices) &&
        s.choices.length > 0 &&
        s.choices.length <= 6, "Invalid choice count.");
      knowledge(s.reveal);
      for (const c of s.choices) {
        require(!ids.has(c.id), "Duplicate choice ID.");
        ids.add(c.id);
        require(["id", "label", "hint", "event"].every(
          (k) => typeof c[k] === "string",
        ), "Incomplete choice.");
        conditions(c.requires);
        conditions(c.effects, true);
        knowledge(c.reveal);
        require(i === 2
          ? stateValues.outcome.includes(c.outcome)
          : !c.outcome, "An ending is in the wrong scene.");
      }
    }
    require(Array.isArray(e.rules) &&
      e.rules.length <= 100, "Invalid ending rules.");
    for (const r of e.rules) {
      conditions(r.when);
      require(["title", "passage", "evidence", "alex", "sam"].includes(
        r.channel,
      ) && typeof r.text === "string", "Invalid ending channel.");
    }
    if (!errors.length) {
      const paths = allPaths(e);
      require(paths.length > 0, "No complete path.");
      for (const s of paths)
        for (const channel of ["title", "passage", "evidence", "alex", "sam"])
          require(e.rules.some(
            (r) => r.channel === channel && matches(s, r.when),
          ), `An ending lacks ${channel}.`);
    }
  } catch {
    errors.push("The content graph contains missing or malformed fields.");
  }
  return [...new Set(errors)];
}
const ref = (type, id) => ({ _type: "reference", _ref: `bd-${type}-${id}` });
const keyed = (a) => a.map((v, i) => ({ ...v, _key: `item${i}` }));
const pairs = (o) =>
  keyed(Object.entries(o || {}).map(([key, value]) => ({ key, value })));
const revelations = (o) =>
  keyed(
    Object.entries(o || {}).map(([person, ids]) => ({
      person,
      facts: keyed(ids.map((id) => ref("fact", id))),
    })),
  );
export function toDocuments(e) {
  const errors = validateEpisode(e);
  if (errors.length) throw Error(errors.join(" "));
  const docs = e.characters.map((c) => ({
    _id: `bd-character-${c.id}`,
    _type: "bdCharacter",
    ...c,
  }));
  for (const [id, text] of Object.entries(e.facts))
    docs.push({
      _id: `bd-fact-${id}`,
      _type: "bdFact",
      id,
      title: id,
      text,
      knownBy: Object.entries(e.initialKnowledge)
        .filter(([, fs]) => fs.includes(id))
        .map(([p]) => p),
    });
  for (const s of e.scenes) {
    for (const c of s.choices)
      docs.push({
        _id: `bd-choice-${c.id}`,
        _type: "bdChoice",
        id: c.id,
        label: c.label,
        hint: c.hint,
        event: c.event,
        outcome: c.outcome || null,
        conditions: pairs(c.requires),
        effects: pairs(c.effects),
        reveal: revelations(c.reveal),
      });
    docs.push({
      _id: `bd-scene-${s.id}`,
      _type: "bdScene",
      id: s.id,
      chapter: s.chapter,
      title: s.title,
      time: s.time,
      place: s.place,
      paragraphs: s.paragraphs,
      quote: s.quote || "",
      prompt: s.prompt,
      reveal: revelations(s.reveal),
      choices: keyed(s.choices.map((c) => ref("choice", c.id))),
    });
  }
  for (const r of e.rules)
    docs.push({
      _id: `bd-ending-${r.id}`,
      _type: "bdEnding",
      id: r.id,
      channel: r.channel,
      conditions: pairs(r.when),
      text: r.text,
    });
  docs.push({
    _id: "bd-episode",
    _type: "bdEpisode",
    id: e.id,
    version: e.version,
    title: e.title,
    subtitle: e.subtitle,
    characters: keyed(e.characters.map((c) => ref("character", c.id))),
    facts: keyed(Object.keys(e.facts).map((id) => ref("fact", id))),
    scenes: keyed(e.scenes.map((s) => ref("scene", s.id))),
    rules: keyed(e.rules.map((r) => ref("ending", r.id))),
  });
  return docs;
}
export function fromDocuments(docs) {
  const index = new Map(docs.map((d) => [d._id, d]));
  const root = index.get("bd-episode");
  if (!root) throw Error("No published episode.");
  const deref = (r) => {
    const d = index.get(r._ref);
    if (!d) throw Error("Missing content reference.");
    return d;
  };
  const pairs = (a) =>
    Object.fromEntries((a || []).map((p) => [p.key, p.value]));
  const reveal = (a) =>
    Object.fromEntries(
      (a || []).map((r) => [r.person, r.facts.map((f) => deref(f).id)]),
    );
  const characters = root.characters
    .map(deref)
    .map(({ id, name, role, motive }) => ({ id, name, role, motive }));
  const initialKnowledge = Object.fromEntries(
    ["you", ...characters.map((c) => c.id)].map((p) => [p, []]),
  );
  const facts = {};
  for (const f of root.facts.map(deref)) {
    facts[f.id] = f.text;
    for (const p of f.knownBy) initialKnowledge[p].push(f.id);
  }
  const scenes = root.scenes
    .map(deref)
    .map((s) => ({
      id: s.id,
      chapter: s.chapter,
      title: s.title,
      time: s.time,
      place: s.place,
      paragraphs: s.paragraphs,
      quote: s.quote || undefined,
      prompt: s.prompt,
      reveal: reveal(s.reveal),
      choices: s.choices
        .map(deref)
        .map((c) => ({
          id: c.id,
          label: c.label,
          hint: c.hint,
          event: c.event,
          outcome: c.outcome || undefined,
          requires: pairs(c.conditions),
          effects: pairs(c.effects),
          reveal: reveal(c.reveal),
        })),
    }));
  const rules = root.rules
    .map(deref)
    .map((r) => ({
      id: r.id,
      channel: r.channel,
      when: pairs(r.conditions),
      text: r.text,
    }));
  const e = {
    id: root.id,
    version: root.version,
    title: root.title,
    subtitle: root.subtitle,
    characters,
    initialKnowledge,
    facts,
    scenes,
    rules,
  };
  const errors = validateEpisode(e);
  if (errors.length) throw Error(errors.join(" "));
  return e;
}
