import * as React from "react"

import { cn } from "@/lib/utils"

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      // R3 primitive alignment: match the shared SettingsCard shell so a stock
      // Card reads as its sibling — flat (no drop shadow), 11px radius, hairline
      // border via the bridged --border. Typography of CardTitle stays a heading
      // (see note there); it is the SHELL that makes them one family.
      "rounded-[11px] border bg-card text-card-foreground",
      className
    )}
    {...props}
  />
))
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    // THE interior padding rule (R3 §F3): 20px inline / 16px block, matching
    // SettingsCard. space-y-1.5 = 6px between title and description (= the
    // margin-block-start on SettingsCard's description).
    className={cn("flex flex-col space-y-1.5 px-5 py-4", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    // CardTitle stays a section HEADING (not the mono-uppercase eyebrow used by
    // SettingsCard): CardTitle is load-bearing content in places that render on
    // every page (ToolSeoContent's text-xl "About / How to use / Related"
    // headings), where a mono-uppercase-muted treatment would be wrong. Shell
    // parity (above) is what makes stock Cards read as SettingsCard siblings;
    // per-tool title→eyebrow harmonisation is a SettingsCard swap (Phase D), not
    // a primitive change.
    className={cn("font-semibold leading-none tracking-tight", className)}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("px-5 pb-4 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center px-5 pb-4 pt-0", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
