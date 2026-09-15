export default function Logo({ className = "" }: { className?: string }) {
  return (
    <div
      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 border-brown-900 bg-cream text-center leading-none ${className}`}
    >
      <span className="font-heading text-[10px] font-bold text-brown-900">
        Mellow
        <br />
        Day
      </span>
    </div>
  );
}
