"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./Arcade.module.css";
import local from "./ChaosMonkey.module.css";

const COUNT = 12;
const TICK = 200;
const FLOOR = 95; // below this uptime, you've breached the SLA
const BEST_KEY = "vinit.chaosMonkey.best";

const makeNodes = () =>
  Array.from({ length: COUNT }, (_, i) => ({
    id: i,
    name: `node-${String(i + 1).padStart(2, "0")}`,
    zone: ["ap-south", "ap-south", "eu-west", "us-east"][i % 4],
    status: "up",
    until: 0,
  }));

export default function ChaosMonkey() {
  const [nodes, setNodes] = useState(makeNodes);
  const [uptime, setUptime] = useState(100);
  const [elapsed, setElapsed] = useState(0);
  const [restarts, setRestarts] = useState(0);
  const [phase, setPhase] = useState("idle");
  const [event, setEvent] = useState(null);
  const [best, setBest] = useState(0);
  const clock = useRef(0);

  useEffect(() => {
    const stored = Number(window.localStorage.getItem(BEST_KEY) || 0);
    if (stored) setBest(stored);
  }, []);

  useEffect(() => {
    if (best > 0) window.localStorage.setItem(BEST_KEY, String(best));
  }, [best]);

  const start = useCallback(() => {
    setNodes(makeNodes());
    setUptime(100);
    setElapsed(0);
    setRestarts(0);
    setEvent(null);
    clock.current = 0;
    setPhase("playing");
  }, []);

  useEffect(() => {
    if (phase !== "playing") return;
    const id = setInterval(() => {
      clock.current += TICK;
      const seconds = clock.current / 1000;
      setElapsed(seconds);

      setNodes((prev) => {
        const now = clock.current;
        let next = prev.map((n) =>
          n.status === "boot" && now >= n.until ? { ...n, status: "up" } : n
        );

        // failure pressure ramps with time survived
        const pressure = 0.055 + Math.min(0.3, seconds * 0.006);
        const healthy = next.filter((n) => n.status === "up");

        if (healthy.length && Math.random() < pressure) {
          const victim = healthy[(Math.random() * healthy.length) | 0];
          next = next.map((n) =>
            n.id === victim.id ? { ...n, status: "down" } : n
          );
          setEvent({ kind: "node", text: `${victim.name} stopped responding` });
        }

        // occasional zone-wide outage
        if (seconds > 8 && Math.random() < 0.012) {
          const zone = ["ap-south", "eu-west", "us-east"][
            (Math.random() * 3) | 0
          ];
          next = next.map((n) =>
            n.zone === zone && n.status === "up" ? { ...n, status: "down" } : n
          );
          setEvent({ kind: "zone", text: `${zone} lost connectivity` });
        }

        // tuned for 5 ticks/sec: one dead node costs ~0.35%/s, a dead zone ~0.85%/s,
        // which leaves enough runway to actually click your way out of it
        const down = next.filter((n) => n.status === "down").length;
        setUptime((u) => {
          const drift = down === 0 ? 0.05 : -(0.02 + down * 0.05);
          return Math.max(80, Math.min(100, u + drift));
        });

        return next;
      });
    }, TICK);
    return () => clearInterval(id);
  }, [phase]);

  useEffect(() => {
    if (phase === "playing" && uptime <= FLOOR) {
      setPhase("over");
      setBest((prev) => Math.max(prev, Math.floor(elapsed)));
    }
  }, [uptime, phase, elapsed]);

  const revive = (id) => {
    if (phase !== "playing") return;
    setNodes((prev) =>
      prev.map((n) =>
        n.id === id && n.status === "down"
          ? { ...n, status: "boot", until: clock.current + 500 }
          : n
      )
    );
    setRestarts((r) => r + 1);
  };

  const down = nodes.filter((n) => n.status === "down").length;

  return (
    <div>
      <div className={styles.head}>
        <div className={styles.headText}>
          <h3>Chaos Monkey</h3>
          <p>
            Something is killing your nodes. Click a dead one to restart it and
            keep the fleet above its SLA. Zones fail together, because of
            course they do.
          </p>
        </div>
        <div className={styles.hud}>
          <div className={styles.stat}>
            <span>uptime</span>
            <b
              className={
                uptime > 98 ? styles.good : uptime > 96.5 ? styles.warnTone : styles.bad
              }
            >
              {uptime.toFixed(2)}%
            </b>
          </div>
          <div className={styles.stat}>
            <span>survived</span>
            <b>{elapsed.toFixed(1)}s</b>
          </div>
          <div className={styles.stat}>
            <span>restarts</span>
            <b>{restarts}</b>
          </div>
          <div className={styles.stat}>
            <span>best</span>
            <b>{best}s</b>
          </div>
        </div>
      </div>

      <div className={`${styles.board} ${local.board}`}>
        <div className={local.slaBar}>
          <i
            style={{
              width: `${Math.max(0, ((uptime - FLOOR) / (100 - FLOOR)) * 100)}%`,
              background:
                uptime > 98
                  ? "var(--accent)"
                  : uptime > 96.5
                  ? "var(--amber)"
                  : "var(--rose)",
            }}
          />
          <span>SLA floor {FLOOR}%</span>
        </div>

        <div className={local.grid}>
          {nodes.map((n) => (
            <button
              key={n.id}
              className={`${local.node} ${local[n.status]}`}
              onClick={() => revive(n.id)}
              disabled={phase !== "playing" || n.status !== "down"}
              aria-label={`${n.name} ${n.status}`}
            >
              <span className={local.nodeName}>{n.name}</span>
              <span className={local.zone}>{n.zone}</span>
              <span className={local.state}>
                {n.status === "up"
                  ? "healthy"
                  : n.status === "boot"
                  ? "booting…"
                  : "DOWN — click"}
              </span>
            </button>
          ))}
        </div>

        <div className={local.ticker}>
          {event ? (
            <span className={event.kind === "zone" ? local.zoneAlert : ""}>
              {event.kind === "zone" ? "⚠ " : "› "}
              {event.text}
            </span>
          ) : (
            <span>› all replicas reporting healthy</span>
          )}
          <em>{down} down</em>
        </div>

        {phase !== "playing" && (
          <div className={styles.overlay}>
            <div>
              <h4>{phase === "over" ? "SLA breached" : "Chaos Monkey"}</h4>
              <p>
                {phase === "over"
                  ? `You held the fleet for ${elapsed.toFixed(
                      1
                    )}s with ${restarts} restarts before uptime fell through the floor.`
                  : "Keep uptime above 95%. Dead nodes drain it, zone outages drain it faster."}
              </p>
              <button
                className={`${styles.btn} ${styles.btnPrimary}`}
                onClick={start}
              >
                {phase === "over" ? "Page yourself again" : "Start the outage"}
              </button>
            </div>
          </div>
        )}
      </div>

      <p className={styles.explain}>
        <b>Why this exists:</b> clicking nodes is the joke version. The real
        answer is that no single instance owns any user&apos;s state, so a node
        dying is a scheduling event rather than an incident — which is exactly
        what the debounce lab next door is about.
      </p>
    </div>
  );
}
