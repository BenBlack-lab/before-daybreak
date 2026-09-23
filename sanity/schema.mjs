import { stateValues } from "../lib/content.mjs";
const string = (name, title = name) => ({
  name,
  title,
  type: "string",
  validation: (r) => r.required(),
});
const text = (name, title = name) => ({
  name,
  title,
  type: "text",
  rows: 3,
  validation: (r) => r.required(),
});
const refs = (name, to) => ({
  name,
  type: "array",
  of: [{ type: "reference", to: [{ type: to }] }],
  validation: (r) => r.required().min(1),
});
const conditions = (name) => ({
  name,
  type: "array",
  of: [{ type: "bdCondition" }],
});
const reveal = {
  name: "reveal",
  title: "Who learns which facts",
  type: "array",
  of: [{ type: "bdDisclosure" }],
};
export const schemaTypes = [
  {
    name: "bdCondition",
    title: "State rule",
    type: "object",
    fields: [
      { ...string("key"), options: { list: Object.keys(stateValues) } },
      {
        ...string("value"),
        validation: (r) =>
          r
            .required()
            .custom(
              (v, ctx) =>
                stateValues[ctx.parent?.key]?.includes(v) ||
                "Choose a value allowed for this state key.",
            ),
      },
    ],
    preview: { select: { title: "key", subtitle: "value" } },
  },
  {
    name: "bdDisclosure",
    title: "Disclosure",
    type: "object",
    fields: [
      {
        ...string("person"),
        options: { list: ["you", "alex", "morgan", "sam"] },
      },
      refs("facts", "bdFact"),
    ],
    preview: { select: { title: "person" } },
  },
  {
    name: "bdCharacter",
    title: "Character",
    type: "document",
    fields: [string("id"), string("name"), string("role"), text("motive")],
    preview: { select: { title: "name", subtitle: "role" } },
  },
  {
    name: "bdFact",
    title: "Fact",
    type: "document",
    fields: [
      string("id"),
      string("title"),
      text("text"),
      {
        name: "knownBy",
        title: "Initially known by",
        type: "array",
        of: [{ type: "string" }],
        options: { list: ["you", "alex", "morgan", "sam"] },
      },
    ],
  },
  {
    name: "bdChoice",
    title: "Choice",
    type: "document",
    fields: [
      string("id"),
      string("label"),
      text("hint"),
      text("event"),
      conditions("conditions"),
      conditions("effects"),
      reveal,
      {
        name: "outcome",
        type: "string",
        options: { list: stateValues.outcome },
      },
    ],
    preview: { select: { title: "label", subtitle: "id" } },
  },
  {
    name: "bdScene",
    title: "Scene",
    type: "document",
    fields: [
      string("id"),
      string("chapter"),
      string("title"),
      string("time"),
      string("place"),
      {
        name: "paragraphs",
        type: "array",
        of: [{ type: "text" }],
        validation: (r) => r.required().min(1),
      },
      { name: "quote", type: "text" },
      string("prompt"),
      reveal,
      refs("choices", "bdChoice"),
    ],
  },
  {
    name: "bdEnding",
    title: "Ending fragment",
    type: "document",
    fields: [
      string("id"),
      {
        ...string("channel"),
        options: { list: ["title", "passage", "evidence", "alex", "sam"] },
      },
      conditions("conditions"),
      text("text"),
    ],
    preview: { select: { title: "id", subtitle: "channel" } },
  },
  {
    name: "bdEpisode",
    title: "Episode",
    type: "document",
    fields: [
      string("id"),
      {
        name: "version",
        type: "number",
        initialValue: 2,
        validation: (r) => r.required().integer().min(2).max(2),
      },
      string("title"),
      string("subtitle"),
      refs("characters", "bdCharacter"),
      refs("facts", "bdFact"),
      refs("scenes", "bdScene"),
      {
        ...refs("rules", "bdEnding"),
        description:
          "First matching fragment wins for each ending channel. Put specific conditions before fallback fragments.",
      },
    ],
  },
];
