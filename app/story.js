"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  initialStory,
  advance,
  choicesFor,
  ending,
  restore,
  fingerprint,
} from "../lib/story.mjs";
function Dawn({ small = false }) {
  return (
    <div className={small ? "dawn small" : "dawn"} aria-hidden="true">
      <div className="sun" />
      <div className="wall left" />
      <div className="wall right" />
      <div className="door">
        <div className="beam" />
      </div>
      <div className="floor" />
      <div className="people">
        <i />
        <i />
        <i />
        <i />
      </div>
      <span className="artCaption">NORTH EXIT / BEFORE THE MORNING SHIFT</span>
    </div>
  );
}
export default function Story({ episode, source = "sample", message = "" }) {
  const [state, setState] = useState(() => initialStory(episode)),
    [started, setStarted] = useState(false),
    [ready, setReady] = useState(false),
    [baseline, setBaseline] = useState(null),
    [saved, setSaved] = useState(true),
    [confirmRestart, setConfirmRestart] = useState(false);
  const heading = useRef(null),
    focusNext = useRef(false);
  const contentKey = useMemo(() => fingerprint(episode), [episode]);
  const storageKey = `before-daybreak:${episode.id}:${contentKey}`;
  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        const data = JSON.parse(raw);
        const restored = restore(episode, data.choices);
        if (restored) {
          setState(restored.state);
          setStarted(data.started === true);
        }
        const previous = restore(episode, data.baseline);
        if (previous?.state.outcome) setBaseline(data.baseline);
      }
    } catch {
      setSaved(false);
    }
    setReady(true);
  }, [episode, storageKey]);
  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(
        storageKey,
        JSON.stringify({
          choices: state.history.map((h) => h.choice),
          started,
          baseline,
        }),
      );
    } catch {
      setSaved(false);
    }
  }, [state, started, baseline, ready, storageKey]);
  useEffect(() => {
    if (focusNext.current) {
      heading.current?.focus({ preventScroll: true });
      heading.current?.scrollIntoView({ block: "start", behavior: "instant" });
      focusNext.current = false;
    }
  }, [state, started]);
  const scene = episode.scenes[state.scene],
    result = ending(state, episode),
    previousState = baseline ? restore(episode, baseline)?.state : null,
    previous = previousState?.outcome ? ending(previousState, episode) : null;
  function choose(id) {
    focusNext.current = true;
    setState((s) => advance(episode, s, id));
  }
  function restart() {
    setBaseline(null);
    setState(initialStory(episode));
    setStarted(false);
    setConfirmRestart(false);
    focusNext.current = true;
  }
  function rewind(index) {
    setBaseline(state.history.map((h) => h.choice));
    setState(
      restore(
        episode,
        state.history.slice(0, index).map((h) => h.choice),
      ).state,
    );
    focusNext.current = true;
  }
  function begin() {
    focusNext.current = true;
    setStarted(true);
  }
  return (
    <div className="gameRoot">
      <a className="skipLink" href="#play">
        Skip to the story
      </a>
      <main className="storyApp">
        <nav className="topbar">
          <a className="wordmark" href="/" aria-label="Before Daybreak home">
            BEFORE<span>DAYBREAK</span>
          </a>
          <div className="navRight">
            <span className="edition">A GAME OF CONSEQUENCES</span>
            {started && (
              <button className="quiet" onClick={() => setConfirmRestart(true)}>
                Start over
              </button>
            )}
          </div>
        </nav>
        {confirmRestart && (
          <section className="resetNotice" aria-label="Restart confirmation">
            <p>
              Start from the first decision? Your current choices will be
              cleared from this playthrough.
            </p>
            <button onClick={restart}>Start a new playthrough</button>
            <button className="quiet" onClick={() => setConfirmRestart(false)}>
              Keep playing
            </button>
          </section>
        )}
        {!started ? (
          <section className="landing" id="play">
            <div className="landingCopy">
              <p className="eyebrow">AN INTERACTIVE SHORT STORY</p>
              <h1 ref={heading} tabIndex={-1}>
                Before
                <br />
                <em>Daybreak</em>
              </h1>
              <p className="tagline">{episode.subtitle}</p>
              <p className="description">
                Someone saved you. Someone made a deal.
                <br />
                Now your word could cost them everything.
              </p>
              <button
                className="primary begin"
                disabled={!ready}
                onClick={begin}
              >
                {ready ? "Enter the story" : "Preparing the story…"}
                <span aria-hidden="true">↗</span>
              </button>
              <div className="gameFacts">
                <span>3 decisions</span>
                <span>Multiple consequences</span>
                <span>No timer</span>
              </div>
              <p className="landingNote">
                Read. Decide. Then revisit a choice and see what changes.
                <br />
                Your progress stays on this device.
              </p>
            </div>
            <Dawn />
          </section>
        ) : (
          <>
            <div className="chapterBar">
              <ol aria-label="Your progress">
                {episode.scenes.map((s, i) => (
                  <li
                    key={s.id}
                    className={
                      i === state.scene && !result
                        ? "current"
                        : i < state.scene || result
                          ? "complete"
                          : ""
                    }
                    aria-current={
                      i === state.scene && !result ? "step" : undefined
                    }
                  >
                    <span>0{i + 1}</span>
                    {s.chapter}
                  </li>
                ))}
              </ol>
              <span className="chapterTime">
                {result ? "MORNING" : `${scene.time} / NO REAL-TIME LIMIT`}
              </span>
            </div>
            {!result ? (
              <div className="storyColumns" id="play">
                <section className="storyScene" aria-labelledby="sceneTitle">
                  <div className="sceneMeta">
                    <span className="eyebrow">{scene.place}</span>
                    <span>0{state.scene + 1} / 03</span>
                  </div>
                  <h1 id="sceneTitle" ref={heading} tabIndex={-1}>
                    {scene.title}
                  </h1>
                  {state.scene === 1 && (
                    <blockquote className="dialogue">
                      <span className="speaker">
                        {state.approach === "private"
                          ? "ALEX / JUST TO YOU"
                          : "THE GROUP / EVERYONE HEARS"}
                      </span>
                      <p>
                        {state.approach === "private"
                          ? "“They’ll include the witnesses. Someone has to sign for us. Let it be me.” You ask Alex to bring the terms to the others."
                          : "“No more private deals,” you say. “If we take this offer, I’ll sign for it.” Sam opens the report. Morgan lays out the terms."}
                      </p>
                    </blockquote>
                  )}
                  <div className="prose">
                    {scene.paragraphs.map((p, i) => (
                      <p key={i}>{p}</p>
                    ))}
                  </div>
                  {scene.quote && (
                    <div className="messageCard">
                      <span>INCOMING / SECURITY CHIEF</span>
                      <p>{scene.quote}</p>
                    </div>
                  )}
                  {state.scene === 2 && (
                    <div className="preparation">
                      <span className="eyebrow">WHAT YOU SET IN MOTION</span>
                      <p>
                        {state.preparation === "passes"
                          ? `Six passes. An unredacted report. ${state.guarantor === "alex" ? "Alex is the named guarantor. If you publish, Alex will be held." : "You are the named guarantor. If you publish, you will be held."}`
                          : "A checked, redacted report. A promise to protect the sources. Four passes remain available if you choose silence."}
                      </p>
                    </div>
                  )}
                  <div className="decisionHeading">
                    <span className="eyebrow">YOUR DECISION</span>
                    <h2>{scene.prompt}</h2>
                  </div>
                  <div className="storyChoices">
                    {choicesFor(episode, state).map((c, i) => (
                      <button key={c.id} onClick={() => choose(c.id)}>
                        <span className="choiceNumber">0{i + 1}</span>
                        <span className="choiceCopy">
                          <strong>{c.label}</strong>
                          <span>{c.hint}</span>
                        </span>
                        <span className="choiceArrow" aria-hidden="true">
                          ↗
                        </span>
                      </button>
                    ))}
                  </div>
                  {state.scene === 2 && state.preparation !== "redact" && (
                    <p className="availability">
                      You used the preparation window to secure passes. A
                      checked, redacted release is not ready. You can revisit
                      that preparation after the ending.
                    </p>
                  )}
                </section>
                <aside className="casebook">
                  <Dawn small />
                  <p className="eyebrow">THE PEOPLE WITH YOU</p>
                  {episode.characters.map((c) => (
                    <details className="person" key={c.id}>
                      <summary>
                        <span className={`initial ${c.id}`} aria-hidden="true">
                          {c.name[0]}
                        </span>
                        <span>
                          <strong>{c.name}</strong>
                          <small>{c.role}</small>
                        </span>
                        <span className="expand" aria-hidden="true">
                          +
                        </span>
                      </summary>
                      <p>{c.motive}</p>
                    </details>
                  ))}
                  <details className="facts">
                    <summary>
                      What you know <span aria-hidden="true">+</span>
                    </summary>
                    <ul>
                      {state.knowledge.you.map((f) => (
                        <li key={f}>{episode.facts[f]}</li>
                      ))}
                    </ul>
                  </details>
                  {state.promise && (
                    <div className="promiseNote">
                      <span className="eyebrow">YOUR WORD</span>
                      <p>
                        {state.promise === "silence"
                          ? "Keep the report unpublished."
                          : "Do not reveal the sources’ identities."}
                      </p>
                    </div>
                  )}
                  <p className="asideNote">
                    No loyalty scores. People remember what you actually did.
                  </p>
                </aside>
              </div>
            ) : (
              <section
                className="ending"
                id="play"
                aria-labelledby="endingTitle"
              >
                <div className="endingHeader">
                  <p className="eyebrow">DAWN / THE CONSEQUENCES</p>
                  <h1 id="endingTitle" tabIndex={-1} ref={heading}>
                    {result.title}
                  </h1>
                  <p className="endingSubtitle">
                    There is no perfect score. There is what happened—and why.
                  </p>
                </div>
                <div className="outcomeGrid">
                  <article>
                    <span className="outcomeNumber">01</span>
                    <h2>The people</h2>
                    <p>{result.passage}</p>
                  </article>
                  <article>
                    <span className="outcomeNumber">02</span>
                    <h2>The truth</h2>
                    <p>{result.evidence}</p>
                  </article>
                  <article>
                    <span className="outcomeNumber">03</span>
                    <h2>{result.promise}</h2>
                    <p>{result.responsibility}</p>
                    <span
                      className={result.kept ? "status kept" : "status broken"}
                    >
                      {result.kept ? "KEPT" : "BROKEN"}
                    </span>
                  </article>
                </div>
                <div className="voices">
                  <blockquote>
                    <span className="speaker">ALEX</span>
                    <p>{result.alex}</p>
                  </blockquote>
                  <blockquote>
                    <span className="speaker">SAM</span>
                    <p>{result.sam}</p>
                  </blockquote>
                </div>
                {previous &&
                  JSON.stringify(baseline) !==
                    JSON.stringify(state.history.map((h) => h.choice)) && (
                    <section className="comparison">
                      <p className="eyebrow">THE OTHER WAY IT WENT</p>
                      <h2>Same night. Different choices.</h2>
                      <p className="compareIntro">
                        Compared with the ending you just revisited.
                      </p>
                      {[
                        ["People", "passage"],
                        ["Truth", "evidence"],
                        ["Promise", "promise"],
                        ["Responsibility", "responsibility"],
                      ].map(([label, key]) => (
                        <div className="compareRow" key={key}>
                          <strong>{label}</strong>
                          <div>
                            <small>BEFORE</small>
                            <p>{previous[key]}</p>
                          </div>
                          <div>
                            <small>
                              {previous[key] === result[key]
                                ? "UNCHANGED"
                                : "NOW"}
                            </small>
                            <p>{result[key]}</p>
                          </div>
                        </div>
                      ))}
                    </section>
                  )}
                <section className="traceSection">
                  <p className="eyebrow">FOLLOW THE CONSEQUENCES BACK</p>
                  <h2>Your choices left a trail.</h2>
                  <p>
                    Revisit any decision. Everything after it will be played
                    again.
                  </p>
                  <ol className="trace">
                    {state.history.map((event, i) => (
                      <li key={i}>
                        <span className="traceNumber">0{i + 1}</span>
                        <div>
                          <h3>{episode.scenes[event.scene].chapter}</h3>
                          <p>{event.text}</p>
                          <button
                            className="textButton"
                            onClick={() => rewind(i)}
                          >
                            Revisit decision {i + 1}{" "}
                            <span aria-hidden="true">↗</span>
                          </button>
                        </div>
                      </li>
                    ))}
                  </ol>
                  <button className="primary" onClick={restart}>
                    Play from the beginning <span aria-hidden="true">↗</span>
                  </button>
                </section>
              </section>
            )}
          </>
        )}
        {!saved && (
          <p className="saveNotice" role="status">
            This browser cannot save progress. Keep this tab open to finish your
            playthrough.
          </p>
        )}
        <footer>
          <span>
            BEFORE DAYBREAK <i>·</i> A fictional story by Ben, built with AI
            assistance.
          </span>
          <div>
            <a href="/about">Behind the story</a>
            <span className="sourceLabel" title={message}>
              {source === "sanity" ? "Story from Sanity" : "Sample story"}
            </span>
          </div>
        </footer>
      </main>
    </div>
  );
}
