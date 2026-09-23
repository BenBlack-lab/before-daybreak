import Link from "next/link";
export default function NotFound() {
  return (
    <div className="gameRoot">
      <main className="storyApp about">
        <p className="eyebrow">A WRONG TURN</p>
        <h1>
          The story is
          <br />
          <em>back this way.</em>
        </h1>
        <p>There isn’t a page at this address.</p>
        <Link className="primary" href="/">
          Return to Before Daybreak ↗
        </Link>
      </main>
    </div>
  );
}
