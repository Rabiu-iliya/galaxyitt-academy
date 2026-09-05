import { cn } from "@/lib/utils";

/**
 * Decorative animated "galaxy" backdrop: drifting aurora orbs + twinkling stars.
 * Purely presentational — sits behind content via absolute positioning.
 */
export function AnimatedBackground({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
    >
      <div className="galaxy-orb galaxy-orb-1" />
      <div className="galaxy-orb galaxy-orb-2" />
      <div className="galaxy-orb galaxy-orb-3" />
      <div className="galaxy-stars" />
    </div>
  );
}
