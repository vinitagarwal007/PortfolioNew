"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import styles from "./Throttle.module.css";
import Timeline from "./Timeline";
import {
  buildThrottledPlan,
  buildUnthrottledPlan,
  burstPerJob,
  capacity,
  formatDuration,
} from "./plan";

const PRESETS = [
  { provider: "Meta WhatsApp", tps: 80, batch: 2000, time: 20, gap: 10, color: "#4ee1c1" },
  { provider: "Kaleyra", tps: 100, batch: 3000, time: 30, gap: 10, color: "#8b7cff" },
  { provider: "TCN", tps: 5, batch: 600, time: 20, gap: 15, color: "#ffc46b" },
  { provider: "Exotel", tps: 20, batch: 1200, time: 20, gap: 10, color: "#ff7a8a" },
  { provider: "Intalk", tps: 12, batch: 900, time: 15, gap: 15, color: "#63b3ff" },
  { provider: "ConVox", tps: 8, batch: 800, time: 20, gap: 20, color: "#9ae66e" },
];

const SPEEDS = [
  { label: "1×", minutesPerTick: 1 },
  { label: "4×", minutesPerTick: 4 },
  { label: "16×", minutesPerTick: 16 },
];

const TICK_MS = 60;

let uid = 0;

export default function ThrottleLab() {
  const [total, setTotal] = useState(40000);
  const [mode, setMode] = useState("throttled");
  const [speed, setSpeed] = useState(1);
  const [playing, setPlaying] = useState(false);
  const [now, setNow] = useState(0);
  const [integrations, setIntegrations] = useState(() => [
    { ...PRESETS[0], id: `i${uid++}`, name: PRESETS[0].provider },
  ]);
  const [picker, setPicker] = useState(PRESETS[1].provider);

  const plan = useMemo(
    () =>
      mode === "throttled"
        ? buildThrottledPlan(total, integrations)
        : buildUnthrottledPlan(total, integrations),
    [total, integrations, mode]
  );

  // any config change invalidates the current run
  useEffect(() => {
    setNow(0);
    setPlaying(false);
  }, [total, integrations, mode]);

  const timer = useRef(null);
  useEffect(() => {
    if (!playing || !plan) return;
    timer.current = setInterval(() => {
      setNow((t) => {
        const next = t + SPEEDS[speed].minutesPerTick;
        if (next >= plan.finish) {
          setPlaying(false);
          return plan.finish;
        }
        return next;
      });
    }, TICK_MS);
    return () => clearInterval(timer.current);
  }, [playing, speed, plan]);

  const live = useMemo(() => {
    if (!plan) return null;
    let dispatched = 0;
    let inFlight = 0;
    const perLane = plan.lanes.map((lane) => {
      let sent = 0;
      let firing = 0;
      lane.jobs.forEach((j) => {
        if (j.t < now) sent += j.size;
        if (j.t === Math.floor(now)) firing += j.size;
      });
      if (plan.mode === "unthrottled") sent = now >= 1 ? lane.accepted : 0;
      dispatched += sent;
      inFlight += firing;
      return { lane, sent };
    });
    return { dispatched, inFlight, perLane };
  }, [plan, now]);

  const addIntegration = () => {
    const preset = PRESETS.find((p) => p.provider === picker);
    const dupes = integrations.filter((i) =>
      i.name.startsWith(preset.provider)
    ).length;
    setIntegrations((prev) => [
      ...prev,
      {
        ...preset,
        id: `i${uid++}`,
        name: dupes ? `${preset.provider} ${dupes + 1}` : preset.provider,
      },
    ]);
  };

  const update = (id, field, value) =>
    setIntegrations((prev) =>
      prev.map((i) =>
        i.id === id
          ? { ...i, [field]: Math.max(1, Math.min(100000, Number(value) || 1)) }
          : i
      )
    );

  const remove = (id) =>
    setIntegrations((prev) => prev.filter((i) => i.id !== id));

  const done = plan && now >= plan.finish;
  const sustained = integrations.reduce((a, i) => a + capacity(i), 0);

  return (
    <div className={styles.page}>
      <header className={styles.top}>
        <Link href="/" className={styles.back}>
          ← Back to portfolio
        </Link>
        <span className={styles.topTag}>throttle simulator</span>
      </header>

      <div className={styles.intro}>
        <p className="eyebrow">Communication platform</p>
        <h1 className={styles.h1}>
          How 40,000 messages leave the building without getting you banned.
        </h1>
        <p className={styles.lede}>
          Add integrations, set their throttle windows, and watch the scheduler
          spread the load. Every job is one minute apart inside a window; when
          the window closes, the lane goes quiet for the gap and picks up on the
          next cycle. Flip to <b>no throttling</b> to see what the vendor does
          when you hand it everything at once.
        </p>
      </div>

      <div className={styles.layout}>
        {/* ---------------- controls ---------------- */}
        <aside className={styles.controls}>
          <section className={styles.block}>
            <label className={styles.blockLabel} htmlFor="total">
              Total messages to send
            </label>
            <input
              id="total"
              type="number"
              className={styles.numberInput}
              value={total}
              min={100}
              max={500000}
              step={1000}
              onChange={(e) =>
                setTotal(Math.max(100, Math.min(500000, Number(e.target.value) || 100)))
              }
            />
            <input
              type="range"
              className={styles.range}
              min={2000}
              max={200000}
              step={2000}
              value={Math.min(200000, total)}
              onChange={(e) => setTotal(Number(e.target.value))}
              aria-label="Total messages"
            />
          </section>

          <section className={styles.block}>
            <p className={styles.blockLabel}>Dispatch mode</p>
            <div className={styles.modeSwitch}>
              <button
                className={mode === "throttled" ? styles.modeOn : ""}
                onClick={() => setMode("throttled")}
              >
                Throttled
              </button>
              <button
                className={mode === "unthrottled" ? styles.modeOnBad : ""}
                onClick={() => setMode("unthrottled")}
              >
                No throttling
              </button>
            </div>
          </section>

          <section className={styles.block}>
            <p className={styles.blockLabel}>Integrations</p>

            {integrations.map((i) => (
              <article
                key={i.id}
                className={styles.integration}
                style={{ "--tint": i.color }}
              >
                <header>
                  <span className={styles.intName}>
                    <i />
                    {i.name}
                  </span>
                  <span className={styles.intTps}>{i.tps} TPS cap</span>
                  <button
                    className={styles.remove}
                    onClick={() => remove(i.id)}
                    disabled={integrations.length === 1}
                    aria-label={`Remove ${i.name}`}
                  >
                    ×
                  </button>
                </header>

                <div className={styles.fields}>
                  <label>
                    <span>batch</span>
                    <input
                      type="number"
                      value={i.batch}
                      min={1}
                      onChange={(e) => update(i.id, "batch", e.target.value)}
                    />
                  </label>
                  <label>
                    <span>window (min)</span>
                    <input
                      type="number"
                      value={i.time}
                      min={1}
                      onChange={(e) => update(i.id, "time", e.target.value)}
                    />
                  </label>
                  <label>
                    <span>gap (min)</span>
                    <input
                      type="number"
                      value={i.gap}
                      min={1}
                      onChange={(e) => update(i.id, "gap", e.target.value)}
                    />
                  </label>
                </div>

                <p className={styles.derived}>
                  {i.batch.toLocaleString()} ÷ {i.time} ={" "}
                  <b>{burstPerJob(i)}</b> per job · {i.time} jobs, one a minute ·{" "}
                  {i.gap}m pause · sustained{" "}
                  <b>{capacity(i).toFixed(0)}</b>/min
                </p>
              </article>
            ))}

            <div className={styles.addRow}>
              <select
                className={styles.select}
                value={picker}
                onChange={(e) => setPicker(e.target.value)}
                aria-label="Provider to add"
              >
                {PRESETS.map((p) => (
                  <option key={p.provider} value={p.provider}>
                    {p.provider}
                  </option>
                ))}
              </select>
              <button className={styles.add} onClick={addIntegration}>
                + Add integration
              </button>
            </div>
          </section>

          <section className={styles.block}>
            <p className={styles.blockLabel}>Why lanes can share a scheduler</p>
            <p className={styles.prose}>
              Every integration above runs its own methods internally — its own
              auth, endpoints and parsing, whatever the vendor demands. What it
              returns is not its own invention: each one hands back a defined
              Pydantic model, and that typed object is processed onward into the
              single standard format the rest of the application understands.
            </p>
            <p className={styles.prose}>
              A voice integration reporting{" "}
              <code className={styles.tok}>call_completed</code> becomes{" "}
              <code className={`${styles.tok} ${styles.tokGood}`}>ANSWERED</code>{" "}
              at the boundary; nothing downstream has ever heard of{" "}
              <code className={styles.tok}>call_completed</code>. That is what
              lets one scheduler throttle, batch and roll up status across
              providers that agree on nothing — the abstraction was determined
              up front, so the differences never leak.
            </p>
          </section>

          <p className={styles.cacheNote}>
            <b>On the real thing:</b> the scheduler resolves template, tenant
            and recipient context on every job. Roughly 80% of those reads never
            reach Postgres — they come out of Redis, with the cache keyed per
            tenant and invalidated on write. Throttling controls what you send;
            caching is what makes sending it affordable.
          </p>
        </aside>

        {/* ---------------- stage ---------------- */}
        <main className={styles.stage}>
          {!plan ? (
            <p className={styles.empty}>Add an integration to plan a run.</p>
          ) : (
            <>
              <div className={styles.summary}>
                <div className={styles.sumItem}>
                  <span>total</span>
                  <b>{plan.total.toLocaleString()}</b>
                </div>
                <div className={styles.sumItem}>
                  <span>lanes</span>
                  <b>{plan.lanes.length}</b>
                </div>
                <div className={styles.sumItem}>
                  <span>sustained</span>
                  <b>{Math.round(sustained).toLocaleString()}/min</b>
                </div>
                <div className={styles.sumItem}>
                  <span>completes in</span>
                  <b className={plan.rejected ? styles.bad : styles.good}>
                    {plan.rejected ? "never" : formatDuration(plan.finish)}
                  </b>
                </div>
                <div className={styles.sumItem}>
                  <span>delivered</span>
                  <b className={plan.rejected ? styles.bad : styles.good}>
                    {Math.round((plan.delivered / plan.total) * 100)}%
                  </b>
                </div>
              </div>

              <div className={styles.playbar}>
                <button
                  className={styles.play}
                  onClick={() => {
                    if (done) setNow(0);
                    setPlaying((p) => !p);
                  }}
                >
                  {playing ? "❚❚ Pause" : done ? "↻ Replay" : "▶ Run"}
                </button>
                <div className={styles.speeds}>
                  {SPEEDS.map((s, i) => (
                    <button
                      key={s.label}
                      className={i === speed ? styles.speedOn : ""}
                      onClick={() => setSpeed(i)}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
                <button
                  className={styles.skip}
                  onClick={() => {
                    setPlaying(false);
                    setNow(plan.finish);
                  }}
                >
                  Skip to end
                </button>
                <span className={styles.clock}>
                  T+{formatDuration(now)} / {formatDuration(plan.finish)}
                </span>
              </div>

              <Timeline plan={plan} now={now} />

              <div className={styles.liveRow}>
                <div className={styles.liveStat}>
                  <span>dispatched</span>
                  <b>{live.dispatched.toLocaleString()}</b>
                </div>
                <div className={styles.liveStat}>
                  <span>in flight this minute</span>
                  <b className={styles.good}>{live.inFlight.toLocaleString()}</b>
                </div>
                <div className={styles.liveStat}>
                  <span>remaining</span>
                  <b>
                    {Math.max(
                      0,
                      plan.total - live.dispatched
                    ).toLocaleString()}
                  </b>
                </div>
                {plan.rejected > 0 && (
                  <div className={styles.liveStat}>
                    <span>rejected by vendor</span>
                    <b className={styles.bad}>
                      {plan.rejected.toLocaleString()}
                    </b>
                  </div>
                )}
              </div>

              {done && (
                <div
                  className={`${styles.verdict} ${
                    plan.rejected ? styles.verdictBad : styles.verdictGood
                  }`}
                >
                  {plan.rejected ? (
                    <>
                      <h3>Rate limited.</h3>
                      <p>
                        {plan.delivered.toLocaleString()} of{" "}
                        {plan.total.toLocaleString()} messages made it through
                        before every lane hit its ceiling.{" "}
                        {plan.rejected.toLocaleString()} were rejected outright
                        — and a vendor that silently drops you is one you can&apos;t
                        bill against. Switch throttling on.
                      </p>
                    </>
                  ) : (
                    <>
                      <h3>All {plan.total.toLocaleString()} delivered.</h3>
                      <p>
                        {formatDuration(plan.finish)} across {plan.lanes.length}{" "}
                        lane{plan.lanes.length > 1 ? "s" : ""}, every vendor kept
                        under its ceiling, nothing dropped. Add another
                        integration and the scheduler re-splits the work by
                        sustained capacity — the run gets shorter without any
                        lane pushing harder.
                      </p>
                    </>
                  )}
                </div>
              )}

              <div className={styles.laneTable}>
                {plan.lanes.map(({ integration, alloc, burst, cycles, finish, ...rest }) => (
                  <div
                    key={integration.id}
                    className={styles.laneRow}
                    style={{ "--tint": integration.color }}
                  >
                    <span className={styles.laneTag}>
                      <i />
                      {integration.name}
                    </span>
                    <span>{alloc.toLocaleString()} allocated</span>
                    <span>
                      {plan.mode === "throttled"
                        ? `${burst}/job · ${cycles} cycles`
                        : `${rest.accepted?.toLocaleString()} accepted`}
                    </span>
                    <span>
                      {plan.mode === "throttled"
                        ? formatDuration(finish)
                        : rest.blocked
                        ? "blocked"
                        : "ok"}
                    </span>
                  </div>
                ))}
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
