import ThrottleLab from "./ThrottleLab";

export const metadata = {
  title: "Throttle Simulator",
  description:
    "An interactive model of a throttled dispatch scheduler by Vinit Agarwal: set batch windows and gaps per integration and watch the system distribute and parallel-process communications without tripping a vendor rate limit.",
  alternates: { canonical: "/throttle" },
  openGraph: {
    title: "Throttle Simulator — Vinit Agarwal",
    description:
      "Set throttle windows per integration and watch 40,000 messages get scheduled, distributed and delivered without hitting a rate limit.",
    url: "/throttle",
    type: "article",
  },
};

export default function ThrottlePage() {
  return <ThrottleLab />;
}
