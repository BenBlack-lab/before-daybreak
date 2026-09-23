import "./style.css";
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "https://before-daybreak.ben-black-1473.chatgpt.site");
export const metadata = {
  metadataBase: new URL(siteUrl),
  title: "Before Daybreak — A Game of Consequences",
  description:
    "Three decisions. Four people. A promise you may regret. Play a short story about trust, then revisit your choices to see who pays the price.",
  openGraph: {
    title: "Before Daybreak",
    description: "Getting everyone out is only half the story.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Before Daybreak",
    description: "Three decisions. Four people. A promise you may regret.",
  },
};
export default function Layout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
