# Before Daybreak

A short browser story about promises and consequences, built for the DEV Sanity Challenge, Path Two. Three decisions produce ten complete decision sequences. Those sequences combine five material people-outcomes, public/private evidence, broken/kept promises and character reactions. Ten sequences do not mean ten wholly distinct stories.

[Play the published game](https://before-daybreak.ben-black-1473.chatgpt.site) · [Read the contest entry](https://dev.to/ben_black_c5eb233a2cb53a2/before-daybreak-the-promise-is-the-branching-point-4f0o) · [See the build report](https://before-daybreak.ben-black-1473.chatgpt.site/about)

## Run locally

Requires Node 22.12+ and npm. Dependencies are pinned in package-lock.json.

```sh
npm ci
npm test
npm run build:next
npm start
```

Open http://127.0.0.1:3210. The game requires no player login or paid runtime AI service.

For the local editor, use `npm run studio:local` after building and visit http://localhost:3333/studio. That origin already has credentialed CORS access in this Sanity project. Sign in with the project account. Other origins need their own authorisation; do not add wildcard credentialed origins. Authoring credentials never go in browser-visible environment variables or the game bundle.

## Sanity content

Project: `o1wtlllc`. Dataset: `production`. API version: `2026-09-23`.

The published episode is `bd-episode`. Thirty-six linked public documents cover characters, facts, scenes, choices and ending fragments. Document IDs use hyphens because custom dotted IDs are not public-readable under Sanity's default permissions. The initial dotted-ID import is retained as unused historical content and filtered out of the authoring list; no existing documents were deleted.

The server fetches published documents without a token and validates the reconstructed graph. A bounded evaluator handles permitted state keys and values, knowledge disclosures and first-matching ending rules. It never evaluates content as JavaScript. If published content is unavailable or invalid, the player sees a clearly labelled bundled sample; `/about` explains the current source. Deployment verification must run `npm run content:check`, which fails if the game would fall back to the sample.

Editor workflow:

1. Open `/studio`, then the Story review tool.
2. For a new empty project only, Import starter story creates missing documents without replacing existing ones.
3. Edit the linked content in Structure and publish deliberately.
4. Check published story validates references, permitted effects and coverage across all reachable endings.
5. Reload the game. Published content is fetched per request; no rebuild is required for story changes.

`npm run content:export` writes the reviewed fictional seed to `sanity/seed/before-daybreak.ndjson`. This does not write to Sanity. Using the ordinary Studio publish controls supports human review; this project does not claim to implement Sanity's separate Workflows product or App SDK.

## Gameplay and privacy

The opening approach establishes who would guarantee an extended deal. Preparation determines whether six passes or a checked redacted report are ready. The last decision resolves the agreement. Breaking the guarantee changes who is detained; publishing the original exposes witnesses regardless of who signs.

An ending records the actual three decisions. Revisit restores the earlier state and removes later decisions. A comparison shows changed and unchanged outcomes alongside the previous completed playthrough.

Only choice IDs and a previous ending's choice IDs are saved in localStorage. Rehydration replays permitted actions rather than trusting saved state. Content fingerprints separate different story revisions. Player choices are never sent to Sanity. Local saves can be removed through browser site-data controls. Storage failure does not prevent playing.

## Verification

Tests cover all reachable paths, invalid saved sequences, immutable state transitions, unavailable options, disclosure, material guarantor consequences, round-tripping through the Sanity reference graph, missing references, unknown effects, ending coverage and content edits. They do not establish emotional effectiveness, novelty or likely contest placement.

Dependency overrides apply patched adm-zip, js-yaml 3.x and smol-toml versions, plus UUID 11.1.1 inside typeid-js. UUID's typeid integration was smoke-tested; production builds and browser Studio sign-in/import were also checked. Keep these overrides under review as upstream packages update. Do not use `npm audit fix --force` blindly.

The archived warehouse experiment remains at `/warehouse`; it is not the competition concept. Private engines and private chat transcripts are absent from this project.

## Public deployment

`npm run build` prepares a Cloudflare-compatible Next.js Worker through OpenNext and packages the server and public assets under `dist/` for Sites. Wrangler is used only for a local dry-run bundle, not for publishing. `npm run build:next` retains the normal Next.js build for other Node hosts and local production use. Published content needs no secret token. Set `NEXT_PUBLIC_SITE_URL` if deploying at another public HTTPS URL. Keep authoring in the local Studio unless its new host has a separately authorised CORS origin.

The live game and DEV entry are published. The source is browsable here, including the app, Sanity schema and review tool, content seed, build scripts, and tests. The ZIP is an optional snapshot. Publication makes the entry reviewable; it does not establish likely contest placement.
