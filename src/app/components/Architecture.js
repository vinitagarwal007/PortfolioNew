"use client";
import { useMemo, useState } from "react";
import styles from "./Architecture.module.css";
import { services, edges, layers } from "@/data/site";

const W = 1000;
const H = 660;
const BOX_W = 184;
const BOX_H = 50;

const layerColor = Object.fromEntries(layers.map((l) => [l.id, l.color]));

function point(s) {
  return { x: (s.x / 100) * W, y: (s.y / 100) * H };
}

/** Horizontal-ish bezier between two node centres. */
function edgePath(a, b) {
  const p1 = point(a);
  const p2 = point(b);
  const dx = Math.abs(p2.x - p1.x);
  const c = Math.max(60, dx * 0.45);
  return `M ${p1.x} ${p1.y} C ${p1.x + c} ${p1.y}, ${p2.x - c} ${p2.y}, ${p2.x} ${p2.y}`;
}

export default function Architecture() {
  const [selectedId, setSelectedId] = useState("core");
  const [hovered, setHovered] = useState(null);

  const byId = useMemo(
    () => Object.fromEntries(services.map((s) => [s.id, s])),
    []
  );
  const selected = byId[selectedId];
  const focus = hovered || selectedId;

  const connected = useMemo(() => {
    const set = new Set();
    edges.forEach(([a, b]) => {
      if (a === focus) set.add(b);
      if (b === focus) set.add(a);
    });
    return set;
  }, [focus]);

  return (
    <section className="section" id="systems">
      <div className="wrap">
        <p className="eyebrow">The system</p>
        <h2 className="h2">Nine services, one nervous system.</h2>
        <p className="lede">
          This is the communication stack I build and operate: inbound feeds,
          a core orchestrator, egress gateways and a realtime agent runtime.
          Pick a node — every one of them is something I designed, bootstrapped
          or own end to end.
        </p>

        <div className={styles.legend}>
          {layers.map((l) => (
            <span key={l.id} className={styles.legendItem}>
              <i style={{ background: l.color }} />
              {l.label}
            </span>
          ))}
          <span className={styles.hint}>click a node</span>
        </div>

        <div className={`${styles.mapScroll} thin-scroll`}>
          <svg
            className={styles.map}
            viewBox={`0 0 ${W} ${H}`}
            role="group"
            aria-label="Service architecture map"
          >
            <defs>
              <filter id="nodeGlow" x="-60%" y="-60%" width="220%" height="220%">
                <feGaussianBlur stdDeviation="7" result="b" />
                <feMerge>
                  <feMergeNode in="b" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* edges */}
            <g>
              {edges.map(([a, b]) => {
                const active = focus === a || focus === b;
                return (
                  <g key={`${a}-${b}`}>
                    <path
                      d={edgePath(byId[a], byId[b])}
                      className={styles.edge}
                      style={{ opacity: active ? 0.75 : 0.22 }}
                    />
                    <path
                      d={edgePath(byId[a], byId[b])}
                      className={`${styles.flow} ${active ? styles.flowOn : ""}`}
                    />
                  </g>
                );
              })}
            </g>

            {/* nodes */}
            <g>
              {services.map((s) => {
                const { x, y } = point(s);
                const color = layerColor[s.layer];
                const isFocus = focus === s.id;
                const isNear = connected.has(s.id);
                const dim = !isFocus && !isNear;
                return (
                  <g
                    key={s.id}
                    className={`${styles.node} ${dim ? styles.dim : ""}`}
                    transform={`translate(${x - BOX_W / 2} ${y - BOX_H / 2})`}
                    onClick={() => setSelectedId(s.id)}
                    onMouseEnter={() => setHovered(s.id)}
                    onMouseLeave={() => setHovered(null)}
                    onFocus={() => setHovered(s.id)}
                    onBlur={() => setHovered(null)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setSelectedId(s.id);
                      }
                    }}
                    tabIndex={0}
                    role="button"
                    aria-pressed={selectedId === s.id}
                    aria-label={s.name}
                  >
                    <rect
                      width={BOX_W}
                      height={BOX_H}
                      rx="11"
                      className={styles.box}
                      style={{
                        stroke: isFocus ? color : "rgba(255,255,255,0.14)",
                        filter: isFocus ? "url(#nodeGlow)" : "none",
                      }}
                    />
                    <rect
                      x="0"
                      y="0"
                      width="3"
                      height={BOX_H}
                      rx="1.5"
                      fill={color}
                      opacity={isFocus ? 1 : 0.55}
                    />
                    <text x="16" y="21" className={styles.nodeName}>
                      {s.name}
                    </text>
                    <text x="16" y="37" className={styles.nodeSlug} fill={color}>
                      {s.slug}
                    </text>
                    {s.primary && (
                      <circle
                        cx={BOX_W - 14}
                        cy={14}
                        r="3.5"
                        fill={color}
                        className={styles.pulse}
                      />
                    )}
                  </g>
                );
              })}
            </g>
          </svg>
        </div>

        <article className={styles.detail} key={selected.id}>
          <div className={styles.detailMain}>
            <header className={styles.detailHead}>
              <span
                className={styles.detailLayer}
                style={{ color: layerColor[selected.layer] }}
              >
                {layers.find((l) => l.id === selected.layer)?.label}
              </span>
              <h3>{selected.name}</h3>
              <code className={styles.detailSlug}>{selected.slug}</code>
            </header>
            <p className={styles.summary}>{selected.summary}</p>
            <ul className={styles.built}>
              {selected.built.map((b, i) => (
                <li key={i}>{b}</li>
              ))}
            </ul>
          </div>

          <aside className={styles.detailSide}>
            <div className={styles.metrics}>
              {selected.metrics.map(([k, v]) => (
                <div key={k}>
                  <span>{k}</span>
                  <b>{v}</b>
                </div>
              ))}
            </div>
            <div className={styles.stack}>
              {selected.stack.map((t) => (
                <span key={t} className="chip">
                  {t}
                </span>
              ))}
            </div>
          </aside>
        </article>
      </div>
    </section>
  );
}
