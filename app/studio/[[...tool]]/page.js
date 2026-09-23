"use client";
import { NextStudio } from "next-sanity/studio";
import config from "../../../sanity.config";
export default function StudioPage() {
  return (
    <div className="studioShell">
      <NextStudio config={config} />
    </div>
  );
}
