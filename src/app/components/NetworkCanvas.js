"use client";
import { useEffect, useRef } from "react";

/**
 * Ambient "cluster" background: drifting nodes, links that fade with distance,
 * and packets that traverse live links. Pointer acts as a gentle attractor.
 */
export default function NetworkCanvas({ className }) {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let w = 0;
    let h = 0;
    let dpr = 1;
    let nodes = [];
    let packets = [];
    let raf = 0;
    let running = true;
    const pointer = { x: -9999, y: -9999, active: false };

    const LINK_DIST = 148;

    function resize() {
      const rect = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = rect.width;
      h = rect.height;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
    }

    function seed() {
      const density = Math.round((w * h) / 17000);
      const count = Math.max(22, Math.min(70, density));
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.22,
        vy: (Math.random() - 0.5) * 0.22,
        r: Math.random() * 1.5 + 1,
        hub: Math.random() < 0.14,
      }));
      packets = [];
    }

    function spawnPacket() {
      if (nodes.length < 2 || packets.length > 16) return;
      const a = (Math.random() * nodes.length) | 0;
      let b = (Math.random() * nodes.length) | 0;
      if (a === b) b = (b + 1) % nodes.length;
      const dx = nodes[a].x - nodes[b].x;
      const dy = nodes[a].y - nodes[b].y;
      if (dx * dx + dy * dy > LINK_DIST * LINK_DIST * 2.2) return;
      packets.push({ a, b, t: 0, speed: 0.006 + Math.random() * 0.012 });
    }

    function frame() {
      if (!running) return;
      ctx.clearRect(0, 0, w, h);

      for (const n of nodes) {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > w) n.vx *= -1;
        if (n.y < 0 || n.y > h) n.vy *= -1;

        if (pointer.active) {
          const dx = pointer.x - n.x;
          const dy = pointer.y - n.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < 26000 && d2 > 1) {
            const f = 0.045 / Math.sqrt(d2);
            n.vx += dx * f;
            n.vy += dy * f;
          }
        }
        // keep drift bounded
        const sp = Math.hypot(n.vx, n.vy);
        if (sp > 0.55) {
          n.vx = (n.vx / sp) * 0.55;
          n.vy = (n.vy / sp) * 0.55;
        }
      }

      // links
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const d = Math.hypot(dx, dy);
          if (d > LINK_DIST) continue;
          const alpha = (1 - d / LINK_DIST) * 0.3;
          ctx.strokeStyle = `rgba(120, 200, 190, ${alpha})`;
          ctx.lineWidth = 0.7;
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.stroke();
        }
      }

      // nodes
      for (const n of nodes) {
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.hub ? n.r * 1.9 : n.r, 0, Math.PI * 2);
        ctx.fillStyle = n.hub
          ? "rgba(139, 124, 255, 0.85)"
          : "rgba(200, 226, 224, 0.55)";
        ctx.fill();
        if (n.hub) {
          ctx.beginPath();
          ctx.arc(n.x, n.y, n.r * 4.6, 0, Math.PI * 2);
          ctx.strokeStyle = "rgba(139, 124, 255, 0.16)";
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }

      // packets
      for (let i = packets.length - 1; i >= 0; i--) {
        const p = packets[i];
        const a = nodes[p.a];
        const b = nodes[p.b];
        if (!a || !b) {
          packets.splice(i, 1);
          continue;
        }
        p.t += p.speed;
        if (p.t >= 1) {
          packets.splice(i, 1);
          continue;
        }
        const x = a.x + (b.x - a.x) * p.t;
        const y = a.y + (b.y - a.y) * p.t;
        const glow = ctx.createRadialGradient(x, y, 0, x, y, 7);
        glow.addColorStop(0, "rgba(78, 225, 193, 0.95)");
        glow.addColorStop(1, "rgba(78, 225, 193, 0)");
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(x, y, 7, 0, Math.PI * 2);
        ctx.fill();
      }

      if (Math.random() < 0.09) spawnPacket();
      raf = requestAnimationFrame(frame);
    }

    function onPointerMove(e) {
      const rect = canvas.getBoundingClientRect();
      pointer.x = e.clientX - rect.left;
      pointer.y = e.clientY - rect.top;
      pointer.active = true;
    }
    function onPointerLeave() {
      pointer.active = false;
      pointer.x = pointer.y = -9999;
    }

    resize();

    if (reduced) {
      // draw a single static frame, no animation loop
      running = true;
      frame();
      running = false;
      cancelAnimationFrame(raf);
    } else {
      frame();
      window.addEventListener("pointermove", onPointerMove, { passive: true });
      window.addEventListener("pointerleave", onPointerLeave);
    }

    const onResize = () => {
      cancelAnimationFrame(raf);
      resize();
      if (!reduced) frame();
    };
    window.addEventListener("resize", onResize);

    const onVisibility = () => {
      if (reduced) return;
      if (document.hidden) {
        running = false;
        cancelAnimationFrame(raf);
      } else if (!running) {
        running = true;
        frame();
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerleave", onPointerLeave);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return <canvas ref={ref} className={className} aria-hidden="true" />;
}
