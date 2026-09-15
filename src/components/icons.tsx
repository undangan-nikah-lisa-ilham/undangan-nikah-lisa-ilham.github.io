import type { ReactNode, SVGProps } from "react";

export type IconName =
  | "envelope"
  | "leaf"
  | "heart"
  | "mosque"
  | "rings"
  | "calendar"
  | "clock"
  | "pin"
  | "camera"
  | "quote"
  | "music"
  | "muted"
  | "expand"
  | "left"
  | "right"
  | "close"
  | "copy"
  | "check"
  | "gift"
  | "send"
  | "sparkle"
  | "instagram"
  | "users"
  | "spinner"
  | "chevron-down";

const PATHS: Record<IconName, ReactNode> = {
  envelope: (
    <>
      <path d="M3 9.5 12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5Z" />
      <path d="m3 9.5 9 6.5 9-6.5" />
    </>
  ),
  leaf: (
    <>
      <path d="M4 20c8 1 16-4 16-15-9-1-16 3-16 10 0 2 .6 3.7 1.6 5Z" />
      <path d="M4 20c2-5 5-8 9-10" />
    </>
  ),
  heart: (
    <path
      d="M12 20.5S3.5 15.3 3.5 9.6A4.6 4.6 0 0 1 12 7.1a4.6 4.6 0 0 1 8.5 2.5c0 5.7-8.5 10.9-8.5 10.9Z"
      fill="currentColor"
      stroke="none"
    />
  ),
  mosque: (
    <>
      <path d="M12 2.5c2.2 2 3.5 3.6 3.5 5.2 0 1.4-1.6 2.3-3.5 2.3S8.5 9.1 8.5 7.7c0-1.6 1.3-3.2 3.5-5.2Z" />
      <path d="M5 21v-7.5c0-1.6 3.1-3.5 7-3.5s7 1.9 7 3.5V21" />
      <path d="M3 21h18M10 21v-4a2 2 0 1 1 4 0v4" />
    </>
  ),
  rings: (
    <>
      <circle cx="9" cy="14" r="5.5" />
      <circle cx="16" cy="14" r="5.5" />
      <path d="m14 4 2-1.5L18 4l-2 2.4Z" />
    </>
  ),
  calendar: (
    <>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M3 10h18M8 3v4M16 3v4" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5.3l3.4 2" />
    </>
  ),
  pin: (
    <>
      <path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11Z" />
      <circle cx="12" cy="10" r="2.6" />
    </>
  ),
  camera: (
    <>
      <path d="M4 8h3l1.5-2.5h7L17 8h3a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1Z" />
      <circle cx="12" cy="13.5" r="3.6" />
    </>
  ),
  quote: (
    <path
      d="M9.6 6.2 7.8 9.6c1.9.2 3.1 1.6 3.1 3.4 0 2-1.5 3.5-3.5 3.5S4 15 4 12.9c0-1.2.3-2.3.9-3.4l2-3.3h2.7Zm8.9 0-1.8 3.4c1.9.2 3.1 1.6 3.1 3.4 0 2-1.5 3.5-3.5 3.5s-3.4-1.5-3.4-3.6c0-1.2.3-2.3.9-3.4l2-3.3h2.7Z"
      fill="currentColor"
      stroke="none"
    />
  ),
  music: (
    <>
      <path d="M9 18V5.5l11-2V16" />
      <circle cx="6.5" cy="18" r="2.6" />
      <circle cx="17.5" cy="16" r="2.6" />
    </>
  ),
  muted: (
    <>
      <path d="M9 18V5.5l11-2V16" />
      <circle cx="6.5" cy="18" r="2.6" />
      <circle cx="17.5" cy="16" r="2.6" />
      <path d="m3 3 18 18" />
    </>
  ),
  expand: (
    <>
      <path d="M4 9V4h5M20 15v5h-5M20 9V4h-5M4 15v5h5" />
    </>
  ),
  left: <path d="m14.5 5-7 7 7 7" />,
  right: <path d="m9.5 5 7 7-7 7" />,
  close: <path d="M6 6 18 18M18 6 6 18" />,
  copy: (
    <>
      <rect x="9" y="9" width="11" height="11" rx="2" />
      <path d="M5 15H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1" />
    </>
  ),
  check: <path d="m5 13 4.5 4.5L19 7" />,
  gift: (
    <>
      <rect x="3" y="9" width="18" height="12" rx="1.5" />
      <path d="M3 13.5h18M12 9v12" />
      <path d="M12 9S10.5 3 7.8 3a2.4 2.4 0 0 0 0 4.8H12Zm0 0s1.5-6 4.2-6a2.4 2.4 0 0 1 0 4.8H12Z" />
    </>
  ),
  send: <path d="M21 3 3 10.5l7 3 3 7L21 3Z" />,
  sparkle: (
    <path
      d="M12 2.8 13.6 9 20 10.5 13.6 12 12 18.2 10.4 12 4 10.5 10.4 9 12 2.8Z"
      fill="currentColor"
      stroke="none"
    />
  ),
  instagram: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
    </>
  ),
  users: (
    <>
      <circle cx="9" cy="8" r="3.5" />
      <path d="M2.8 20c.6-3.4 3.1-5.5 6.2-5.5s5.6 2.1 6.2 5.5" />
      <path d="M16 5.2a3.5 3.5 0 0 1 0 6.6M17.5 14.9c2.1.6 3.5 2.5 3.9 5.1" />
    </>
  ),
  spinner: (
    <>
      <path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.9 2.9M15.5 15.5l2.9 2.9M18.4 5.6l-2.9 2.9M8.5 15.5l-2.9 2.9" />
    </>
  ),
  "chevron-down": <path d="m5 9 7 7 7-7" />,
};

type IconProps = SVGProps<SVGSVGElement> & {
  name: IconName;
  size?: number;
};

export function Icon({ name, size = 16, ...rest }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      {PATHS[name]}
    </svg>
  );
}