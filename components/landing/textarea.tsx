import * as React from "react"
import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex field-sizing-content min-h-20 w-full rounded-lg border-2 border-input bg-card px-3 py-2 text-base transition-all outline-none shadow-hard-xs focus:shadow-hard-sm focus:translate-x-[1px] focus:translate-y-[1px] placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:bg-muted/50 disabled:opacity-50 disabled:shadow-none md:text-sm",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }