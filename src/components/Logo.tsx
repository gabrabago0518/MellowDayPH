export default function Logo({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      className={`h-11 w-11 shrink-0 ${className}`}
      role="img"
      aria-label="Mellow Day PH logo"
    >
      <circle cx="32" cy="32" r="30" fill="#FDF3E4" stroke="#3B2314" strokeWidth="3" />

      {/* back ridges */}
      <path d="M20 14l4 6-6 1z" fill="#6E8F42" />
      <path d="M29 10l4 7-7 1z" fill="#6E8F42" />
      <path d="M39 12l4 7-7 0z" fill="#6E8F42" />

      {/* head */}
      <path
        d="M14 30c0-8 8-13 18-13s18 5 18 13-4 15-18 15S14 38 14 30z"
        fill="#8FAE55"
      />

      {/* sunglasses */}
      <rect x="16" y="26" width="32" height="9" rx="4.5" fill="#2B2118" />
      <circle cx="23.5" cy="30.5" r="1.3" fill="#fff" opacity="0.85" />
      <circle cx="39.5" cy="30.5" r="1.3" fill="#fff" opacity="0.85" />

      {/* jaw / snout */}
      <ellipse cx="32" cy="42" rx="11" ry="6.5" fill="#F4E4C6" />
      <circle cx="27.5" cy="39.5" r="1" fill="#6E8F42" />
      <circle cx="36.5" cy="39.5" r="1" fill="#6E8F42" />
      <path
        d="M24 43c3 3 13 3 16 0"
        fill="none"
        stroke="#3B2314"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
    </svg>
  );
}
