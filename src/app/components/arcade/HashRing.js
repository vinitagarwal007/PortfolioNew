"use client";
import { useMemo, useState } from "react";
import styles from "./Arcade.module.css";
import local from "./HashRing.module.css";

const PALETTE = [
  "#4ee1c1",
  "#8b7cff",
  "#ffc46b",
  "#ff7a8a",
  "#63b3ff",
  "#9ae66e",
  "#ff9ad5",
];

/**
 * FNV-1a followed by a murmur3 fmix32 avalanche, normalised to [0,1).
 *
 * The avalanche step matters: plain FNV-1a barely diffuses the last byte, so
 * sequential inputs like user:1, user:2, user:3 land in a near-linear run and
 * the ring degenerates into one node owning everything.
 */
function hash01(str) {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  h ^= h >>> 16;
  h = Math.imul(h, 0x85ebca6b);
  h ^= h >>> 13;
  h = Math.imul(h, 0xc2b2ae35);
  h ^= h >>> 16;
  return (h >>> 0) / 4294967296;
}

function buildRing(nodes, vnodes) {
  const ring = [];
  nodes.forEach((name, idx) => {
    for (let v = 0; v < vnodes; v++) {
      ring.push({ pos: hash01(`${name}#${v}`), node: name, idx });
    }
  });
  return ring.sort((a, b) => a.pos - b.pos);
}

function ownerOf(ring, pos) {
  for (const slot of ring) if (slot.pos >= pos) return slot;
  return ring[0]; // wrapped past the top of the ring
}

const START_NODES = ["node-a", "node-b", "node-c"];
const makeKeys = (n, offset = 0) =>
  Array.from({ length: n }, (_, i) => `user:${offset + i + 1}`);

export default function HashRing() {
  const [nodes, setNodes] = useState(START_NODES);
  const [vnodes, setVnodes] = useState(4);
  const [keys, setKeys] = useState(() => makeKeys(60));
  const [moved, setMoved] = useState({ count: 0, pct: 0, keys: new Set() });

  const ring = useMemo(() => buildRing(nodes, vnodes), [nodes, vnodes]);

  const assignment = useMemo(() => {
    const map = new Map();
    if (!ring.length) return map;
    keys.forEach((k) => map.set(k, ownerOf(ring, hash01(k))));
    return map;
  }, [ring, keys]);

  const load = useMemo(() => {
    const counts = Object.fromEntries(nodes.map((n) => [n, 0]));
    assignment.forEach((slot) => {
      if (slot) counts[slot.node] = (counts[slot.node] || 0) + 1;
    });
    return counts;
  }, [assignment, nodes]);

  /** Apply a topology change and measure how many keys actually moved. */
  function change(nextNodes, nextVnodes = vnodes) {
    const before = assignment;
    const nextRing = buildRing(nextNodes, nextVnodes);
    const movedKeys = new Set();
    keys.forEach((k) => {
      const now = nextRing.length ? ownerOf(nextRing, hash01(k)) : null;
      const was = before.get(k);
      if ((now?.node || null) !== (was?.node || null)) movedKeys.add(k);
    });
    setNodes(nextNodes);
    setVnodes(nextVnodes);
    setMoved({
      count: movedKeys.size,
      pct: keys.length ? Math.round((movedKeys.size / keys.length) * 100) : 0,
      keys: movedKeys,
    });
  }

  const addNode = () => {
    const letter = String.fromCharCode(97 + nodes.length);
    change([...nodes, `node-${letter}`]);
  };

  const dropNode = () => {
    if (nodes.length <= 1) return;
    change(nodes.slice(0, -1));
  };

  const addKeys = () => {
    setKeys((k) => [...k, ...makeKeys(30, k.length)]);
    setMoved({ count: 0, pct: 0, keys: new Set() });
  };

  const reset = () => {
    setNodes(START_NODES);
    setVnodes(4);
    setKeys(makeKeys(60));
    setMoved({ count: 0, pct: 0, keys: new Set() });
  };

  // ---- geometry ----
  const C = 160;
  const R = 108;
  const polar = (pos, radius) => {
    const a = pos * Math.PI * 2 - Math.PI / 2;
    return [C + Math.cos(a) * radius, C + Math.sin(a) * radius];
  };

  // 100% = every node holds its fair share; 0% = one node is carrying the ring
  const spread = Object.values(load);
  const ideal = keys.length / Math.max(1, nodes.length);
  const balance = spread.length
    ? Math.max(
        0,
        Math.round(
          (1 - Math.max(...spread.map((c) => Math.abs(c - ideal))) / ideal) * 100
        )
      )
    : 100;

  return (
    <div>
      <div className={styles.head}>
        <div className={styles.headText}>
          <h3>Consistent Hash Ring</h3>
          <p>
            Add and remove nodes and watch how few keys actually have to move.
            This is the difference between a resize and an outage.
          </p>
        </div>
        <div className={styles.hud}>
          <div className={styles.stat}>
            <span>nodes</span>
            <b>{nodes.length}</b>
          </div>
          <div className={styles.stat}>
            <span>keys</span>
            <b>{keys.length}</b>
          </div>
          <div className={styles.stat}>
            <span>moved</span>
            <b className={moved.pct > 40 ? styles.bad : styles.good}>
              {moved.pct}%
            </b>
          </div>
          <div className={styles.stat}>
            <span>balance</span>
            <b>{balance}%</b>
          </div>
        </div>
      </div>

      <div className={local.layout}>
        <div className={`${styles.board} ${local.ringBox}`}>
          <svg viewBox="0 0 320 320" className={local.ring}>
            <circle
              cx={C}
              cy={C}
              r={R}
              fill="none"
              stroke="rgba(255,255,255,0.09)"
              strokeWidth="1"
            />
            <text
              x={C}
              y={C - 6}
              textAnchor="middle"
              className={local.ringLabel}
            >
              {keys.length} keys
            </text>
            <text
              x={C}
              y={C + 12}
              textAnchor="middle"
              className={local.ringSub}
            >
              {nodes.length} nodes × {vnodes} vnodes
            </text>

            {/* vnode ticks */}
            {ring.map((slot, i) => {
              const [x1, y1] = polar(slot.pos, R - 9);
              const [x2, y2] = polar(slot.pos, R + 9);
              return (
                <line
                  key={`${slot.node}-${i}`}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke={PALETTE[slot.idx % PALETTE.length]}
                  strokeWidth="2.4"
                  strokeLinecap="round"
                />
              );
            })}

            {/* keys */}
            {keys.map((k) => {
              const slot = assignment.get(k);
              const [x, y] = polar(hash01(k), R + 22);
              const didMove = moved.keys.has(k);
              return (
                <circle
                  key={k}
                  cx={x}
                  cy={y}
                  r={didMove ? 3.4 : 2.2}
                  fill={slot ? PALETTE[slot.idx % PALETTE.length] : "#666"}
                  opacity={didMove ? 1 : 0.72}
                  className={didMove ? local.movedKey : undefined}
                />
              );
            })}
          </svg>
        </div>

        <div className={local.side}>
          <p className={local.sideLabel}>Load per node</p>
          <div className={local.bars}>
            {nodes.map((n, i) => {
              const count = load[n] || 0;
              const pct = keys.length ? (count / keys.length) * 100 : 0;
              return (
                <div key={n} className={local.barRow}>
                  <span className={local.barName}>
                    <i style={{ background: PALETTE[i % PALETTE.length] }} />
                    {n}
                  </span>
                  <div className={local.barTrack}>
                    <i
                      style={{
                        width: `${pct}%`,
                        background: PALETTE[i % PALETTE.length],
                      }}
                    />
                  </div>
                  <b>{count}</b>
                </div>
              );
            })}
          </div>

          <p className={local.sideLabel}>Virtual nodes per server</p>
          <div className={local.vnodePicker}>
            {[1, 4, 16].map((v) => (
              <button
                key={v}
                className={`${local.vBtn} ${v === vnodes ? local.vOn : ""}`}
                onClick={() => change(nodes, v)}
              >
                ×{v}
              </button>
            ))}
          </div>
          <p className={local.tip}>
            One vnode per server gives you lumpy ownership. Sixteen smooths the
            distribution out — same ring, better balance.
          </p>
        </div>
      </div>

      <div className={styles.controls}>
        <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={addNode}>
          + Add node
        </button>
        <button
          className={styles.btn}
          onClick={dropNode}
          disabled={nodes.length <= 1}
        >
          − Kill node
        </button>
        <button className={styles.btn} onClick={addKeys}>
          +30 keys
        </button>
        <button className={styles.btn} onClick={reset}>
          Reset
        </button>
        {moved.count > 0 && (
          <span className={local.movedNote}>
            {moved.count} of {keys.length} keys remapped
          </span>
        )}
      </div>

      <p className={styles.explain}>
        <b>Why this exists:</b> a modulo-based shard map remaps almost every key
        the moment the node count changes. On a ring, only the keys in the
        arc you touched move — which is what makes scaling a cache or a
        partitioned worker pool survivable during traffic.
      </p>
    </div>
  );
}
