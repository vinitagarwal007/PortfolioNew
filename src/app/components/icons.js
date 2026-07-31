// Small inline stroke icons — no runtime dependency, inherit currentColor.

const base = {
  width: 18,
  height: 18,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

export function GithubIcon(props) {
  return (
    <svg {...base} {...props} aria-hidden="true">
      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.9a3.4 3.4 0 0 0-.9-2.6c3-.3 6.2-1.5 6.2-6.7A5.2 5.2 0 0 0 19.9 5a4.9 4.9 0 0 0-.1-3.6s-1.1-.3-3.7 1.4a12.7 12.7 0 0 0-6.7 0C6.8 1.1 5.7 1.4 5.7 1.4A4.9 4.9 0 0 0 5.6 5a5.2 5.2 0 0 0-1.4 3.7c0 5.2 3.2 6.4 6.2 6.7a3.4 3.4 0 0 0-.9 2.6V22" />
    </svg>
  );
}

export function LinkedinIcon(props) {
  return (
    <svg {...base} {...props} aria-hidden="true">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" rx="1" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

export function MailIcon(props) {
  return (
    <svg {...base} {...props} aria-hidden="true">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-10 6L2 7" />
    </svg>
  );
}

export function MediumIcon(props) {
  return (
    <svg {...base} {...props} aria-hidden="true">
      <ellipse cx="6.5" cy="12" rx="4.5" ry="6.5" />
      <ellipse cx="16" cy="12" rx="2.2" ry="6.5" />
      <ellipse cx="21.4" cy="12" rx="0.8" ry="6.5" />
    </svg>
  );
}

export function ArrowIcon(props) {
  return (
    <svg {...base} {...props} aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

export function ExternalIcon(props) {
  return (
    <svg {...base} {...props} aria-hidden="true">
      <path d="M14 4h6v6M20 4l-9 9" />
      <path d="M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" />
    </svg>
  );
}

export function PlusIcon(props) {
  return (
    <svg {...base} {...props} aria-hidden="true">
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}
