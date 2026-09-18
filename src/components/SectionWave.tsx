export default function SectionWave({
  background,
  fill,
}: {
  background: string;
  fill: string;
}) {
  return (
    <div aria-hidden className={`w-full ${background}`}>
      <svg
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
        className="block h-12 w-full sm:h-16 md:h-20"
      >
        <path
          d="M0,32 C240,96 480,0 720,32 C960,64 1200,0 1440,32 V120 H0 Z"
          className={fill}
        />
      </svg>
    </div>
  );
}
