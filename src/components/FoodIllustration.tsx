export default function FoodIllustration({
  color = "#8A5A34",
  className = "",
}: {
  color?: string;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 120 120"
      className={className}
      role="img"
      aria-label="Illustrated treat"
    >
      <circle cx="60" cy="62" r="50" fill="#fdf7ec" stroke="#e7dcc7" strokeWidth="1.5" />
      <circle cx="60" cy="62" r="34" fill={color} opacity="0.88" />
      <circle cx="47" cy="53" r="4.5" fill="#3b2314" opacity="0.22" />
      <circle cx="72" cy="58" r="3.5" fill="#3b2314" opacity="0.18" />
      <circle cx="56" cy="74" r="4" fill="#3b2314" opacity="0.18" />
      <circle cx="70" cy="76" r="3" fill="#3b2314" opacity="0.15" />
    </svg>
  );
}
