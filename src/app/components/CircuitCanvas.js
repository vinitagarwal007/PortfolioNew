"use client";
import { useEffect, useRef } from "react";

/**
 * PCB-style background: traces routed on a grid at 0/45/90 degrees, pads at
 * every junction, and packets that travel along the copper as bright dashes.
 *
 * The board itself is drawn once into an offscreen canvas and blitted each
 * frame, so the per-frame cost is only the packets.
 */
export default function CircuitCanvas({ className }) {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const GRID = 28;
    const TAIL = 34;

    let w = 0;
    let h = 0;
    let dpr = 1;
    let raf = 0;
    let running = true;
    let last = 0;
    let traces = [];
    let packets = [];
    let board = null;

    const rand = (n) => (Math.random() * n) | 0;

    // 8 directions, so turns are always 45 or 90 degrees like real routing
    const DIRS = [
      [1, 0],
      [1, 1],
      [0, 1],
      [-1, 1],
      [-1, 0],
      [-1, -1],
      [0, -1],
      [1, -1],
    ];

    function makeTrace(cells) {
      const pts = cells.map(([x, y]) => ({ x: x * GRID, y: y * GRID }));
      const segs = [];
      let total = 0;
      for (let i = 1; i < pts.length; i++) {
        const len = Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y);
        if (len === 0) continue;
        segs.push({ a: pts[i - 1], b: pts[i], len, start: total });
        total += len;
      }
      return { pts, segs, total };
    }

    function buildTraces() {
      traces = [];
      const cols = Math.max(4, Math.floor(w / GRID));
      const rows = Math.max(4, Math.floor(h / GRID));
      const count = Math.max(10, Math.min(40, Math.round((w * h) / 24000)));

      for (let i = 0; i < count; i++) {
        let cx = rand(cols);
        let cy = rand(rows);
        let d = rand(4) * 2; // start on a cardinal direction
        const cells = [[cx, cy]];
        const segments = 3 + rand(5);

        for (let s = 0; s < segments; s++) {
          const [dx, dy] = DIRS[d];
          const len = 2 + rand(6);
          const nx = cx + dx * len;
          const ny = cy + dy * len;
          if (nx < 0 || ny < 0 || nx > cols || ny > rows) break;
          cells.push([nx, ny]);
          cx = nx;
          cy = ny;
          d = (d + (Math.random() < 0.5 ? 1 : 7)) % 8; // turn 45 either way
        }

        if (cells.length > 1) traces.push(makeTrace(cells));
      }
    }

    function drawBoard() {
      board = document.createElement("canvas");
      board.width = Math.floor(w * dpr);
      board.height = Math.floor(h * dpr);
      const b = board.getContext("2d");
      b.setTransform(dpr, 0, 0, dpr, 0, 0);

      // copper
      b.lineWidth = 1.2;
      b.lineCap = "round";
      b.lineJoin = "round";
      b.strokeStyle = "rgba(78, 225, 193, 0.16)";
      traces.forEach((tr) => {
        b.beginPath();
        b.moveTo(tr.pts[0].x, tr.pts[0].y);
        for (let i = 1; i < tr.pts.length; i++) b.lineTo(tr.pts[i].x, tr.pts[i].y);
        b.stroke();
      });

      // pads at every junction, squares at the ends
      traces.forEach((tr) => {
        tr.pts.forEach((p, i) => {
          const end = i === 0 || i === tr.pts.length - 1;
          b.beginPath();
          if (end) {
            b.rect(p.x - 3, p.y - 3, 6, 6);
          } else {
            b.arc(p.x, p.y, 2.4, 0, Math.PI * 2);
          }
          b.fillStyle = "rgba(6, 8, 11, 0.95)";
          b.fill();
          b.lineWidth = 1.1;
          b.strokeStyle = end
            ? "rgba(139, 124, 255, 0.4)"
            : "rgba(78, 225, 193, 0.3)";
          b.stroke();
        });
      });
    }

    function pointAt(tr, d) {
      for (const s of tr.segs) {
        if (d <= s.start + s.len) {
          const t = (d - s.start) / s.len;
          return { x: s.a.x + (s.b.x - s.a.x) * t, y: s.a.y + (s.b.y - s.a.y) * t };
        }
      }
      const p = tr.pts[tr.pts.length - 1];
      return { x: p.x, y: p.y };
    }

    /** Stroke only the slice of a trace between two distances along it. */
    function strokeRange(tr, from, to) {
      ctx.beginPath();
      let started = false;
      for (const s of tr.segs) {
        const s0 = s.start;
        const s1 = s.start + s.len;
        if (s1 < from || s0 > to) continue;
        const t0 = Math.max(0, (from - s0) / s.len);
        const t1 = Math.min(1, (to - s0) / s.len);
        const ax = s.a.x + (s.b.x - s.a.x) * t0;
        const ay = s.a.y + (s.b.y - s.a.y) * t0;
        const bx = s.a.x + (s.b.x - s.a.x) * t1;
        const by = s.a.y + (s.b.y - s.a.y) * t1;
        if (!started) {
          ctx.moveTo(ax, ay);
          started = true;
        }
        ctx.lineTo(bx, by);
      }
      if (started) ctx.stroke();
    }

    function spawn(fresh) {
      if (!traces.length) return;
      const tr = traces[rand(traces.length)];
      packets.push({
        tr,
        d: fresh ? Math.random() * tr.total : -TAIL,
        speed: 34 + Math.random() * 62,
        violet: Math.random() < 0.28,
      });
    }

    function seedPackets() {
      packets = [];
      const n = Math.max(5, Math.min(18, Math.round(traces.length * 0.55)));
      for (let i = 0; i < n; i++) spawn(true);
    }

    function frame(ts) {
      if (!running) return;
      const dt = Math.min(60, ts - (last || ts));
      last = ts;

      ctx.clearRect(0, 0, w, h);
      if (board) ctx.drawImage(board, 0, 0, w, h);

      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      for (let i = packets.length - 1; i >= 0; i--) {
        const p = packets[i];
        p.d += (p.speed * dt) / 1000;
        if (p.d - TAIL > p.tr.total) {
          packets.splice(i, 1);
          spawn(false);
          continue;
        }

        const hue = p.violet ? "139, 124, 255" : "78, 225, 193";

        // trailing charge
        ctx.strokeStyle = `rgba(${hue}, 0.22)`;
        ctx.lineWidth = 2.6;
        strokeRange(p.tr, Math.max(0, p.d - TAIL), Math.max(0, p.d));

        // bright head
        ctx.strokeStyle = `rgba(${hue}, 0.95)`;
        ctx.lineWidth = 2;
        strokeRange(p.tr, Math.max(0, p.d - 9), Math.max(0, p.d));

        if (p.d >= 0 && p.d <= p.tr.total) {
          const head = pointAt(p.tr, p.d);
          const glow = ctx.createRadialGradient(head.x, head.y, 0, head.x, head.y, 9);
          glow.addColorStop(0, `rgba(${hue}, 0.9)`);
          glow.addColorStop(1, `rgba(${hue}, 0)`);
          ctx.fillStyle = glow;
          ctx.beginPath();
          ctx.arc(head.x, head.y, 9, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      raf = requestAnimationFrame(frame);
    }

    function fit() {
      const rect = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = rect.width;
      h = rect.height;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      buildTraces();
      drawBoard();
      seedPackets();
    }

    /** Paint the board synchronously so there's never a blank frame. */
    function paintBoard() {
      ctx.clearRect(0, 0, w, h);
      if (board) ctx.drawImage(board, 0, 0, w, h);
    }

    fit();
    paintBoard();

    if (!reduced) raf = requestAnimationFrame(frame);

    const onResize = () => {
      cancelAnimationFrame(raf);
      fit();
      paintBoard();
      if (!reduced) {
        last = 0;
        raf = requestAnimationFrame(frame);
      }
    };
    window.addEventListener("resize", onResize);

    /**
     * Past the landing screen the board recedes: it fades to half strength and
     * goes soft, so content sits on a quiet backdrop instead of live circuitry.
     * Opacity/filter/transform are compositor-only, so this is cheap enough to
     * run straight off the scroll event.
     */
    const BASE_OPACITY = 0.62;
    const applyScroll = () => {
      const vh = window.innerHeight || 1;
      const p = Math.min(1, Math.max(0, window.scrollY / (vh * 0.8)));
      canvas.style.opacity = (BASE_OPACITY * (1 - 0.5 * p)).toFixed(3);
      canvas.style.filter = p > 0.002 ? `blur(${(p * 3.6).toFixed(2)}px)` : "none";
      // a hair of scale hides the soft edge blur pulls in from outside the canvas
      canvas.style.transform = p > 0.002 ? `scale(${(1 + p * 0.02).toFixed(4)})` : "none";
    };
    applyScroll();
    window.addEventListener("scroll", applyScroll, { passive: true });

    const onVisibility = () => {
      if (reduced) return;
      if (document.hidden) {
        running = false;
        cancelAnimationFrame(raf);
      } else if (!running) {
        running = true;
        last = 0;
        raf = requestAnimationFrame(frame);
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", applyScroll);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return <canvas ref={ref} className={className} aria-hidden="true" />;
}
