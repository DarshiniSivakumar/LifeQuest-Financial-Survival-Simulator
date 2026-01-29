"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import type { GameState } from "@/lib/game-types"
import { ArrowRight, Check, X, Trophy, Sword, Shield, TrendingUp } from "lucide-react"

interface MonthlySummaryProps {
  open: boolean
  state: GameState
  onNextMonth: () => void
  eventsHandled?: number
}

export function MonthlySummary({ open, state, onNextMonth, eventsHandled = 0 }: MonthlySummaryProps) {
  const expenses = state.emiPerMonth + Math.floor(state.income * 0.6)
  const netSavings = state.income - expenses
  const isLastMonth = state.month === 11

  // Calculate month grade
  const getMonthGrade = () => {
    let score = 0
    if (netSavings > 0) score += 2
    if (state.stress === "Low") score += 2
    else if (state.stress === "Medium") score += 1
    if (state.futureScore >= 60) score += 2
    if (state.scamsAvoided > 0) score += 1
    if (state.loans === 0) score += 1

    if (score >= 7) return { grade: "S", color: "text-amber-500", label: "PERFECT" }
    if (score >= 5) return { grade: "A", color: "text-primary", label: "EXCELLENT" }
    if (score >= 3) return { grade: "B", color: "text-accent", label: "GOOD" }
    if (score >= 2) return { grade: "C", color: "text-muted-foreground", label: "OKAY" }
    return { grade: "D", color: "text-destructive", label: "TOUGH" }
  }

  const monthGrade = getMonthGrade()

  return (
    <Dialog open={open}>
      <DialogContent className="max-w-md sm:max-w-lg border-4 border-border bg-card shadow-[8px_8px_0_0_rgba(0,0,0,0.3)] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="flex h-20 w-20 items-center justify-center border-4 border-primary bg-primary/20 text-3xl font-mono font-bold shadow-[2px_2px_0_0_rgba(0,0,0,0.2)]">
              {state.month + 1}
            </div>
            <div className={`flex h-20 w-20 items-center justify-center border-4 border-accent bg-accent/20 text-4xl font-mono font-bold shadow-[2px_2px_0_0_rgba(0,0,0,0.2)] ${monthGrade.color}`}>
              {monthGrade.grade}
            </div>
          </div>
          <DialogTitle className="text-center text-2xl font-mono uppercase">
            {state.monthName} Complete!
          </DialogTitle>
          <DialogDescription className="text-center text-base font-mono">
            <Badge variant="outline" className={`${monthGrade.color} border-current`}>
              {monthGrade.label} MONTH
            </Badge>
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 space-y-4">
          {/* Events Handled */}
          <div className="flex items-center justify-between border-4 border-accent bg-accent/10 p-3">
            <div className="flex items-center gap-2">
              <Sword className="h-5 w-5 text-accent" />
              <span className="font-mono font-bold uppercase text-sm">Events Handled</span>
            </div>
            <span className="font-mono font-bold text-accent text-xl">{eventsHandled}</span>
          </div>

          {/* Financial Overview */}
          <div className="border-4 border-border bg-secondary p-4 space-y-3">
            <h4 className="font-bold font-mono uppercase text-sm text-muted-foreground flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Financial Report
            </h4>
            
            <div className="flex items-center justify-between border-2 border-border bg-muted/50 p-2">
              <span className="text-muted-foreground font-mono text-sm">Income</span>
              <span className="font-bold text-primary font-mono">
                +₹{state.income.toLocaleString()}
              </span>
            </div>
            
            <div className="flex items-center justify-between border-2 border-border bg-muted/50 p-2">
              <span className="text-muted-foreground font-mono text-sm">Living Expenses</span>
              <span className="font-bold text-destructive font-mono">
                -₹{Math.floor(state.income * 0.6).toLocaleString()}
              </span>
            </div>
            
            {state.emiPerMonth > 0 && (
              <div className="flex items-center justify-between border-2 border-border bg-muted/50 p-2">
                <span className="text-muted-foreground font-mono text-sm">Loan EMI</span>
                <span className="font-bold text-destructive font-mono">
                  -₹{state.emiPerMonth.toLocaleString()}
                </span>
              </div>
            )}
            
            <div className="flex items-center justify-between border-2 border-primary bg-primary/20 p-2">
              <span className="font-bold text-foreground font-mono text-sm">NET CHANGE</span>
              <span
                className={`font-bold font-mono ${netSavings >= 0 ? "text-primary" : "text-destructive"}`}
              >
                {netSavings >= 0 ? "+" : ""}₹{netSavings.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Objectives */}
          <div className="border-4 border-border bg-secondary p-4 space-y-2">
            <h4 className="font-bold font-mono uppercase text-sm text-muted-foreground mb-3 flex items-center gap-2">
              <Trophy className="h-4 w-4" />
              Objectives
            </h4>
            
            <ObjectiveRow 
              achieved={state.scamsAvoided > 0}
              label={`Scams Avoided: ${state.scamsAvoided}`}
            />

            <ObjectiveRow 
              achieved={state.futureScore >= 60}
              label={`XP Score: ${state.futureScore} ${state.futureScore >= 60 ? "(Target Met)" : "(Target: 60)"}`}
            />

            <ObjectiveRow 
              achieved={state.stress === "Low" || state.stress === "Medium"}
              label={`Stress Level: ${state.stress}`}
              warning={state.stress === "High" || state.stress === "Critical"}
            />

            <ObjectiveRow 
              achieved={state.loans === 0}
              label={state.loans === 0 ? "Debt Free!" : `Outstanding Loans: ₹${state.loans.toLocaleString()}`}
              warning={state.loans > 0}
            />
          </div>

          {/* Current Stats */}
          <div className="grid grid-cols-2 gap-2 text-center">
            <div className="border-2 border-border bg-muted/50 p-3">
              <p className="text-xs text-muted-foreground font-mono">BALANCE</p>
              <p className="font-bold font-mono text-lg">₹{state.balance.toLocaleString()}</p>
            </div>
            <div className="border-2 border-border bg-muted/50 p-3">
              <p className="text-xs text-muted-foreground font-mono">SAVINGS</p>
              <p className="font-bold font-mono text-lg text-primary">₹{state.savings.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <button
          onClick={onNextMonth}
          className="mt-4 w-full h-14 font-mono font-bold uppercase border-4 border-primary bg-primary text-primary-foreground hover:bg-primary/90 shadow-[4px_4px_0_0_rgba(0,0,0,0.3)] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-2"
        >
          {isLastMonth ? "View Results" : "Next Month"}
          <ArrowRight className="h-5 w-5" />
        </button>

        {!isLastMonth && (
          <p className="text-center text-xs text-muted-foreground font-mono">
            {12 - state.month - 1} months remaining in Year 1
          </p>
        )}
      </DialogContent>
    </Dialog>
  )
}

function ObjectiveRow({ achieved, label, warning }: { achieved: boolean; label: string; warning?: boolean }) {
  return (
    <div className="flex items-center gap-3 border-2 border-border bg-muted/50 p-2">
      {achieved ? (
        <div className="h-6 w-6 border-2 border-primary bg-primary flex items-center justify-center flex-shrink-0">
          <Check className="h-4 w-4 text-primary-foreground" />
        </div>
      ) : warning ? (
        <div className="h-6 w-6 border-2 border-destructive bg-destructive flex items-center justify-center flex-shrink-0">
          <X className="h-4 w-4 text-destructive-foreground" />
        </div>
      ) : (
        <div className="h-6 w-6 border-2 border-muted-foreground bg-muted flex items-center justify-center flex-shrink-0">
          <X className="h-4 w-4 text-muted-foreground" />
        </div>
      )}
      <span className="text-sm text-muted-foreground font-mono">{label}</span>
    </div>
  )
}
