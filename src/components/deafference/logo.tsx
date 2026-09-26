import { cn } from "@/lib/utils"

/**
 * Deafference wordmark. The source PNG bakes dark-navy ink on a transparent
 * background, so it disappears on dark surfaces — wrapped in a light chip
 * (only visible in dark mode) rather than shipping a second raster, since a
 * single static image can't re-tint its own ink at runtime.
 */
export function Logo({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-lg bg-transparent px-0 py-0 dark:bg-white/95 dark:px-2 dark:py-1 dark:shadow-sm",
        className,
      )}
    >
      <img src="/deafference-logo.png" alt="Deafference" className="h-8 w-auto object-contain sm:h-9" />
    </span>
  )
}
