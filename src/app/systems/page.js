import Link from "next/link";
import Architecture from "../components/Architecture";
import styles from "./Systems.module.css";
import { profile } from "@/data/site";

export const metadata = {
  title: "The Systems",
  description:
    "The nine services Vinit Agarwal designed and operates — inbound feeds, a core orchestrator, egress gateways and a realtime agent runtime — with what he built inside each one.",
  alternates: { canonical: "/systems" },
  openGraph: {
    title: "The Systems — Vinit Agarwal",
    description:
      "Nine services across ingress, core orchestration, egress and agent runtime. Pick a node to see what was built inside it.",
    url: "/systems",
    type: "article",
  },
};

export default function SystemsPage() {
  return (
    <div className={styles.page}>
      <header className={styles.top}>
        <Link href="/" className={styles.back}>
          ← Back to portfolio
        </Link>
        <span className={styles.topTag}>the systems</span>
      </header>

      <Architecture />

      <footer className={styles.foot}>
        <p>
          Every one of these is something I designed, bootstrapped or own end to
          end. If you want to see how the dispatch scheduling actually behaves,
          the <Link href="/throttle">throttle simulator</Link> models it.
        </p>
        <Link href="/" className={styles.backBottom}>
          ← Back to {profile.name.split(" ")[0]}&apos;s portfolio
        </Link>
      </footer>
    </div>
  );
}
