"use client";
import { useState } from "react";
import { initialState, investigate, assess } from "../lib/game.mjs";
export default function Game({ scenario, source }) {
  const [state, setState] = useState(initialState),
    [choice, setChoice] = useState("");
  const result = state.finished ? assess(state, choice, scenario) : null;
  function reset() {
    setState(initialState());
    setChoice("");
  }
  return (
    <main>
      <nav>
        <strong>
          WHAT CHANGED<span>?</span>
        </strong>
        <span className="pill">{source}</span>
      </nav>
      <header>
        <p className="eyebrow">LOOK CLOSER. SPEND WISELY.</p>
        <h1>
          The obvious answer
          <br />
          is only a theory.
        </h1>
        <p className="intro">
          An investigation game about noticing the difference between a
          convincing story and evidence.
        </p>
      </header>
      <section className="case">
        <div>
          <p className="eyebrow">{scenario.location}</p>
          <h2>{scenario.title}</h2>
        </div>
        <div className="budget" aria-live="polite">
          <b>{state.credits}</b>
          <span>credits left</span>
        </div>
        <p className="brief">{scenario.brief}</p>
        <ul>
          {scenario.initial.map((clue, i) => (
            <li key={i}>{clue}</li>
          ))}
        </ul>
      </section>
      <section className="scene" aria-label="Diagram of the two packing tables">
        <p className="eyebrow">PICTURE THE WORKPLACE</p>
        <h2>Two tables. The same job.</h2>
        <p>
          These are separate workstations, not traffic lanes. Each has a packing
          surface and a small printer.
        </p>
        <div className="stations">
          {["A", "B"].map((table) => (
            <article className="station" key={table}>
              <div className="stationHeading">
                <b>TABLE {table}</b>
                <span>
                  {table === "A" ? "Usual speed" : "Fewer parcels leaving"}
                </span>
              </div>
              <ol className="flow">
                <li>
                  <span className="sceneIcon" aria-hidden="true">
                    ▤
                  </span>
                  <b>1. Collect</b>
                  <span>Item from a shelf</span>
                </li>
                <li>
                  <span className="sceneIcon boxIcon" aria-hidden="true">
                    □
                  </span>
                  <b>2. Box</b>
                  <span>Put the item in a box</span>
                </li>
                <li>
                  <span className="sceneIcon labelIcon" aria-hidden="true">
                    ▥
                  </span>
                  <b>3. Label</b>
                  <span>Print address + barcode</span>
                </li>
                <li>
                  <span className="sceneIcon" aria-hidden="true">
                    →
                  </span>
                  <b>4. Send</b>
                  <span>Labelled parcel leaves</span>
                </li>
              </ol>
            </article>
          ))}
        </div>
        <p className="sceneNote">
          We know B is slower overall. We have not yet established which step is
          responsible.
        </p>
      </section>
      <section className="startHere">
        <div>
          <p className="eyebrow">START HERE</p>
          <h2>Watch before guessing.</h2>
          <p>
            A useful first move is to watch one parcel go through each table and
            compare the time spent at every step. No warehouse knowledge needed.
          </p>
          <p>
            The six credits are pretend investigation time. You don’t spend any
            money.
          </p>
        </div>
        <button
          className="primary"
          disabled={
            state.finished ||
            state.opened.includes("timing") ||
            state.credits < 2
          }
          onClick={() => setState((s) => investigate(s, "timing", scenario))}
        >
          {state.opened.includes("timing")
            ? "Observation collected below ↓"
            : "Watch the two tables · 2 credits"}
        </button>
        {state.opened.includes("timing") && (
          <p className="firstFinding" role="status">
            <b>What you saw: </b>
            {scenario.tests.find((t) => t.id === "timing")?.result}
          </p>
        )}
      </section>
      <div className="sectionTitle">
        <h2>Choose what to check next</h2>
        <span>
          Click a check to reveal what you observe. You do not need to carry out
          any real work.
        </span>
      </div>
      <section className="grid" aria-label="Investigation choices">
        {scenario.tests.map((test, i) => {
          const open = state.opened.includes(test.id);
          return (
            <article className={open ? "card open" : "card"} key={test.id}>
              <div className="cardTop">
                <span>0{i + 1}</span>
                <span>
                  {test.cost} {test.cost === 1 ? "credit" : "credits"}
                </span>
              </div>
              <h3>{test.title}</h3>
              <p>{test.question}</p>
              {open ? (
                <div className="finding">
                  <b>OBSERVATION</b>
                  <p>{test.result}</p>
                </div>
              ) : (
                <button
                  disabled={state.finished || state.credits < test.cost}
                  onClick={() =>
                    setState((s) => investigate(s, test.id, scenario))
                  }
                >
                  {state.credits < test.cost
                    ? "Not enough credits"
                    : "Investigate →"}
                </button>
              )}
            </article>
          );
        })}
      </section>
      <section className="decision">
        <p className="eyebrow">MAKE THE CALL</p>
        <h2>What explains the slowdown?</h2>
        <p>
          Choose an explanation. A correct guess and a tested explanation are
          different achievements.
        </p>
        <fieldset disabled={state.finished}>
          <legend className="sr">Your explanation</legend>
          {scenario.hypotheses.map((h) => (
            <label key={h.id}>
              <input
                type="radio"
                name="explanation"
                checked={choice === h.id}
                onChange={() => setChoice(h.id)}
              />
              {h.label}
            </label>
          ))}
        </fieldset>
        <button
          className="primary"
          disabled={!choice || state.finished}
          onClick={() => setState((s) => ({ ...s, finished: true }))}
        >
          Commit to explanation
        </button>
        {result && (
          <div className="result" role="status">
            <h3>
              {result.correct
                ? result.controlled
                  ? "Cause identified. Tested, too."
                  : "Right cause. How strong is your evidence?"
                : "That explanation does not fit all the clues."}
            </h3>
            <p>{scenario.explanation}</p>
            <p>
              {result.controlled
                ? "You ran the controlled comparison."
                : result.supported
                  ? "You found the change and the settings mismatch, but did not directly test the effect."
                  : "A targeted before/after test would strengthen the conclusion."}
            </p>
            <button onClick={reset}>Try a different investigation</button>
          </div>
        )}
      </section>
      <footer>
        Fictional case · First playable prototype · No real equipment
        instructions
        <br />
        Built with Ben and AI assistance. Not yet submitted to the Sanity
        Challenge.
      </footer>
    </main>
  );
}
