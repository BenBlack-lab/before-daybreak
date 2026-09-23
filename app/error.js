"use client";
export default function ErrorPage({ reset }) {
  return (
    <div className="gameRoot">
      <main className="storyApp about">
        <p className="eyebrow">BEFORE DAYBREAK</p>
        <h1>The story couldn’t load.</h1>
        <p>
          Your saved choices are still on this device. Try opening the story
          again.
        </p>
        <button className="primary" onClick={reset}>
          Try again
        </button>
      </main>
    </div>
  );
}
