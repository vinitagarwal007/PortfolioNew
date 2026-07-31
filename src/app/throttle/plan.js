/**
 * Throttle scheduling model.
 *
 * A throttled integration runs in cycles. Inside a cycle it fires one job per
 * minute for `time` minutes, then goes quiet for `gap` minutes:
 *
 *   burst per job = batch / time          (2000 over 20 min → 100 per job)
 *   jobs per cycle = time                 (one every minute)
 *   cycle length = time + gap             (20 active + 10 idle = 30 min)
 *
 * Work is split across integrations by sustained capacity, so every lane
 * finishes at roughly the same time instead of one straggling for hours.
 */

export const MAX_JOBS = 6000; // guard rail so an absurd config can't hang the page

export function burstPerJob(integration) {
  return Math.max(1, Math.ceil(integration.batch / Math.max(1, integration.time)));
}

/** Sustained throughput in messages per minute, averaged over a full cycle. */
export function capacity(integration) {
  return integration.batch / Math.max(1, integration.time + integration.gap);
}

export function buildThrottledPlan(total, integrations) {
  if (!integrations.length || total <= 0) return null;

  const caps = integrations.map(capacity);
  const capSum = caps.reduce((a, b) => a + b, 0);

  let assigned = 0;
  const lanes = integrations.map((integration, idx) => {
    const isLast = idx === integrations.length - 1;
    const alloc = isLast
      ? total - assigned
      : Math.round((total * caps[idx]) / capSum);
    assigned += alloc;

    const burst = burstPerJob(integration);
    const jobs = [];
    let remaining = alloc;
    let cycle = 0;

    while (remaining > 0 && jobs.length < MAX_JOBS) {
      const cycleStart = cycle * (integration.time + integration.gap);
      for (let j = 0; j < integration.time && remaining > 0; j++) {
        const size = Math.min(burst, remaining);
        jobs.push({ t: cycleStart + j, size });
        remaining -= size;
      }
      cycle += 1;
    }

    const finish = jobs.length ? jobs[jobs.length - 1].t + 1 : 0;
    return {
      integration,
      alloc,
      burst,
      jobs,
      cycles: cycle,
      finish,
      truncated: remaining > 0,
    };
  });

  const finish = Math.max(1, ...lanes.map((l) => l.finish));

  // cumulative delivered-over-time series, one point per dispatching minute
  const perMinute = new Map();
  lanes.forEach((l) =>
    l.jobs.forEach((j) => perMinute.set(j.t, (perMinute.get(j.t) || 0) + j.size))
  );
  const series = [{ t: 0, v: 0 }];
  let running = 0;
  [...perMinute.keys()]
    .sort((a, b) => a - b)
    .forEach((t) => {
      running += perMinute.get(t);
      series.push({ t: t + 1, v: running });
    });

  return {
    mode: "throttled",
    lanes,
    finish,
    series,
    delivered: running,
    rejected: 0,
    total,
  };
}

/**
 * No throttling: every allocated message is handed to the vendor at once.
 * Only what fits inside the vendor's per-minute ceiling is accepted; the rest
 * is rejected, and a large enough overrun gets the sender temporarily blocked.
 */
export function buildUnthrottledPlan(total, integrations) {
  if (!integrations.length || total <= 0) return null;

  const share = Math.floor(total / integrations.length);
  let assigned = 0;

  const lanes = integrations.map((integration, idx) => {
    const isLast = idx === integrations.length - 1;
    const alloc = isLast ? total - assigned : share;
    assigned += alloc;

    const ceiling = integration.tps * 60; // messages the vendor will take in a minute
    const accepted = Math.min(alloc, ceiling);
    const rejected = alloc - accepted;

    return {
      integration,
      alloc,
      burst: alloc,
      accepted,
      rejected,
      blocked: alloc > ceiling,
      ceiling,
      jobs: [{ t: 0, size: alloc }],
      cycles: 1,
      finish: rejected > 0 ? 15 : 1, // blocked lanes sit in penalty for 15 min
    };
  });

  const delivered = lanes.reduce((a, l) => a + l.accepted, 0);
  const rejected = lanes.reduce((a, l) => a + l.rejected, 0);
  const finish = Math.max(...lanes.map((l) => l.finish));

  return {
    mode: "unthrottled",
    lanes,
    finish,
    series: [
      { t: 0, v: 0 },
      { t: 1, v: delivered },
      { t: finish, v: delivered },
    ],
    delivered,
    rejected,
    total,
  };
}

export function formatDuration(minutes) {
  const m = Math.max(0, Math.round(minutes));
  const h = Math.floor(m / 60);
  const rem = m % 60;
  if (h === 0) return `${rem}m`;
  if (rem === 0) return `${h}h`;
  return `${h}h ${rem}m`;
}

export function formatClock(minutes) {
  const m = Math.max(0, Math.floor(minutes));
  return `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
}
