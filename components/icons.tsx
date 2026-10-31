import type { ReactNode, SVGProps } from "react";

const stroke = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2.25,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

const paths = {
  github: (
    <path
      fill="currentColor"
      d="M12 .3a12 12 0 0 0-3.8 23.38c.6.12.83-.26.83-.57l-.02-2.04c-3.34.72-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.08-.74.09-.73.09-.73 1.2.09 1.84 1.24 1.84 1.24 1.07 1.83 2.8 1.3 3.49 1 .1-.78.42-1.31.76-1.61-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.14-.3-.54-1.52.1-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.28-1.55 3.29-1.23 3.29-1.23.64 1.66.24 2.88.12 3.18.77.84 1.23 1.91 1.23 3.22 0 4.61-2.8 5.62-5.48 5.92.43.37.81 1.1.81 2.22l-.01 3.29c0 .32.21.69.82.57A12 12 0 0 0 12 .3"
    />
  ),
  linkedin: (
    <path
      fill="currentColor"
      d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.13 1.45-2.13 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.23 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z"
    />
  ),
  whatsapp: (
    <path
      fill="currentColor"
      d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.16-.17.2-.35.22-.64.08-.3-.15-1.26-.47-2.39-1.48-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.6.13-.14.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.61-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.21 3.07c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.7.63.71.22 1.36.19 1.87.12.57-.09 1.76-.72 2-1.42.25-.69.25-1.29.18-1.41-.08-.13-.28-.2-.57-.35m-5.42 7.4h-.01a9.87 9.87 0 0 1-5.03-1.38l-.36-.21-3.74.98 1-3.65-.24-.37a9.86 9.86 0 0 1-1.51-5.26c0-5.45 4.44-9.88 9.89-9.88 2.64 0 5.12 1.03 6.99 2.9a9.83 9.83 0 0 1 2.89 6.99c0 5.45-4.44 9.88-9.88 9.88m8.41-18.3A11.81 11.81 0 0 0 12.05 0C5.5 0 .16 5.34.16 11.89c0 2.1.55 4.14 1.59 5.95L.06 24l6.3-1.65a11.88 11.88 0 0 0 5.69 1.45h.01c6.55 0 11.89-5.34 11.89-11.89 0-3.18-1.24-6.17-3.49-8.41"
    />
  ),
  android: (
    <g fill="currentColor">
      <path d="M5.5 10.5a6.5 6.5 0 0 1 13 0zM8.6 5.2 7.3 3.1M15.4 5.2l1.3-2.1" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="9.4" cy="8.1" r=".9" fill="#fff" />
      <circle cx="14.6" cy="8.1" r=".9" fill="#fff" />
      <rect x="5.5" y="11.5" width="13" height="8" rx="1.6" />
      <rect x="2.6" y="11.5" width="2.2" height="6" rx="1.1" />
      <rect x="19.2" y="11.5" width="2.2" height="6" rx="1.1" />
    </g>
  ),
  mail: (
    <g {...stroke}>
      <rect x="3" y="5" width="18" height="14" rx="2.5" />
      <path d="m3.5 7 8.5 6 8.5-6" />
    </g>
  ),
  arrowRight: <path {...stroke} d="M5 12h14M13 6l6 6-6 6" />,
  arrowDown: <path {...stroke} d="M12 5v14M6 13l6 6 6-6" />,
  arrowUp: <path {...stroke} d="M12 19V5M6 11l6-6 6 6" />,
  external: <path {...stroke} d="M7 17 17 7M8.5 7H17v8.5" />,
  play: <path fill="currentColor" d="M8 5.2v13.6a.8.8 0 0 0 1.2.7l11-6.8a.8.8 0 0 0 0-1.4l-11-6.8A.8.8 0 0 0 8 5.2z" />,
  close: <path {...stroke} strokeWidth={2.75} d="M6 6l12 12M18 6 6 18" />,
  chevronLeft: <path {...stroke} strokeWidth={2.75} d="M15 5l-7 7 7 7" />,
  chevronRight: <path {...stroke} strokeWidth={2.75} d="M9 5l7 7-7 7" />,
  download: <path {...stroke} d="M12 4v11M7 10.5l5 5 5-5M5 20h14" />,
  pin: (
    <g {...stroke}>
      <path d="M12 21s-7-6.1-7-11.4a7 7 0 0 1 14 0C19 14.9 12 21 12 21z" />
      <circle cx="12" cy="9.6" r="2.4" />
    </g>
  ),
  cap: (
    <g {...stroke}>
      <path d="M2 9.5 12 5l10 4.5L12 14z" />
      <path d="M6 11.6V16c0 1.4 2.7 3 6 3s6-1.6 6-3v-4.4M22 9.5v5" />
    </g>
  ),
  chat: <path {...stroke} d="M4.5 5h15a1.5 1.5 0 0 1 1.5 1.5v8a1.5 1.5 0 0 1-1.5 1.5H10l-5 4v-4h-.5A1.5 1.5 0 0 1 3 14.5v-8A1.5 1.5 0 0 1 4.5 5z" />,
  star: <path fill="currentColor" d="m12 2.8 2.8 5.8 6.3.9-4.6 4.4 1.1 6.3L12 17.2l-5.6 3 1.1-6.3L2.9 9.5l6.3-.9z" />,
  copy: (
    <g {...stroke}>
      <rect x="8.5" y="8.5" width="12" height="12" rx="2" />
      <path d="M15.5 8.5V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v7.5a2 2 0 0 0 2 2h2.5" />
    </g>
  ),
  check: <path {...stroke} strokeWidth={3} d="M5 12.5 9.5 17 19 7" />,
  menu: <path {...stroke} strokeWidth={2.75} d="M4 7h16M4 12h16M4 17h16" />,
  phone: (
    <g {...stroke}>
      <rect x="6.5" y="2.5" width="11" height="19" rx="2.5" />
      <path d="M10.5 18h3" />
    </g>
  ),
  globe: (
    <g {...stroke}>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.6 2.6 3.8 5.6 3.8 9s-1.2 6.4-3.8 9c-2.6-2.6-3.8-5.6-3.8-9S9.4 5.6 12 3z" />
    </g>
  ),
  images: (
    <g {...stroke}>
      <rect x="3" y="5" width="15" height="14" rx="2" />
      <path d="M21 8v11a2 2 0 0 1-2 2H7" />
      <circle cx="8" cy="10" r="1.6" />
      <path d="m3.5 17 4.5-4 3 2.5 3-3 3.5 3.5" />
    </g>
  ),
  hammer: (
    <g {...stroke}>
      <path d="m14 4 6 6-2.5 2.5-6-6z" />
      <path d="M12.5 7.5 4 16a2.1 2.1 0 0 0 3 3l8.5-8.5" />
    </g>
  ),
  cone: (
    <g {...stroke}>
      <path d="M9.5 4h5l4 15h-13z" />
      <path d="M3.5 19h17M8 10h8M7 14.5h10" />
    </g>
  ),
  sparkle: <path fill="currentColor" d="M12 2c.6 4.6 2.4 6.9 7 7.5v1c-4.6.6-6.4 2.9-7 7.5h-1c-.6-4.6-2.4-6.9-7-7.5v-1c4.6-.6 6.4-2.9 7-7.5z" />,
  monitor: (
    <g {...stroke}>
      <rect x="3" y="4" width="18" height="12" rx="2" />
      <path d="M8 20h8M12 16v4" />
    </g>
  ),
} satisfies Record<string, ReactNode>;

export type IconName = keyof typeof paths;

export function Icon({ name, ...props }: { name: IconName } & SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="1em" height="1em" aria-hidden="true" focusable="false" {...props}>
      {paths[name]}
    </svg>
  );
}
