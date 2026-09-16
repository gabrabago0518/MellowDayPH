import Image from "next/image";

export default function Logo({ className = "h-11 w-11" }: { className?: string }) {
  return (
    <Image
      src="/logo.png"
      alt="Mellow Day PH logo"
      width={128}
      height={128}
      className={`shrink-0 object-contain ${className}`}
      priority
    />
  );
}
