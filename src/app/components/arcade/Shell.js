"use client";
import { useEffect, useRef, useState } from "react";
import styles from "./Arcade.module.css";
import local from "./Shell.module.css";
import { profile, skills, stats } from "@/data/site";

const FILES = {
  "about.txt": [
    "Vinit Agarwal — backend engineer, Reconect.ai.",
    "I design distributed communication infrastructure: batching, throttling,",
    "idempotency, delivery guarantees. Mostly Python. Occasionally too much Redis.",
  ],
  "now.md": [
    "# now",
    "- owning the communication service (10M+ calls/day)",
    "- paying down my own technical debt, on purpose",
    "- reading about consensus protocols instead of sleeping",
  ],
  "contact.card": [
    `email    ${profile.email}`,
    `github   ${profile.socials.github}`,
    `linkedin ${profile.socials.linkedin}`,
  ],
};

const BANNER = [
  "  ╭──────────────────────────────────────────╮",
  "  │  vinit.sys — interactive shell  v2.0     │",
  "  ╰──────────────────────────────────────────╯",
  "type `help` to see what's wired up.",
];

export default function Shell() {
  const [lines, setLines] = useState(() =>
    BANNER.map((text) => ({ type: "sys", text }))
  );
  const [value, setValue] = useState("");
  const [history, setHistory] = useState([]);
  const [hIdx, setHIdx] = useState(-1);
  const bodyRef = useRef(null);
  const inputRef = useRef(null);
  const timers = useRef([]);

  useEffect(() => {
    if (bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
    }
  }, [lines]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const push = (entries) =>
    setLines((prev) => [...prev, ...entries].slice(-220));

  const later = (fn, ms) => {
    timers.current.push(setTimeout(fn, ms));
  };

  function run(raw) {
    const input = raw.trim();
    push([{ type: "in", text: input }]);
    if (!input) return;

    setHistory((h) => [input, ...h].slice(0, 40));
    setHIdx(-1);

    const [cmd, ...args] = input.split(/\s+/);
    const out = (text, type = "out") => push([{ type, text }]);

    switch (cmd.toLowerCase()) {
      case "help":
        push(
          [
            "whoami            who is typing this",
            "ls                list files",
            "cat <file>        read a file",
            "skills            the toolbox, grouped",
            "scale             numbers I'm responsible for",
            "ping <host>       check something is alive",
            "uptime            how long this has been going",
            "resume            open the PDF",
            "contact           how to reach me",
            "clear             wipe the screen",
          ].map((text) => ({ type: "out", text }))
        );
        break;

      case "whoami":
        out(`${profile.name} — ${profile.role}`);
        out(profile.tagline, "dim");
        break;

      case "ls":
        out(Object.keys(FILES).join("   "));
        break;

      case "cat": {
        const file = args[0];
        if (!file) return out("cat: missing operand", "err");
        const content = FILES[file];
        if (!content) return out(`cat: ${file}: no such file`, "err");
        push(content.map((text) => ({ type: "out", text })));
        break;
      }

      case "skills":
        push(
          skills.map((g) => ({
            type: "out",
            text: `${g.group.padEnd(14)} ${g.items.join(", ")}`,
          }))
        );
        break;

      case "scale":
        push(
          stats.map((s) => ({
            type: "out",
            text: `${String(s.value).padEnd(8)} ${s.label} — ${s.note}`,
          }))
        );
        break;

      case "ping": {
        const host = args[0] || "comm-core";
        out(`PING ${host} — 4 packets`, "dim");
        for (let i = 0; i < 4; i++) {
          later(() => {
            const ms = (8 + Math.random() * 26).toFixed(1);
            out(`64 bytes from ${host}: seq=${i} time=${ms} ms`);
            if (i === 3) out("4 sent, 4 received, 0% loss", "dim");
          }, 260 * (i + 1));
        }
        break;
      }

      case "uptime":
        out("14 months, 713 commits, 0 unrecoverable incidents", "dim");
        break;

      case "resume":
        out("opening résumé…", "dim");
        later(() => window.open(profile.resume, "_blank", "noopener"), 350);
        break;

      case "contact":
        push(FILES["contact.card"].map((text) => ({ type: "out", text })));
        break;

      case "sudo":
        out("nice try. this shell has no root — that's rather the point.", "err");
        break;

      case "coffee":
        out("brewing… ☕ (this is the only synchronous call I permit)");
        break;

      case "clear":
        setLines([]);
        break;

      case "echo":
        out(args.join(" "));
        break;

      case "exit":
        out("you can't exit a portfolio. scroll instead.", "dim");
        break;

      default:
        out(`${cmd}: command not found — try \`help\``, "err");
    }
  }

  const onKeyDown = (e) => {
    if (e.key === "Enter") {
      run(value);
      setValue("");
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const next = Math.min(hIdx + 1, history.length - 1);
      if (next >= 0) {
        setHIdx(next);
        setValue(history[next]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const next = hIdx - 1;
      setHIdx(next);
      setValue(next >= 0 ? history[next] : "");
    }
  };

  return (
    <div>
      <div className={styles.head}>
        <div className={styles.headText}>
          <h3>Shell</h3>
          <p>
            A small interactive résumé for people who&apos;d rather type than
            scroll. Try <code>whoami</code>, <code>ls</code>,{" "}
            <code>ping meta</code> — or <code>sudo</code>, if you must.
          </p>
        </div>
      </div>

      <div
        className={`${styles.board} ${local.term}`}
        onClick={() => inputRef.current?.focus()}
      >
        <div className={local.bar}>
          <span className={local.dots}>
            <i />
            <i />
            <i />
          </span>
          <span className={local.barTitle}>vinit@portfolio: ~</span>
        </div>

        <div className={`${local.body} thin-scroll`} ref={bodyRef}>
          {lines.map((l, i) => (
            <p key={i} className={local[l.type] || local.out}>
              {l.type === "in" && <span className={local.prompt}>❯</span>}
              {l.text}
            </p>
          ))}

          <div className={local.inputRow}>
            <span className={local.prompt}>❯</span>
            <input
              ref={inputRef}
              className={local.input}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={onKeyDown}
              spellCheck="false"
              autoComplete="off"
              aria-label="Terminal input"
              placeholder="type a command…"
            />
          </div>
        </div>
      </div>

      <p className={styles.explain}>
        <b>Why this exists:</b> because a CLI is still the nicest interface ever
        designed, and because you should be able to <code>cat</code> someone&apos;s
        résumé.
      </p>
    </div>
  );
}
