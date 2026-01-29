"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ArrowRight, TrendingUp, TrendingDown, Zap } from "lucide-react"

interface ConsequenceCardProps {
  open: boolean
  consequence: string
  onContinue: () => void
  changes: Record<string, { before: number | string; after: number | string }>
  hasMoreEvents?: boolean
}

export function ConsequenceCard({
  open,
  consequence,
  onContinue,
  changes,
  hasMoreEvents = false,
}: ConsequenceCardProps) {
  const formatChange = (key: string, before: number | string, after: number | string) => {
    if (typeof before === "string" || typeof after === "string") {
      return (
        <div className="flex items-center justify-between border-2 border-border p-2 bg-muted/50">
          <span className="text-muted-foreground font-mono text-sm">
            {String(before)} {"->"} {String(after)}
          </span>
        </div>
      )
    }

    const diff = after - before
    const isPositive = diff > 0
    const prefix = key === "futureScore" ? "" : "₹"
    
    return (
      <div className="flex items-center justify-between border-2 border-border p-2 bg-muted/50">
        <span className="text-muted-foreground font-mono text-sm">
          {prefix}{before.toLocaleString()} {"->"} {prefix}{after.toLocaleString()}
        </span>
        <span
          className={`font-bold font-mono flex items-center gap-1 ${isPositive ? "text-primary" : "text-destructive"}`}
        >
          {isPositive ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
          {isPositive ? "+" : ""}
          {prefix}{diff.toLocaleString()}
        </span>
      </div>
    )
  }

  const labelMap: Record<string, string> = {
    balance: "Balance",
    savings: "Savings",
    loans: "Loans",
    income: "Monthly Income",
    futureScore: "XP Score",
    stress: "Stress Level",
  }

  const hasChanges = Object.keys(changes).length > 0

  return (
    <Dialog open={open}>
      <DialogContent className="max-w-md sm:max-w-lg border-4 border-border bg-card shadow-[8px_8px_0_0_rgba(0,0,0,0.3)]">
        <DialogHeader>
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center border-4 border-accent bg-accent/20 text-4xl shadow-[2px_2px_0_0_rgba(0,0,0,0.2)]">
            !
          </div>
          <DialogTitle className="text-center text-2xl font-mono uppercase">
            Result
          </DialogTitle>
          <DialogDescription className="text-center text-base leading-relaxed font-mono">
            {consequence}
          </DialogDescription>
        </DialogHeader>

        {hasChanges && (
          <div className="mt-4 space-y-3 border-4 border-border bg-secondary p-4">
            <h4 className="font-bold font-mono uppercase text-sm text-muted-foreground mb-3">Stats Changed</h4>
            
            {Object.entries(changes).map(([key, value]) => (
              <div key={key}>
                <p className="mb-1 text-xs font-bold text-foreground font-mono uppercase">
                  {labelMap[key] || key}
                </p>
                {formatChange(key, value.before, value.after)}
              </div>
            ))}
          </div>
        )}

        {!hasChanges && (
          <div className="mt-4 border-4 border-border bg-secondary p-4 text-center">
            <p className="text-muted-foreground font-mono text-sm">No stat changes this time.</p>
          </div>
        )}

        <button
          onClick={onContinue}
          className="mt-4 w-full h-14 font-mono font-bold uppercase border-4 border-primary bg-primary text-primary-foreground hover:bg-primary/90 shadow-[4px_4px_0_0_rgba(0,0,0,0.3)] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-2"
        >
          {hasMoreEvents ? (
            <>
              <Zap className="h-5 w-5" />
              Next Event
            </>
          ) : (
            <>
              Continue
              <ArrowRight className="h-5 w-5" />
            </>
          )}
        </button>

        {hasMoreEvents && (
          <p className="text-center text-xs text-muted-foreground font-mono">
            More events await this month...
          </p>
        )}
      </DialogContent>
    </Dialog>
  )
}
