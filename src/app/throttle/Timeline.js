"use client";
import styles from "./Throttle.module.css";
import { formatClock } from "./plan";

const W = 1000;
const LANE_H = 44;
const CHART_H = 108;
const PAD_L = 116;
const PAD_R = 14;

export default function Timeline({ plan, now }) {
  const span = Math.max(1, plan.finish);
  const innerW = W - PAD_L - PAD_R;
  const x = (t) => PAD_L + (Math.min(t, span) / span) * innerW;

  const lanesH = plan.lanes.length * LANE_H;
  const H = lanesH + CHART_H + 34;

  // hour gridlines, thinned out on long runs so labels never collide
  const hourStep = span > 720 ? 120 : span > 240 ? 60 : span > 90 ? 30 : 15;
  const ticks = [];
  for (let t = 0; t <= span; t += hourStep) ticks.push(t);

  const maxV = Math.max(1, plan.total);
  const chartTop = lanesH + 26;
  const chartBottom = chartTop + CHART_H - 34;
  const y = (v) => chartBottom - (v / maxV) * (chartBottom - chartTop);

  const line = plan.series.map((p) => `${x(p.t)},${y(p.v)}`).join(" ");
  const area = `${PAD_L},${chartBottom} ${line} ${x(
    plan.series[plan.series.length - 1].t
  )},${chartBottom}`;

  return (
    <div className={`${styles.timelineWrap} thin-scroll`}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className={styles.timeline}
        role="img"
        aria-label="Dispatch schedule over time"
      >
        <defs>
          <linearGradient id="fillGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.28" />
            <stop offset="100%" stopColor="var(--accent)" stopOpacity="0.02" />
          </linearGradient>
        </defs>

        {/* gridlines */}
        {ticks.map((t) => (
          <g key={t}>
            <line
              x1={x(t)}
              y1="6"
              x2={x(t)}
              y2={chartBottom}
              stroke="rgba(255,255,255,0.06)"
              strokeWidth="1"
            />
            <text x={x(t)} y={H - 8} className={styles.axisLabel}>
              {formatClock(t)}
            </text>
          </g>
        ))}

        {/* lanes */}
        {plan.lanes.map((lane, li) => {
          const top = li * LANE_H + 10;
          const color = lane.integration.color;
          const cycleLen =
            lane.integration.time + lane.integration.gap || span;
          const tickW = Math.max(1.1, (innerW / span) * 0.75);
          const dense = innerW / span < 2.2;

          return (
            <g key={lane.integration.id}>
              <text x="0" y={top + 15} className={styles.laneName}>
                {lane.integration.name}
              </text>
              <text x="0" y={top + 29} className={styles.laneMeta}>
                {lane.alloc.toLocaleString()} msgs
              </text>

              <rect
                x={PAD_L}
                y={top}
                width={innerW}
                height={26}
                rx="6"
                fill="rgba(255,255,255,0.022)"
              />

              {/* active windows — the gaps between them are the throttle pauses */}
              {plan.mode === "throttled" &&
                Array.from({ length: lane.cycles }, (_, c) => {
                  const start = c * cycleLen;
                  const end = Math.min(
                    start + lane.integration.time,
                    lane.finish
                  );
                  if (start >= span) return null;
                  return (
                    <rect
                      key={c}
                      x={x(start)}
                      y={top}
                      width={Math.max(1, x(end) - x(start))}
                      height={26}
                      rx="4"
                      fill={color}
                      opacity="0.14"
                    />
                  );
                })}

              {/* individual jobs, drawn only when they'd be distinguishable */}
              {!dense &&
                lane.jobs.map((j, i) => (
                  <rect
                    key={i}
                    x={x(j.t)}
                    y={top + 5}
                    width={tickW}
                    height={16}
                    rx="1"
                    fill={color}
                    opacity={j.t <= now ? 0.95 : 0.4}
                  />
                ))}

              {dense && (
                <rect
                  x={PAD_L}
                  y={top + 9}
                  width={Math.max(0, x(Math.min(now, lane.finish)) - PAD_L)}
                  height={8}
                  rx="4"
                  fill={color}
                  opacity="0.85"
                />
              )}

              {plan.mode === "unthrottled" && lane.blocked && (
                <>
                  <rect
                    x={x(0)}
                    y={top}
                    width={Math.max(2, x(lane.finish) - x(0))}
                    height={26}
                    rx="4"
                    fill="var(--rose)"
                    opacity="0.13"
                  />
                  <text x={x(0) + 8} y={top + 17} className={styles.blockedTag}>
                    rate limited — {lane.rejected.toLocaleString()} rejected
                  </text>
                </>
              )}
            </g>
          );
        })}

        {/* cumulative delivery */}
        <text x="0" y={chartTop - 6} className={styles.laneName}>
          delivered
        </text>
        <line
          x1={PAD_L}
          y1={chartBottom}
          x2={W - PAD_R}
          y2={chartBottom}
          stroke="rgba(255,255,255,0.12)"
        />
        <polygon points={area} fill="url(#fillGrad)" />
        <polyline
          points={line}
          fill="none"
          stroke="var(--accent)"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
        <text x="0" y={chartTop + 10} className={styles.laneMeta}>
          {plan.total.toLocaleString()}
        </text>

        {/* playhead */}
        <line
          x1={x(now)}
          y1="4"
          x2={x(now)}
          y2={chartBottom + 6}
          stroke="var(--amber)"
          strokeWidth="1.4"
        />
        <circle cx={x(now)} cy="4" r="3.5" fill="var(--amber)" />

        {/* not-yet-simulated region */}
        <rect
          x={x(now)}
          y="0"
          width={Math.max(0, W - PAD_R - x(now))}
          height={chartBottom}
          fill="rgba(6,8,11,0.55)"
        />
      </svg>
    </div>
  );
}
