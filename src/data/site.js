// Single source of truth for every piece of copy on the site.
//
// Note on naming: services below use descriptive names + neutral slugs rather
// than internal repository names. Swap `slug`/`name` here if you ever want the
// real repo names on the public site.

export const profile = {
  name: "Vinit Agarwal",
  role: "Distributed Systems Engineer",
  tagline: "I build the plumbing that stays up when everything else spikes.",
  blurb:
    "Backend engineer at Reconect.ai. I designed the communication framework that 10M+ API calls a day pass through — 8+ provider integrations normalised behind one static interface, so the systems calling it never decide how anything gets sent.",
  location: "Bhubaneswar / Remote, India",
  email: "vinitagarwal.garg@gmail.com",
  resume:
    "https://drive.google.com/file/d/1O2QuGhC27nJWt_5Z6CVi7_ILPmyZI6LE/view?usp=drive_link",
  socials: {
    github: "https://github.com/vinitagarwal007",
    linkedin: "https://linkedin.com/in/vinit-agarwal007",
    medium: "https://medium.com/@vinitagarwal007",
    mail: "mailto:vinitagarwal.garg@gmail.com",
  },
  roles: [
    "distributed systems",
    "event-driven backends",
    "async Python at scale",
    "multi-tenant infrastructure",
  ],
};

export const stats = [
  { value: "10M+", label: "API calls / day", note: "communication service" },
  { value: "9", label: "services owned", note: "bootstrapped end to end" },
  { value: "8+", label: "integrations", note: "one static interface" },
  { value: "139k", label: "lines shipped", note: "713 commits, 14 months" },
];

// ---------------------------------------------------------------------------
// The communication framework — the headline piece of design work
// ---------------------------------------------------------------------------

export const framework = {
  eyebrow: "Designed and built from scratch",
  title: "One static interface. Eight providers. The caller never knows which.",
  lede: "The communication layer's real job was never sending messages — it was abstraction. I designed a framework that normalises every provider's routing, payload shape, auth scheme and delivery semantics behind one static interface. Systems that use it don't decide anything: they call it, and the orchestration is handled underneath.",

  contract:
    "Each integration is free to do whatever its vendor demands internally — its own auth dance, its own endpoints, its own parsing. What it is not free to do is invent an output. Every implementation returns a defined Pydantic model, and that typed object is what the pipeline processes onward into the standard format the rest of the application already understands. A voice integration reporting call_completed becomes ANSWERED before it ever leaves the boundary; nothing upstream has ever heard of call_completed. That translation is the whole point of the abstraction.",

  pillars: [
    {
      title: "A single static contract",
      body: "Every provider implements the same interface — dispatch, template resolution, delivery-receipt normalisation, error mapping. The implementation is selected at runtime by key, and the core pipeline holds no vendor branches at all.",
    },
    {
      title: "Vendor methods in, typed models out",
      body: "An integration may parse XML, chase a rotating session key or unwrap four levels of envelope — its business. It must return a defined Pydantic model, which the pipeline then processes into the one standard format every other part of the system reads.",
    },
    {
      title: "Provider-wise mapping to standard system variables",
      body: "Eight-plus integrations, each with its own dialect, get mapped provider-by-provider onto one canonical set of system variables and one processing path. Downstream code reads the same fields no matter who sent them.",
    },
    {
      title: "Orchestration lives below the line",
      body: "Batching, throttling to each vendor's TPS ceiling, retries, callback correlation and status roll-up all happen inside the framework. The caller says what to send, never how to send it.",
    },
    {
      title: "Plug and play, both directions",
      body: "A brand-new provider is an implementation plus a config model and a mapping — nothing in the routing changes. An already-integrated provider for a new client is credentials in a config screen: zero code, zero deploy.",
    },
  ],

  // Illustrative payload shapes: the point is that they disagree with each
  // other, and that the canonical output does not.
  providers: [
    {
      name: "Meta WhatsApp",
      transport: "Deeply nested JSON webhook",
      auth: "App secret + signature",
      raw: `{
  "entry": [{
    "changes": [{
      "value": {
        "statuses": [{
          "id": "wamid.HBgMOTE5…",
          "status": "delivered",
          "timestamp": "1781794951",
          "recipient_id": "919204441162"
        }]
      }
    }]
  }]
}`,
      canonical: {
        provider: "meta",
        channel: "whatsapp",
        reference: "wamid.HBgMOTE5…",
        recipient: "+919204441162",
        event: "DELIVERED",
        reason: null,
        retryable: false,
      },
    },
    {
      name: "Kaleyra",
      transport: "Flat JSON",
      auth: "API key header",
      raw: `{
  "id": "kly_9f31c0a7",
  "status": "DELIVRD",
  "to": "+919204441162",
  "delivered_on": "2026-06-14 11:02:31",
  "error_code": null
}`,
      canonical: {
        provider: "kaleyra",
        channel: "sms",
        reference: "kly_9f31c0a7",
        recipient: "+919204441162",
        event: "DELIVERED",
        reason: null,
        retryable: false,
      },
    },
    {
      name: "TCN",
      transport: "Form-encoded POST",
      auth: "Basic auth",
      raw: `call_id=8831077
&disposition=PTP
&agent_id=bot-04
&duration=71
&hangup_cause=NORMAL_CLEARING`,
      canonical: {
        provider: "tcn",
        channel: "voice",
        reference: "8831077",
        recipient: null,
        event: "ANSWERED",
        reason: "PTP",
        retryable: false,
      },
    },
    {
      name: "ConVox",
      transport: "JSON, vendor field names",
      auth: "Static token",
      raw: `{
  "uniqueid": "1781794882.4471",
  "dispo": "RNR",
  "cust_no": "9204441162",
  "call_duration": "0"
}`,
      canonical: {
        provider: "convox",
        channel: "voice",
        reference: "1781794882.4471",
        recipient: "+919204441162",
        event: "FAILED",
        reason: "NO_ANSWER",
        retryable: true,
      },
    },
    {
      name: "Exotel",
      transport: "Query-string callback",
      auth: "Signed URL",
      raw: `Status=completed
&CallSid=6a1f0c9b8e
&To=%2B919204441162
&Duration=48
&RecordingUrl=https%3A%2F%2F…`,
      canonical: {
        provider: "exotel",
        channel: "voice",
        reference: "6a1f0c9b8e",
        recipient: "+919204441162",
        event: "ANSWERED",
        reason: null,
        retryable: false,
      },
    },
    {
      name: "Intalk",
      transport: "PascalCase JSON",
      auth: "Bearer token",
      raw: `{
  "CallId": "IN-77120934",
  "CallStatus": "NOANSWER",
  "CustomerNumber": "919204441162",
  "AttemptCount": 2
}`,
      canonical: {
        provider: "intalk",
        channel: "voice",
        reference: "IN-77120934",
        recipient: "+919204441162",
        event: "FAILED",
        reason: "NO_ANSWER",
        retryable: true,
      },
    },
    {
      name: "Intalk CTC",
      transport: "Click-to-call variant",
      auth: "Bearer token",
      raw: `{
  "ctcRefId": "CTC-4410882",
  "state": "CONNECTED",
  "msisdn": "919204441162",
  "legs": { "agent": "up", "customer": "up" }
}`,
      canonical: {
        provider: "intalk_ctc",
        channel: "voice",
        reference: "CTC-4410882",
        recipient: "+919204441162",
        event: "ANSWERED",
        reason: null,
        retryable: false,
      },
    },
    {
      name: "Slice",
      transport: "Enterprise envelope",
      auth: "Vault-resolved bearer",
      raw: `{
  "event": {
    "type": "CALL_LOG",
    "payload": {
      "loanCode": "L-8812004",
      "callStatus": "ANSWERED",
      "mobile": "9204441162"
    }
  }
}`,
      canonical: {
        provider: "slice",
        channel: "voice",
        reference: "L-8812004",
        recipient: "+919204441162",
        event: "ANSWERED",
        reason: null,
        retryable: false,
      },
    },
  ],

  // Many vendor vocabularies, one set of words the application actually knows.
  vocabulary: [
    {
      from: ["completed", "call_completed", "ANSWERED"],
      to: "ANSWERED",
      tone: "good",
    },
    { from: ["delivered", "DELIVRD", "status=2"], to: "DELIVERED", tone: "good" },
    { from: ["RNR", "NOANSWER", "no_answer"], to: "FAILED · NO_ANSWER", tone: "bad" },
    { from: ["invalid_number", "BLOCKED", "carrier_reject"], to: "FAILED · terminal", tone: "bad" },
    { from: ["timeout", "queue drop", "pre-call error"], to: "DROPPED · retryable", tone: "warn" },
  ],

  outcomes: [
    ["8+", "integrations behind one interface"],
    ["0", "vendor branches in the core pipeline"],
    ["days", "to add a provider, not months"],
    ["config only", "to enable an existing one"],
  ],
};

// ---------------------------------------------------------------------------
// Architecture map
// ---------------------------------------------------------------------------

export const layers = [
  { id: "ingress", label: "Ingress", color: "var(--accent)" },
  { id: "core", label: "Core", color: "var(--violet)" },
  { id: "egress", label: "Egress", color: "var(--amber)" },
  { id: "runtime", label: "Agent runtime", color: "var(--rose)" },
  { id: "tenant", label: "Tenant isolated", color: "var(--dim)" },
];

// x/y are percentages inside the map viewport.
export const services = [
  {
    id: "ingest",
    name: "Allocation & Payment Ingest",
    slug: "webhook-ingest",
    layer: "ingress",
    stack: ["FastAPI", "Postgres", "DynamoDB"],
    x: 10,
    y: 26,
    summary:
      "Accepts enterprise allocation pushes, payment events and debt-account updates from client data feeds.",
    built: [
      "Decimal-over-float migration for every monetary field — rounding drift on outstanding balances is a compliance problem, not a rounding problem.",
      "Async request-logging middleware writing to DynamoDB, so a malformed client push is reproducible after the fact.",
      "Predue vs overdue validation, duplicate-aware upsert semantics, and DPD bucket routing for segmented campaigns.",
    ],
    metrics: [
      ["Commits", "34"],
      ["Net lines", "+5.0k"],
      ["Window", "May 2025 → Jun 2026"],
    ],
  },
  {
    id: "dlr",
    name: "Callback Multiplexer",
    slug: "dlr-multiplexer",
    layer: "ingress",
    stack: ["FastAPI", "Pydantic", "Redis"],
    x: 10,
    y: 68,
    summary:
      "One edge service swallowing delivery receipts, WhatsApp replies and simulator callbacks from every vendor, and normalising them into a single canonical event.",
    built: [
      "Thin ingress routers per vendor (Meta, Kaleyra, Exotel, Intalk, ConVox, Slice), each implementing the same static mapping interface — the routing layer never learns a vendor's name.",
      "Every payload shape collapses into one DLR schema, so downstream billing sees identical events regardless of who sent them.",
      "Pathframe state tracking keyed by trigger id, correlating async vendor callbacks back to the originating bot session.",
    ],
    metrics: [
      ["Commits", "49"],
      ["Vendors normalised", "8"],
      ["Payload shapes", "1 canonical"],
    ],
  },
  {
    id: "core",
    name: "Orchestration Engine",
    slug: "comm-core",
    layer: "core",
    stack: ["Django", "Celery", "Postgres", "Redis"],
    x: 41,
    y: 30,
    summary:
      "The monolith that owns campaign execution, communication batching, context assembly and analytics export. Every outbound call, SMS and WhatsApp message starts or ends here.",
    built: [
      "A batch handler with channel-wise multiplexing and a dual-path pipeline: a fast path for single ad-hoc triggers, a batch path for everything else.",
      "A throttled executor that splits huge trigger arrays into staggered sub-batches sized to each vendor's TPS ceiling.",
      "Batch lifecycle APIs — status reporting without N+1, atomic cancellation under row-level locks, and redial that copies only retryable triggers into a new batch with clean lineage.",
      "Context layer refactor: a single read facade, side-effect-free builders, and ORM models that never cross the API wire.",
    ],
    metrics: [
      ["Commits", "522"],
      ["Lines", "+116k / −55k"],
      ["Files touched", "430"],
    ],
    primary: true,
  },
  {
    id: "dtos",
    name: "Shared Contract Layer",
    slug: "common-dtos",
    layer: "core",
    stack: ["Pydantic", "Poetry"],
    x: 41,
    y: 74,
    summary:
      "A versioned schema library consumed by six services. It exists so wire formats can't drift apart in the dark.",
    built: [
      "Polymorphic campaign allocation: a base identity with collection and generic subtypes, resolved left-to-right so strict parsing is attempted before the permissive fallback.",
      "Bot init context carrying EMI, penalty, bounce and max-waiver fields straight into the LLM prompt window at runtime.",
      "Semver-by-pinned-git-ref across every consumer, so a breaking schema change can't silently roll out to six repos at once.",
    ],
    metrics: [
      ["Consumers", "6 services"],
      ["Commits", "31"],
      ["Wire-format drift", "0"],
    ],
  },
  {
    id: "proxy",
    name: "CRM Translation Gateway",
    slug: "webhook-egress",
    layer: "egress",
    stack: ["FastAPI", "Azure Key Vault", "DynamoDB"],
    x: 72,
    y: 20,
    summary:
      "Translates internal disposition and call-log events into whatever shape each tenant's CRM insists on.",
    built: [
      "Router-per-tenant isolation with environment-based routing and a test-mode base URL override.",
      "Egress auth tokens resolved at runtime from Azure Key Vault through a tenant secret manager — no credential is ever coupled to a class.",
      "Exponential-backoff retry queue, up to 10 attempts, giving at-least-once delivery across flaky external CRMs.",
    ],
    metrics: [
      ["Commits", "30"],
      ["Retry ceiling", "10 (exp backoff)"],
      ["Delivery", "at-least-once"],
    ],
  },
  {
    id: "tracker",
    name: "Link Tracking Service",
    slug: "link-tracker",
    layer: "egress",
    stack: ["FastAPI", "Azure Service Bus", "Redis"],
    x: 72,
    y: 55,
    summary:
      "Async redirect service capturing payment-link clicks and publishing them to a bus for attribution and billing analytics.",
    built: [
      "Redis-cached Auth0 M2M tokens so a click redirect never pays for a token round trip.",
      "Pooled Service Bus connections and rate limiting on the redirect path — the hot path is the one that must not block.",
      "Click-through attribution ties a campaign to a conversion event, which is what makes campaign ROI reporting possible at all.",
    ],
    metrics: [
      ["Bootstrapped in", "1 service, 21 files"],
      ["Transport", "Azure Service Bus"],
      ["Hot path", "fully async"],
    ],
  },
  {
    id: "simulator",
    name: "Realtime Agent Simulator",
    slug: "agent-simulator",
    layer: "runtime",
    stack: ["Socket.IO", "FastAPI", "JWT"],
    x: 72,
    y: 88,
    summary:
      "A stateless conversational sandbox for QA and pre-sales, hydrated entirely from a signed token instead of a database.",
    built: [
      "Pivoted the service from HTTP to real-time Socket.IO with API-key verification and a test-session message store.",
      "Token-based state transfer: the backend pre-computes the whole conversation context and injects it into a JWT, so the simulator hydrates a live session with zero DB reads.",
      "Every session is ephemeral — when the socket drops or the token expires, the state is gone. No test data ever bleeds into production analytics.",
    ],
    metrics: [
      ["DB reads / session", "0"],
      ["Isolation", "100%"],
      ["Lines pivoted", "+5.2k / −1.5k"],
    ],
  },
  {
    id: "voice",
    name: "Voice & Text Agent Runtime",
    slug: "agent-runtime",
    layer: "runtime",
    stack: ["LiveKit", "Python", "LLM"],
    x: 88,
    y: 66,
    summary:
      "The agent runtime that actually holds the conversation, running nodeset-based flows against injected campaign context.",
    built: [
      "Migrated inline DTOs onto the shared contract layer with a generic dict fallback, so a new allocation shape can't break the runtime.",
      "Test-session nodeset selection driven by the JWT payload, letting a simulated session exercise production-identical flows.",
      "API-key-gated text agent server with its own auth middleware.",
    ],
    metrics: [
      ["Flows", "nodeset registry"],
      ["Context", "injected, not fetched"],
      ["Parity", "prod-identical"],
    ],
  },
  {
    id: "tenant",
    name: "Isolated Tenant Processor",
    slug: "tenant-callbacks",
    layer: "tenant",
    stack: ["Django", "Azure Queue"],
    x: 20,
    y: 93,
    summary:
      "A separate deployment for a single large tenant, processing their call dispositions and outcomes in isolation.",
    built: [
      "Queue-driven disposition processors wired into a job runner, kept deliberately outside the shared core.",
      "Timezone normalisation fallbacks for vendor payloads that arrive without one — a small bug class that silently corrupts reporting.",
      "Vendor-to-agent disposition mapping so tenant outcomes land as billable, CRM-compatible events.",
    ],
    metrics: [
      ["Blast radius", "1 tenant"],
      ["Transport", "Azure Queue"],
      ["Commits", "14"],
    ],
  },
];

export const edges = [
  ["ingest", "core"],
  ["dlr", "core"],
  ["core", "dtos"],
  ["proxy", "dtos"],
  ["dlr", "dtos"],
  ["tracker", "dtos"],
  ["core", "proxy"],
  ["core", "tracker"],
  ["simulator", "dlr"],
  ["voice", "dtos"],
  ["core", "simulator"],
  ["tenant", "core"],
];

// ---------------------------------------------------------------------------
// Engineering deep dives
// ---------------------------------------------------------------------------

export const deepDives = [
  {
    id: "debounce",
    title: "Distributed debounce, no sticky sessions",
    tag: "Redis · atomic TTL",
    problem:
      "A user fires six WhatsApp messages in four seconds. Three server instances each pick one up. Each thinks it's the whole conversation.",
    solution: [
      "Redis pipelines plus atomic TTL operations collapse a burst into a single processed event, cluster-wide.",
      "The lock is the coordination point, so no instance needs to own the user — no sticky sessions, no session affinity in the load balancer.",
      "Late arrivals extend the window instead of spawning a second job, so the agent replies once to the whole thought.",
    ],
    metric: "1 event per burst · N instances · 0 affinity",
  },
  {
    id: "registry",
    title: "The abstraction was the product",
    tag: "Framework · designed from scratch",
    problem:
      "Eight vendors, eight auth schemes, eight payload dialects, eight TPS ceilings. The naive version is an if/elif chain that every future engineer is afraid of — and every new client stalls a deal for months.",
    solution: [
      "I designed the communication framework end to end: a base service contract with implementations selected at runtime by key, so the core pipeline never learns a vendor's name.",
      "Routing and data handling are normalised into one static interface — each provider maps its own dialect onto the same canonical system variables and the same processing path.",
      "Calling systems don't orchestrate anything. They hand over a request; batching, throttling, retries and callback correlation are the framework's problem.",
      "A new provider is an implementation, a config model and a mapping. An existing provider for a new client is credentials in a config screen — zero code, zero deploy.",
    ],
    metric: "8+ integrations · 1 dispatch path · 0 vendor branches upstream",
  },
  {
    id: "throttle",
    title: "Throttling without dropping a message",
    tag: "Dual-path pipeline",
    problem:
      "End-of-day allocation pushes arrive as one enormous array. One vendor accepts 100 TPS, another accepts 5 and silently bans you for asking twice.",
    solution: [
      "A throttled executor splits the array into calculated sub-batches and schedules staggered fire jobs against each vendor's real ceiling.",
      "A fast path bypasses the batch pipeline entirely for single ad-hoc triggers, so a manual send doesn't queue behind 40,000 messages.",
      "Spikes buffer instead of failing — throughput is shaped, not shed.",
    ],
    metric: "peak-safe · vendor-compliant · nothing dropped",
  },
  {
    id: "taxonomy",
    title: "Knowing what actually failed",
    tag: "Error taxonomy",
    problem:
      "'Failed' is not one thing. An invalid number and a network timeout look identical in a log and mean opposite things for retries and for billing.",
    solution: [
      "Vendor errors are terminal and conclusive — invalid number, blocked by carrier — and map to a standard failure event.",
      "System errors are prefixed sys_ (timeout, batch cancelled, queue drop), classified as dropped, and stay safely retryable.",
      "Operations gets a mathematically accurate view of what succeeded, what failed and what can be redialled — which is the difference between a retry and a duplicate charge.",
    ],
    metric: "retryable ≠ failed · billing stays honest",
  },
  {
    id: "schedule",
    title: "One source of truth for every scheduled job",
    tag: "Celery Beat · multi-tenant",
    problem:
      "Modules writing directly to Celery Beat means cancelled jobs that keep firing, duplicated schedules, and no tenant boundary.",
    solution: [
      "A tenanted central schedule manager is the only thing allowed to write Beat entries; every module syncs through shared abstractions.",
      "Workers enforce idempotency on startup — a job that has been cancelled self-terminates and purges its own Beat entry.",
      "Report scheduling runs under atomic transactions, so two concurrent workers can't generate the same billing report twice.",
    ],
    metric: "single writer · idempotent workers · no ghost jobs",
  },
  {
    id: "reports",
    title: "Reports operations can change without an engineer",
    tag: "Jinja2 · Metabase",
    problem:
      "Every enterprise client wants slightly different columns, filters and delivery times. Encoding that in code means a sprint per client.",
    solution: [
      "Tenant-configurable export formats and column mappings: column set, ordering, display names and row validators defined as configuration.",
      "Row-level Jinja2 validators express business rules — exclude zero-outstanding accounts, honour DNC — without a per-tenant code fork.",
      "Compiled templates are cached and dataset queries were hardened, cutting more than 40 seconds off execution and making embedded dashboards load like they should.",
    ],
    metric: "−40s query time · 100k+ row reports in SLA",
  },
];

// ---------------------------------------------------------------------------
// Experience
// ---------------------------------------------------------------------------

export const experience = [
  {
    company: "Reconect.ai",
    website: "https://reconect.ai/",
    role: "Software Engineer",
    date: "Mar 2025 — Present",
    current: true,
    points: [
      "Designed from scratch the plug-and-play communication framework behind 10M+ API calls/day — 8+ provider integrations whose routing, payload shapes and delivery semantics are normalised into one static interface, so calling systems orchestrate nothing.",
      "Built the DLR and callback pipelines and a provider-agnostic template platform on top of that contract.",
      "Architected a distributed debounce system on Redis pipelines and atomic TTL ops, collapsing message bursts into single processed events across instances with no sticky sessions.",
      "Built a tenanted central schedule manager as the single source of truth for Celery Beat, with idempotent workers that self-terminate and purge cancelled jobs.",
      "Built the reporting and analytics subsystem from scratch — generation, email delivery, scheduling CRUD under atomic transactions, Metabase embedding; query hardening cut 40+ seconds of execution time.",
      "Built n8n automation workflows with AI integrations cutting manual overhead by ~80%, with multi-tenant isolation via M2M auth and secrets resolved at runtime through a provider-agnostic manager.",
    ],
    stack: ["Python", "Django", "FastAPI", "Celery", "Redis", "Azure", "K8s"],
  },
  {
    company: "Reconect.ai",
    website: "https://reconect.ai/",
    role: "Engineering Intern",
    date: "Oct 2024 — Mar 2025",
    points: [
      "Developed a Django SaaS platform on Ninja API, hardening auth with Auth0 and shipping conversational AI features handling 200+ daily interactions.",
      "Streamlined async pipelines with Azure Service Bus and scaled workloads dynamically on Kubernetes + KEDA, cutting queue latency during traffic spikes.",
      "Optimised PostgreSQL query patterns and schema design, improving throughput on reporting and analytics endpoints.",
    ],
    stack: ["Django Ninja", "Auth0", "Azure Service Bus", "KEDA", "PostgreSQL"],
  },
  {
    company: "Utoptech Consultancy",
    website: "",
    role: "Django Developer",
    date: "Jan 2024 — Jun 2024",
    points: [
      "Built secure REST APIs for an ERP-focused mobile application, translating client requirements straight into production backends.",
      "Tuned AWS EC2 and storage utilisation, cutting cloud spend by roughly 20%.",
    ],
    stack: ["Django", "AWS", "REST"],
  },
  {
    company: "Vulmiqi",
    website: "https://vulmiqi.com/",
    role: "Python Backend Developer",
    date: "Jun 2023 — Dec 2023",
    points: [
      "Maintained and extended the core backend product, contributing to a 20% increase in customer adoption.",
      "Introduced Docker-based workflows and Harness CI/CD pipelines, landing roughly 30% faster deployments.",
    ],
    stack: ["Python", "Docker", "Harness CI/CD"],
  },
];

export const education = {
  degree: "B.Tech, Computer Science & Engineering",
  school: "Kalinga Institute of Industrial Technology (KIIT)",
  date: "2021 — 2025",
  extras: [
    "Flipr Hackathon — Merit Certificate",
    "Cyber Security Workshop, IIT Kharagpur",
    "Cisco Networking Academy — Networking & Cybersecurity",
  ],
};

// ---------------------------------------------------------------------------
// Skills & projects
// ---------------------------------------------------------------------------

export const skills = [
  {
    group: "Languages",
    items: ["Python", "C++", "JavaScript", "SQL"],
  },
  {
    group: "Backend",
    items: ["Django", "FastAPI", "Django Ninja", "Celery", "Node.js", "Socket.IO"],
  },
  {
    group: "Data",
    items: ["PostgreSQL", "Redis", "MongoDB", "DynamoDB", "Cosmos DB", "MySQL"],
  },
  {
    group: "Cloud & DevOps",
    items: ["AWS", "Azure", "Docker", "Kubernetes", "KEDA", "Jenkins", "n8n"],
  },
  {
    group: "Architecture",
    items: [
      "Event-driven",
      "Microservices",
      "Multi-tenancy",
      "Rate limiting",
      "M2M auth",
      "Idempotency",
    ],
  },
  {
    group: "Frontend",
    items: ["React", "Next.js"],
  },
];

export const projects = [
  {
    title: "Communication Platform",
    context: "Reconect.ai · 2025–2026",
    desc: "A dynamic template engine that resolves placeholder variables from live DB context at send time — every message assembled per recipient, with provider-specific section constraints, trackable payment links and tenant-level caching with fallback.",
    tags: ["Python", "Redis", "Multi-tenant"],
    href: "/throttle",
    internal: true,
    cta: "Open the throttle simulator",
    accent: "var(--accent)",
  },
  {
    title: "FED Website",
    context: "Open source · CMS",
    desc: "Official website of FED with an in-built CMS, deployed on AWS.",
    tags: ["MERN", "AWS"],
    href: "https://github.com/fed-tech",
    accent: "var(--violet)",
  },
  {
    title: "Smart Attendance",
    context: "Computer vision",
    desc: "OpenCV face-recognition attendance system deployed to 100+ users; SQLite access-pattern tuning cut request latency by 20%.",
    tags: ["Python", "OpenCV", "SQLite"],
    href: "https://github.com/saptarsheemitra/Smart-Attendance-System",
    accent: "var(--amber)",
  },
  {
    title: "Podcast Platform",
    context: "Audio publishing",
    desc: "End-to-end platform for uploading and publishing audio; MongoDB schema work improved durability by 50%, verified across 100+ test runs before go-live.",
    tags: ["Node.js", "MongoDB", "DigitalOcean"],
    href: "https://github.com/vinitagarwal007/Podcast-Application",
    accent: "var(--rose)",
  },
];
