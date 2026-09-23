import Link from "next/link";
import { loadEpisode } from "../../lib/load-episode.mjs";
import { allPaths } from "../../lib/story.mjs";
import { validateEpisode } from "../../lib/content.mjs";
export const dynamic = "force-dynamic";
export default async function About() {
  const { episode, source, message } = await loadEpisode();
  return (
    <div className="gameRoot">
      <main className="storyApp about">
        <nav className="topbar">
          <Link className="wordmark" href="/">
            BEFORE<span>DAYBREAK</span>
          </Link>
          <Link className="textButton" href="/">
            Back to the game ↗
          </Link>
        </nav>
        <p className="eyebrow">BEHIND THE STORY / CONTAINS DESIGN SPOILERS</p>
        <h1>
          A small story.
          <br />
          <em>Consequences with a memory.</em>
        </h1>
        <p className="lead">
          Before Daybreak explores what happens when a promise, a private
          conversation and a public decision collide.
        </p>
        <section>
          <h2>The same decision can cost someone else.</h2>
          <p>
            Who becomes the guarantor depends on your opening conversation. What
            you prepare controls the options at the gate. Your final choice
            determines whether your promise holds. If you break the silence
            agreement, the named guarantor bears the extra detention. The story
            never rolls a hidden loyalty score.
          </p>
        </section>
        <section>
          <h2>The content is connected.</h2>
          <p>
            Sanity holds separate characters, facts, scenes, choices and ending
            fragments. References connect them. Choices disclose facts and set
            explicit state values; ending fragments match those values. The
            runtime accepts a small list of state keys and values, never
            executable code from content.
          </p>
          <div className="schemaMap">
            <span>Characters</span>
            <span>Facts & knowledge</span>
            <span>Scenes → choices</span>
            <span>Promises & preparation</span>
            <span>Ending fragments</span>
          </div>
          <p>
            Editors can revise these relationships in Studio. A story-review
            tool checks the published graph and traverses every reachable path.
            The game refuses incomplete graphs and clearly labels its bundled
            sample when live content is unavailable.
          </p>
        </section>
        <section>
          <h2>What is verified right now?</h2>
          <div className="health">
            <p>
              <b>Content source:</b>{" "}
              {source === "sanity" ? "Sanity Content Lake" : "Bundled sample"}
            </p>
            <p>{message}</p>
            <p>
              <b>Graph errors:</b> {validateEpisode(episode).length}{" "}
              <b>Complete decision paths:</b> {allPaths(episode).length}
            </p>
            <p>
              <b>Project:</b> o1wtlllc · production
            </p>
          </div>
          <p>
            These checks establish consistent execution, not whether the game is
            emotionally effective or likely to win. Player feedback still
            matters.
          </p>
        </section>
        <section>
          <h2>What changed during the build?</h2>
          <p>
            The first prototype was a warehouse investigation. Ben challenged
            its clarity, then challenged a conventional detective-game
            suggestion. We explored trust and betrayal, rejected a contrived
            lift-capacity dilemma, and reduced the scope to a short story with
            replayable consequences.
          </p>
          <p>
            A local AIE review flagged missing causal rules. Its feedback was
            advisory; it did not prove originality or improved winning odds. The
            private engines were kept unchanged and are not part of this
            website.
          </p>
        </section>
        <section>
          <h2>Privacy and access</h2>
          <p>
            No player account, payment or runtime AI service is required. Choice
            IDs are saved in this browser’s local storage so a refresh can
            resume the story. They are not sent to Sanity. Clearing site data
            removes them. Story content is public and contains no private
            conversations or credentials.
          </p>
          <p>
            The authoring interface requires a Sanity account with access to the
            project. <Link href="/studio">Open authoring Studio →</Link>
          </p>
        </section>
        <footer>
          <Link href="/">Return to Before Daybreak ↗</Link>
        </footer>
      </main>
    </div>
  );
}
