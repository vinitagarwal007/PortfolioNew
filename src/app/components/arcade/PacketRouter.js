"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./Arcade.module.css";
import local from "./PacketRouter.module.css";

const GATES = [
  { id: "wa", label: "WhatsApp", short: "WA", color: "#4ee1c1", keys: ["ArrowLeft", "1", "a"] },
  { id: "voice", label: "Voice", short: "VC", color: "#8b7cff", keys: ["ArrowDown", "2", "s"] },
  { id: "sms", label: "SMS", short: "SM", color: "#ffc46b", keys: ["ArrowRight", "3", "d"] },
];

const BEST_KEY = "vinit.packetRouter.best";

export default function PacketRouter() {
  const canvasRef = useRef(null);
  const game = useRef(null);

  const [hud, setHud] = useState({ score: 0, combo: 0, routed: 0, lives: 3 });
  const [phase, setPhase] = useState("idle"); // idle | playing | over
  const [best, setBest] = useState(0);

  useEffect(() => {
    const stored = Number(window.localStorage.getItem(BEST_KEY) || 0);
    if (stored) setBest(stored);
  }, []);

  // record the high score once the run is actually over
  useEffect(() => {
    if (phase !== "over") return;
    setBest((prev) => Math.max(prev, hud.score));
  }, [phase, hud.score]);

  useEffect(() => {
    if (best > 0) window.localStorage.setItem(BEST_KEY, String(best));
  }, [best]);

  // ---- core game state lives in a ref so the render loop never re-renders ----
  const reset = useCallback(() => {
    game.current = {
      packets: [],
      score: 0,
      combo: 0,
      routed: 0,
      lives: 3,
      spawnEvery: 1150,
      sinceSpawn: 600,
      fallSpeed: 62,
      flash: [0, 0, 0],
      damage: 0,
      last: 0,
      seq: 0,
    };
    setHud({ score: 0, combo: 0, routed: 0, lives: 3 });
  }, []);

  const route = useCallback(
    (gateIndex) => {
      const g = game.current;
      if (!g || phase !== "playing") return;
      // the lowest still-falling packet is the one you're deciding on
      let target = null;
      for (const p of g.packets) {
        if (p.state === "fall" && (!target || p.y > target.y)) target = p;
      }
      if (!target) return;
      target.state = "route";
      target.gate = gateIndex;
      target.t = 0;
      target.fromX = target.x;
      target.fromY = target.y;
      target.correct = GATES[gateIndex].id === target.type;
    },
    [phase]
  );

  // ---- keyboard ----
  useEffect(() => {
    if (phase !== "playing") return;
    const onKey = (e) => {
      const idx = GATES.findIndex((g) => g.keys.includes(e.key));
      if (idx >= 0) {
        e.preventDefault();
        route(idx);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [phase, route]);

  // ---- render loop ----
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let raf = 0;
    let w = 0;
    let h = 0;

    const fit = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = rect.width;
      h = rect.height;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    fit();
    window.addEventListener("resize", fit);

    const gateBox = (i) => {
      const pad = 14;
      const gw = (w - pad * 4) / 3;
      return { x: pad + i * (gw + pad), y: h - 62, w: gw, h: 46 };
    };

    const roundRect = (x, y, rw, rh, r) => {
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.arcTo(x + rw, y, x + rw, y + rh, r);
      ctx.arcTo(x + rw, y + rh, x, y + rh, r);
      ctx.arcTo(x, y + rh, x, y, r);
      ctx.arcTo(x, y, x + rw, y, r);
      ctx.closePath();
    };

    const draw = (g) => {
      ctx.clearRect(0, 0, w, h);

      // chute
      const chuteW = 96;
      ctx.fillStyle = "rgba(255,255,255,0.018)";
      ctx.fillRect(w / 2 - chuteW / 2, 0, chuteW, h - 68);
      ctx.strokeStyle = "rgba(255,255,255,0.06)";
      ctx.setLineDash([4, 8]);
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(w / 2, 0);
      ctx.lineTo(w / 2, h - 70);
      ctx.stroke();
      ctx.setLineDash([]);

      // ingress label
      ctx.font = "500 10px ui-monospace, monospace";
      ctx.fillStyle = "rgba(148,163,179,0.65)";
      ctx.textAlign = "center";
      ctx.fillText("INGRESS", w / 2, 16);

      // gates
      GATES.forEach((gate, i) => {
        const b = gateBox(i);
        const flash = g ? g.flash[i] : 0;
        ctx.globalAlpha = 1;
        roundRect(b.x, b.y, b.w, b.h, 11);
        ctx.fillStyle = `rgba(255,255,255,${0.02 + flash * 0.12})`;
        ctx.fill();
        ctx.lineWidth = 1.4;
        ctx.strokeStyle = flash > 0 ? gate.color : "rgba(255,255,255,0.16)";
        ctx.stroke();

        ctx.fillStyle = gate.color;
        ctx.globalAlpha = 0.9;
        roundRect(b.x + 10, b.y + b.h / 2 - 4, 8, 8, 2);
        ctx.fill();
        ctx.globalAlpha = 1;

        ctx.font = "500 12px system-ui, sans-serif";
        ctx.fillStyle = "rgba(232,238,245,0.9)";
        ctx.textAlign = "left";
        ctx.fillText(gate.label, b.x + 26, b.y + b.h / 2 + 4);

        ctx.font = "10px ui-monospace, monospace";
        ctx.fillStyle = "rgba(102,114,127,0.9)";
        ctx.textAlign = "right";
        ctx.fillText(
          ["◀ / 1", "▼ / 2", "▶ / 3"][i],
          b.x + b.w - 10,
          b.y + b.h / 2 + 4
        );
      });

      if (!g) return;

      // packets
      for (const p of g.packets) {
        const gate = GATES.find((x) => x.id === p.type);
        const pw = 62;
        const ph = 28;
        ctx.save();
        ctx.globalAlpha = p.state === "gone" ? Math.max(0, 1 - p.t) : 1;
        ctx.shadowColor = gate.color;
        ctx.shadowBlur = p.state === "route" ? 16 : 8;
        roundRect(p.x - pw / 2, p.y - ph / 2, pw, ph, 8);
        ctx.fillStyle = "rgba(14,19,26,0.96)";
        ctx.fill();
        ctx.lineWidth = 1.3;
        ctx.strokeStyle = gate.color;
        ctx.stroke();
        ctx.shadowBlur = 0;

        ctx.fillStyle = gate.color;
        roundRect(p.x - pw / 2 + 7, p.y - 4, 8, 8, 2);
        ctx.fill();

        ctx.font = "600 11px ui-monospace, monospace";
        ctx.fillStyle = "rgba(232,238,245,0.92)";
        ctx.textAlign = "left";
        ctx.fillText(gate.short, p.x - pw / 2 + 21, p.y + 4);
        ctx.restore();
      }

      // damage flash
      if (g.damage > 0) {
        ctx.fillStyle = `rgba(255,122,138,${g.damage * 0.22})`;
        ctx.fillRect(0, 0, w, h);
      }
    };

    const step = (ts) => {
      const g = game.current;
      if (!g) {
        draw(null);
        raf = requestAnimationFrame(step);
        return;
      }
      const dt = Math.min(48, ts - (g.last || ts));
      g.last = ts;

      if (phase === "playing") {
        g.sinceSpawn += dt;
        if (g.sinceSpawn >= g.spawnEvery) {
          g.sinceSpawn = 0;
          const type = GATES[(Math.random() * GATES.length) | 0].id;
          g.packets.push({
            id: g.seq++,
            type,
            x: w / 2,
            y: -18,
            state: "fall",
            t: 0,
          });
        }

        const floor = h - 66;
        let missed = 0;
        let scored = 0;

        for (const p of g.packets) {
          if (p.state === "fall") {
            p.y += (g.fallSpeed * dt) / 1000;
            if (p.y > floor) {
              p.state = "gone";
              p.t = 0;
              missed++;
            }
          } else if (p.state === "route") {
            p.t += dt / 190;
            const b = gateBox(p.gate);
            const tx = b.x + b.w / 2;
            const ty = b.y + b.h / 2;
            const e = Math.min(1, p.t);
            p.x = p.fromX + (tx - p.fromX) * e;
            p.y = p.fromY + (ty - p.fromY) * e;
            if (p.t >= 1) {
              p.state = "gone";
              p.t = 0;
              g.flash[p.gate] = 1;
              if (p.correct) scored++;
              else missed++;
            }
          } else {
            p.t += dt / 260;
          }
        }
        g.packets = g.packets.filter((p) => !(p.state === "gone" && p.t >= 1));

        if (scored) {
          for (let i = 0; i < scored; i++) {
            g.combo += 1;
            g.score += 10 + Math.min(g.combo, 12) * 2;
            g.routed += 1;
          }
          // ramp difficulty as throughput climbs
          g.spawnEvery = Math.max(430, 1150 - g.routed * 22);
          g.fallSpeed = Math.min(190, 62 + g.routed * 2.6);
        }
        if (missed) {
          g.combo = 0;
          g.lives -= missed;
          g.damage = 1;
        }
        if (scored || missed) {
          setHud({
            score: g.score,
            combo: g.combo,
            routed: g.routed,
            lives: Math.max(0, g.lives),
          });
        }
        if (g.lives <= 0) setPhase("over");
      }

      g.flash = g.flash.map((f) => Math.max(0, f - dt / 320));
      g.damage = Math.max(0, g.damage - dt / 420);

      draw(g);
      raf = requestAnimationFrame(step);
    };

    raf = requestAnimationFrame(step);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", fit);
    };
  }, [phase]);

  const start = () => {
    reset();
    setPhase("playing");
  };

  return (
    <div>
      <div className={styles.head}>
        <div className={styles.headText}>
          <h3>Packet Router</h3>
          <p>
            Messages arrive on one ingress and every one belongs to a different
            provider. Route each packet to the right gate before it hits the
            floor — three drops and your SLA is gone.
          </p>
        </div>
        <div className={styles.hud}>
          <div className={styles.stat}>
            <span>score</span>
            <b>{hud.score}</b>
          </div>
          <div className={styles.stat}>
            <span>combo</span>
            <b className={hud.combo > 4 ? styles.good : ""}>×{hud.combo}</b>
          </div>
          <div className={styles.stat}>
            <span>routed</span>
            <b>{hud.routed}</b>
          </div>
          <div className={styles.stat}>
            <span>sla</span>
            <b className={hud.lives < 2 ? styles.bad : styles.good}>
              {"●".repeat(hud.lives) || "—"}
            </b>
          </div>
          <div className={styles.stat}>
            <span>best</span>
            <b>{best}</b>
          </div>
        </div>
      </div>

      <div className={styles.board}>
        <canvas ref={canvasRef} className={styles.canvas} />

        {phase !== "playing" && (
          <div className={styles.overlay}>
            <div>
              <h4>{phase === "over" ? "Backpressure wins" : "Packet Router"}</h4>
              <p>
                {phase === "over"
                  ? `You routed ${hud.routed} packets for ${hud.score} points before the queue got you.`
                  : "Match each packet to its provider gate. It speeds up as throughput climbs."}
              </p>
              <div className={styles.keys}>
                <span className={styles.key}>◀ / 1 — WhatsApp</span>
                <span className={styles.key}>▼ / 2 — Voice</span>
                <span className={styles.key}>▶ / 3 — SMS</span>
              </div>
              <button
                className={`${styles.btn} ${styles.btnPrimary}`}
                onClick={start}
              >
                {phase === "over" ? "Redial" : "Start routing"}
              </button>
            </div>
          </div>
        )}
      </div>

      <div className={local.padRow}>
        {GATES.map((g, i) => (
          <button
            key={g.id}
            className={local.pad}
            style={{ "--tint": g.color }}
            onClick={() => route(i)}
            disabled={phase !== "playing"}
          >
            <i />
            {g.label}
          </button>
        ))}
      </div>

      <p className={styles.explain}>
        <b>Why this exists:</b> the real thing does this 10M times a day, except
        the gates have different rate limits, different auth and different
        payload shapes — so the router never learns their names. It looks up an
        implementation by key and hands the packet over.
      </p>
    </div>
  );
}
