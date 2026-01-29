"use client"

import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import type { GameState } from "@/lib/game-types"
import {
  Wallet,
  PiggyBank,
  TrendingUp,
  Heart,
  Calendar,
  CreditCard,
  Shield,
} from "lucide-react"

interface DashboardProps {
  state: GameState
}

export function Dashboard({ state }: DashboardProps) {
  const stressColors = {
    Low: "text-primary",
    Medium: "text-accent",
    High: "text-amber-500",
    Critical: "text-destructive",
  }

  const stressProgress = {
    Low: 25,
    Medium: 50,
    High: 75,
    Critical: 100,
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground font-mono uppercase">Inventory</h2>
          <p className="text-muted-foreground font-mono text-sm">
            Your financial resources
          </p>
        </div>
        <div className="flex items-center gap-2 border-4 border-primary bg-primary/20 px-4 py-2 shadow-[2px_2px_0_0_rgba(0,0,0,0.3)]">
          <Calendar className="h-4 w-4 text-primary" />
          <span className="font-bold text-foreground font-mono">
            {state.monthName} | Age {state.age}
          </span>
        </div>
      </div>

      {/* Stats Grid - Minecraft Inventory Style */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
        {/* Balance */}
        <Card className="border-4 border-border bg-card p-4 shadow-[2px_2px_0_0_rgba(0,0,0,0.2)]">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Wallet className="h-4 w-4" />
            <span className="text-xs font-bold uppercase tracking-wide font-mono">
              Balance
            </span>
          </div>
          <p className="mt-2 text-xl font-bold text-foreground font-mono">
            {state.balance.toLocaleString()}
          </p>
        </Card>

        {/* Savings */}
        <Card className="border-4 border-border bg-card p-4 shadow-[2px_2px_0_0_rgba(0,0,0,0.2)]">
          <div className="flex items-center gap-2 text-muted-foreground">
            <PiggyBank className="h-4 w-4" />
            <span className="text-xs font-bold uppercase tracking-wide font-mono">
              Savings
            </span>
          </div>
          <p className="mt-2 text-xl font-bold text-primary font-mono">
            {state.savings.toLocaleString()}
          </p>
        </Card>

        {/* Loans */}
        <Card className="border-4 border-border bg-card p-4 shadow-[2px_2px_0_0_rgba(0,0,0,0.2)]">
          <div className="flex items-center gap-2 text-muted-foreground">
            <CreditCard className="h-4 w-4" />
            <span className="text-xs font-bold uppercase tracking-wide font-mono">
              Loans
            </span>
          </div>
          <p className={`mt-2 text-xl font-bold font-mono ${state.loans > 0 ? "text-destructive" : "text-foreground"}`}>
            {state.loans.toLocaleString()}
          </p>
          {state.emiPerMonth > 0 && (
            <p className="text-xs text-muted-foreground font-mono">
              EMI: {state.emiPerMonth}/mo
            </p>
          )}
        </Card>

        {/* Monthly Income */}
        <Card className="border-4 border-border bg-card p-4 shadow-[2px_2px_0_0_rgba(0,0,0,0.2)]">
          <div className="flex items-center gap-2 text-muted-foreground">
            <TrendingUp className="h-4 w-4" />
            <span className="text-xs font-bold uppercase tracking-wide font-mono">
              Income
            </span>
          </div>
          <p className="mt-2 text-xl font-bold text-accent font-mono">
            {state.income.toLocaleString()}
          </p>
          <p className="text-xs text-muted-foreground font-mono">/month</p>
        </Card>

        {/* Future Score */}
        <Card className="border-4 border-border bg-card p-4 shadow-[2px_2px_0_0_rgba(0,0,0,0.2)]">
          <div className="flex items-center gap-2 text-muted-foreground">
            <TrendingUp className="h-4 w-4" />
            <span className="text-xs font-bold uppercase tracking-wide font-mono">
              XP
            </span>
          </div>
          <p className="mt-2 text-xl font-bold text-primary font-mono">
            {state.futureScore}
          </p>
          <Progress
            value={Math.min(100, state.futureScore)}
            className="mt-2 h-2 border border-border"
          />
        </Card>

        {/* Stress Level */}
        <Card className="border-4 border-border bg-card p-4 shadow-[2px_2px_0_0_rgba(0,0,0,0.2)]">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Heart className="h-4 w-4" />
            <span className="text-xs font-bold uppercase tracking-wide font-mono">
              Stress
            </span>
          </div>
          <p className={`mt-2 text-xl font-bold font-mono ${stressColors[state.stress]}`}>
            {state.stress}
          </p>
          <Progress
            value={stressProgress[state.stress]}
            className={`mt-2 h-2 border border-border ${state.stress === "Critical" || state.stress === "High" ? "[&>div]:bg-destructive" : ""}`}
          />
        </Card>
      </div>

      {/* Scams Avoided Badge */}
      {state.scamsAvoided > 0 && (
        <div className="flex items-center gap-2 border-4 border-primary/50 bg-primary/10 px-4 py-2 shadow-[2px_2px_0_0_rgba(0,0,0,0.2)]">
          <Shield className="h-5 w-5 text-primary" />
          <span className="font-bold text-primary font-mono uppercase">
            Scams Avoided: {state.scamsAvoided}
          </span>
        </div>
      )}
    </div>
  )
}
