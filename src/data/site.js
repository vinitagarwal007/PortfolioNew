// Single source of truth for every piece of copy on the site.
//
// Note on naming: services below use descriptive names + neutral slugs rather
// than internal repository names. Swap `slug`/`name` here if you ever want the
// real repo names on the public site.

// Update this if the site moves to a custom domain — it drives canonical URLs,
// the sitemap, robots.txt and every absolute URL in the structured data.
export const siteUrl = "https://vinitagarwal.vercel.app";

export const profile = {
  name: "Vinit Agarwal",

  // Primary title — used for the page title, structured data and anywhere a
  // single label is needed.
  role: "Distributed Systems Engineer",

  // The badge cycles through all three.
  titles: [
    "Distributed Systems Engineer",
    "System Architect",
    "Software Developer",
  ],

  // The one sentence the whole site is an argument for.
  headline:
    "I design and own distributed systems end to end — architecture through production — so they stay correct at scale and affordable to run.",

  // The same sentence for someone who doesn't write software.
  plain:
    "Almost everything I build is invisible. It's the machinery underneath an app that decides what happens next, makes sure it happens exactly once, and keeps the running cost from growing faster than the business does.",

  blurb:
    "I'm a backend engineer in Bangalore. I like the parts of a system that other people would rather not think about — what happens when a message arrives twice, when a vendor goes quiet mid-send, when a queue backs up at the worst possible hour. I've spent the last two years designing that layer for a platform that handles millions of interactions a day, and I own it from the architecture diagram to the 2am page.",

  location: "Bangalore, India",
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
    "abstractions other engineers build on",
    "systems that fail honestly",
    "scale that stays affordable",
    "services from empty folder to production",
  ],
};

export const stats = [
  { value: "10M+", label: "interactions a day", note: "systems I designed" },
  { value: "9", label: "services owned", note: "empty folder to production" },
  { value: "8+", label: "integrations", note: "behind one interface" },
  { value: "36%", label: "of my commits", note: "were refactors, deliberately" },
];

// ---------------------------------------------------------------------------
// How I work — the spine of the site. Each principle reads twice: once for
// anyone, once for engineers.
// ---------------------------------------------------------------------------

export const principles = [
  {
    id: "abstraction",
    title: "I design the thing other people call",
    plain:
      "The best compliment my work gets is that nobody has to think about it. If a teammate has to understand eight different vendors to send one message, I've done my job badly.",
    technical:
      "Static contracts over conditionals. Implementations selected at runtime by key, each returning a typed model that the pipeline normalises into one standard vocabulary. Adding a provider is an implementation and a mapping — never a change to routing.",
    evidence: "8+ integrations, one dispatch path, zero vendor branches upstream",
  },
  {
    id: "reliability",
    title: "I assume it breaks, and I want to know which break it was",
    plain:
      "Networks drop, vendors go down, users tap send six times. None of that is unusual — it's Tuesday. What matters is that the system can tell the difference between 'that genuinely failed' and 'try that again', because one of those is a refund and the other is a duplicate charge.",
    technical:
      "Idempotency enforced at the worker, not hoped for. A strict error taxonomy separating terminal vendor outcomes from retryable system failures. Exponential backoff with bounded retries, atomic cancellation under row-level locks, and explicit state machines wherever two jobs can touch the same row.",
    evidence: "retryable ≠ failed · at-least-once delivery · races resolved, not documented",
  },
  {
    id: "efficiency",
    title: "Scale is a budget, not a bragging right",
    plain:
      "Making something work for a million people is easy if you don't care what it costs. The interesting problem is doing it on a bill the business can actually pay — and that usually means not asking the database the same question twice.",
    technical:
      "Roughly 80% of per-job context reads served from Redis rather than Postgres, keyed per tenant and invalidated on write. Query hardening that cut 40+ seconds off report execution, N+1 elimination in paginated status reporting, and throttling shaped to each vendor's ceiling so throughput is buffered instead of burned.",
    evidence: "−40s query time · ~80% cache hit rate · ~20% cloud spend removed",
  },
  {
    id: "ownership",
    title: "Zero to one, and then I stay",
    plain:
      "I've started a fair few services from an empty folder — and I'm still the person who gets called when they misbehave. Building it is the easy half; living with it is where you learn what you actually designed.",
    technical:
      "Bootstrapping end to end: Docker, dependency management, async database pooling, CI/CD, deploys, then production support. Nine services across ingress, core orchestration, egress gateways and a realtime agent runtime — most of them mine from the first commit.",
    evidence: "9 services · 14 months · still on call for them",
  },
  {
    id: "refactor",
    title: "I go back and fix what I built",
    plain:
      "Code I wrote a year ago was written by someone with less information. I'd rather return to it than defend it.",
    technical:
      "In the core service, 36% of my commits were pure refactoring — extracting shared schema libraries, collapsing duplicated parsers into one polymorphic pipeline, and paying down debt I created myself while moving fast.",
    evidence: "36% of commits: refactors, not features",
  },
];

// ---------------------------------------------------------------------------
// The communication framework — the headline piece of design work
// ---------------------------------------------------------------------------

export const framework = {
  eyebrow: "The piece of design work I'm proudest of",
  title: "One interface. Eight vendors. Nobody upstream can tell them apart.",
  plain:
    "Eight different companies carry these messages, and every one of them speaks its own language, checks your identity differently, and has its own opinion about how fast you're allowed to go. I built the translator that sits in the middle — so everyone else on the team gets to pretend there's only one.",
  lede: "The real job here was never sending messages, it was abstraction. I designed a framework that normalises every provider's routing, payload shape, auth scheme and delivery semantics behind one static interface. Systems that use it don't decide anything: they call it, and the orchestration is handled underneath.",

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
      "A thin ingress router per vendor, each implementing the same static mapping interface — the routing layer never learns a vendor's name.",
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
    group: "Async Python, at volume",
    note: "Non-blocking I/O is the default, not an optimisation.",
    items: ["asyncio", "aiohttp", "FastAPI", "Socket.IO", "connection pooling", "Celery"],
  },
  {
    group: "Design patterns, used in anger",
    note: "Chosen because the alternative hurt, not because of a book.",
    items: [
      "Strategy + Registry",
      "Template Method",
      "DTO-first APIs",
      "polymorphic schemas",
      "shared contract libraries",
    ],
  },
  {
    group: "Correctness",
    note: "Where most of my thinking actually goes.",
    items: [
      "idempotency",
      "race conditions",
      "state machines",
      "Pydantic validation",
      "Decimal for money",
      "error taxonomies",
    ],
  },
  {
    group: "Storage & transport",
    note: "Picked per problem, hidden behind an interface either way.",
    items: [
      "PostgreSQL",
      "Redis",
      "DynamoDB",
      "Cosmos DB",
      "Azure Service Bus",
      "MongoDB",
    ],
  },
  {
    group: "Ship it and keep it up",
    note: "The half of the job that happens after the merge.",
    items: ["Docker", "Kubernetes", "KEDA", "CI/CD", "structured logging", "Key Vault"],
  },
  {
    group: "Also fluent in",
    note: "Enough to build the thing myself when there's no one else.",
    items: ["Django", "Node.js", "React", "Next.js", "C++", "n8n"],
  },
];

export const projects = [
  {
    title: "Communication Platform",
    context: "Reconect.ai · 2025–2026",
    desc: "A dynamic template engine that resolves placeholder variables from live DB context at send time — every message assembled per recipient, with provider-specific section constraints, trackable payment links and tenant-level caching with fallback.",
    tags: ["Python", "Redis", "Multi-tenant"],
    // Two ways into the interactive deep dives that live on their own pages.
    links: [
      { href: "/systems", label: "Explore the systems" },
      { href: "/throttle", label: "Open the simulator" },
    ],
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
