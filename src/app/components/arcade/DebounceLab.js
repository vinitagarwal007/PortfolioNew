"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./Arcade.module.css";
import local from "./DebounceLab.module.css";

const WINDOW = 1400;
const INSTANCES = ["instance-1", "instance-2", "instance-3"];

export default function DebounceLab() {
  const [msgs, setMsgs] = useState([]);
  const [naive, setNaive] = useState(0);
  const [jobs, setJobs] = useState([]); // collapsed jobs, newest last
  const [ttl, setTtl] = useState(null); // { end, owner, count }
  const [hot, setHot] = useState(null); // instance that just received traffic
  const seq = useRef(0);
  const timer = useRef(null);
  const pending = useRef(0);
  const owner = useRef(null);
  const [, force] = useState(0);

  // repaint the TTL bar while a window is open
  useEffect(() => {
    if (!ttl) return;
    const id = setInterval(() => force((n) => n + 1), 60);
    return () => clearInterval(id);
  }, [ttl]);

  useEffect(() => () => clearTimeout(timer.current), []);

  const send = useCallback(() => {
    const inst = INSTANCES[(Math.random() * INSTANCES.length) | 0];
    const id = seq.current++;

    setMsgs((m) => [...m, { id, inst }].slice(-14));
    setNaive((n) => n + 1);
    setHot(inst);
    setTimeout(() => setHot(null), 260);

    // Redis-style: first message claims the key, later ones just extend the TTL
    if (!owner.current) owner.current = inst;
    pending.current += 1;

    clearTimeout(timer.current);
    const end = Date.now() + WINDOW;
    setTtl({ end, owner: owner.current, count: pending.current });

    timer.current = setTimeout(() => {
      // read the tally before clearing it — the state updater runs later
      const collapsed = pending.current;
      pending.current = 0;
      owner.current = null;
      setJobs((j) => [...j, { id, collapsed }].slice(-8));
      setTtl(null);
    }, WINDOW);
  }, []);

  const burst = useCallback(() => {
    const n = 4 + ((Math.random() * 3) | 0);
    for (let i = 0; i < n; i++) {
      setTimeout(send, i * (140 + Math.random() * 260));
    }
  }, [send]);

  const reset = () => {
    clearTimeout(timer.current);
    pending.current = 0;
    owner.current = null;
    seq.current = 0;
    setMsgs([]);
    setNaive(0);
    setJobs([]);
    setTtl(null);
  };

  const remaining = ttl ? Math.max(0, ttl.end - Date.now()) : 0;
  const pct = ttl ? (remaining / WINDOW) * 100 : 0;
  const collapsed = jobs.reduce((a, j) => a + j.collapsed, 0);
  const saved =
    collapsed > 0 ? Math.round((1 - jobs.length / collapsed) * 100) : 0;

  return (
    <div>
      <div className={styles.head}>
        <div className={styles.headText}>
          <h3>Debounce Lab</h3>
          <p>
            Spam the send button the way a real user spams WhatsApp. Messages
            land on random instances — watch the naive pipeline fire a job for
            every one, while the shared Redis key collapses the whole burst
            into a single processed event.
          </p>
        </div>
        <div className={styles.hud}>
          <div className={styles.stat}>
            <span>messages</span>
            <b>{naive}</b>
          </div>
          <div className={styles.stat}>
            <span>naive jobs</span>
            <b className={styles.bad}>{naive}</b>
          </div>
          <div className={styles.stat}>
            <span>real jobs</span>
            <b className={styles.good}>{jobs.length}</b>
          </div>
          <div className={styles.stat}>
            <span>work saved</span>
            <b className={styles.good}>{saved}%</b>
          </div>
        </div>
      </div>

      <div className={`${styles.board} ${local.board}`}>
        <div className={local.instances}>
          {INSTANCES.map((i) => (
            <div
              key={i}
              className={`${local.instance} ${hot === i ? local.hot : ""} ${
                ttl?.owner === i ? local.owner : ""
              }`}
            >
              <span className={local.instName}>{i}</span>
              <span className={local.instRole}>
                {ttl?.owner === i ? "holds the lock" : "stateless"}
              </span>
            </div>
          ))}
        </div>

        <div className={local.lane}>
          <span className={local.laneLabel}>inbound</span>
          <div className={local.stream}>
            {msgs.map((m) => (
              <span key={m.id} className={local.msg}>
                msg
                <em>{m.inst.replace("instance-", "i")}</em>
              </span>
            ))}
            {!msgs.length && <span className={local.empty}>quiet…</span>}
          </div>
        </div>

        <div className={local.lane}>
          <span className={local.laneLabel}>naive</span>
          <div className={local.stream}>
            {msgs.map((m) => (
              <span key={m.id} className={`${local.job} ${local.jobBad}`}>
                job
              </span>
            ))}
            {!msgs.length && <span className={local.empty}>—</span>}
          </div>
        </div>

        <div className={local.lane}>
          <span className={local.laneLabel}>debounced</span>
          <div className={local.stream}>
            {ttl && (
              <span className={local.window}>
                <i style={{ width: `${pct}%` }} />
                <b>
                  collapsing {ttl.count} · ttl {Math.ceil(remaining)}ms
                </b>
              </span>
            )}
            {jobs.map((j) => (
              <span key={j.id} className={`${local.job} ${local.jobGood}`}>
                job
                <em>×{j.collapsed}</em>
              </span>
            ))}
            {!ttl && !jobs.length && <span className={local.empty}>—</span>}
          </div>
        </div>
      </div>

      <div className={styles.controls}>
        <button
          className={`${styles.btn} ${styles.btnPrimary}`}
          onClick={send}
          onKeyDown={(e) => e.key === "Enter" && e.preventDefault()}
        >
          Send message
        </button>
        <button className={styles.btn} onClick={burst}>
          Simulate a burst
        </button>
        <button className={styles.btn} onClick={reset}>
          Reset
        </button>
        <span className={styles.note}>
          window {WINDOW}ms · extends on every new message
        </span>
      </div>

      <p className={styles.explain}>
        <b>Why this exists:</b> in production this is Redis pipelines plus
        atomic TTL operations. Whichever instance sees the first message claims
        the key; every later message just extends it. One job runs per burst, no
        matter how many servers took part — and no load balancer has to pin the
        user to a box.
      </p>
    </div>
  );
}
