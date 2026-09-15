export default function CupIllustration({
  color = "#8A5A34",
  className = "",
}: {
  color?: string;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 120 160"
      className={className}
      role="img"
      aria-label="Illustrated drink cup"
    >
      <rect x="55" y="2" width="7" height="30" rx="3.5" fill="#fff" stroke="#e7dcc7" strokeWidth="1.5" />
      <ellipse cx="60" cy="34" rx="35" ry="10" fill="#fdf7ec" stroke="#e7dcc7" strokeWidth="1.5" />
      <path
        d="M28 38 L35 142 Q60 155 85 142 L92 38 Z"
        fill="#fdf7ec"
        stroke="#e7dcc7"
        strokeWidth="1.5"
      />
      <path
        d="M31.5 66 L35 142 Q60 155 85 142 L88.5 66 Z"
        fill={color}
        opacity="0.88"
      />
      <ellipse cx="60" cy="34" rx="35" ry="10" fill="none" stroke="#e7dcc7" strokeWidth="1.5" />
      <circle cx="44" cy="128" r="3.4" fill="#3b2314" />
      <circle cx="54" cy="136" r="3.4" fill="#3b2314" />
      <circle cx="65" cy="134" r="3.4" fill="#3b2314" />
      <circle cx="75" cy="127" r="3.4" fill="#3b2314" />
      <circle cx="59.5" cy="123" r="3.4" fill="#3b2314" />
    </svg>
  );
}
