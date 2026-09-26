import { cn } from "@/lib/utils"

export function Select({
  className,
  compact,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement> & { compact?: boolean }) {
  return (
    <select
      className={cn(
        "border border-input bg-background text-foreground shadow-sm focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
        compact ? "h-8 rounded-md px-2 text-xs" : "flex h-11 w-full rounded-xl px-4 text-sm",
        className,
      )}
      {...props}
    />
  )
}
