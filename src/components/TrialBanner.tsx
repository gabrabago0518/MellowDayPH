// Pinned to the bottom of the viewport rather than stacked above Header
// (which is `fixed top-0` and deliberately floats over the full-bleed
// Hero image) — adding height up there would mean re-checking every
// page's top padding for overlap. Anchoring to the bottom instead needs
// only one compensating change: Footer's own bottom padding, since Footer
// is the last thing on every page that renders this banner.
//
// Remove this component (and its two call sites: Header.tsx and Footer's
// extra bottom padding) once the site is officially launched and
// accepting real payments.
export default function TrialBanner() {
  return (
    <div
      role="status"
      className="fixed inset-x-0 bottom-0 z-[60] bg-amber-400 px-4 py-2 text-center text-[11px] font-semibold leading-snug text-brown-900 shadow-[0_-2px_10px_rgba(0,0,0,0.08)] sm:text-xs"
    >
      Trial site — Mellow Day PH isn&apos;t officially launched yet. No real orders or payments can be made here.
    </div>
  );
}
