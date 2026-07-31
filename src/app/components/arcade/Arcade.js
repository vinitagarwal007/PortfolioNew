"use client";
import { useState } from "react";
import styles from "./Arcade.module.css";
import PacketRouter from "./PacketRouter";
import ChaosMonkey from "./ChaosMonkey";
import HashRing from "./HashRing";
import DebounceLab from "./DebounceLab";
import Shell from "./Shell";

const MODULES = [
  { id: "router", name: "Packet Router", kind: "game", icon: "🛰", Comp: PacketRouter },
  { id: "chaos", name: "Chaos Monkey", kind: "game", icon: "🐒", Comp: ChaosMonkey },
  { id: "ring", name: "Hash Ring", kind: "sandbox", icon: "◎", Comp: HashRing },
  { id: "debounce", name: "Debounce Lab", kind: "sandbox", icon: "⏱", Comp: DebounceLab },
  { id: "shell", name: "Shell", kind: "cli", icon: "▮", Comp: Shell },
];

export default function Arcade() {
  const [active, setActive] = useState("router");
  const Current = MODULES.find((m) => m.id === active).Comp;

  return (
    <section className="section" id="arcade">
      <div className="wrap">
        <p className="eyebrow">The arcade</p>
        <h2 className="h2">Play with the ideas instead of reading them.</h2>
        <p className="lede">
          Two games and three sandboxes, all built from scratch. Each one is a
          toy version of something I actually had to get right in production.
        </p>

        <div className={styles.shell}>
          <div className={styles.tabs} role="tablist" aria-label="Arcade modules">
            {MODULES.map((m) => (
              <button
                key={m.id}
                role="tab"
                aria-selected={active === m.id}
                className={`${styles.tab} ${active === m.id ? styles.tabOn : ""}`}
                onClick={() => setActive(m.id)}
              >
                <span className={styles.tabIcon} aria-hidden="true">
                  {m.icon}
                </span>
                <span className={styles.tabText}>
                  <span className={styles.tabName}>{m.name}</span>
                  <span className={styles.tabKind}>{m.kind}</span>
                </span>
              </button>
            ))}
          </div>

          <div className={styles.stage} role="tabpanel">
            <Current key={active} />
          </div>
        </div>
      </div>
    </section>
  );
}
