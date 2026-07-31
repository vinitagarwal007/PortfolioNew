import ThrottleLab from "./ThrottleLab";

export const metadata = {
  title: "Throttle Simulator — Vinit Agarwal",
  description:
    "An interactive model of the throttled dispatch scheduler: set batch windows and gaps per integration and watch the system distribute and parallel-process communications without tripping a vendor rate limit.",
};

export default function ThrottlePage() {
  return <ThrottleLab />;
}
