"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { GameState, ACHIEVEMENTS } from "@/lib/game-types"
import { Trophy, RefreshCw, Star, Shield, TrendingUp, Heart, Skull, Crown, Sword, Target, Coins } from "lucide-react"

interface GameOverProps {
  state: GameState
  onRestart: () => void
}

export function GameOver({ state, onRestart }: GameOverProps) {
  const netWorth = state.balance + state.savings - state.loans
  
  const getGrade = () => {
    const score = state.futureScore + (netWorth / 1000) + (state.scamsAvoided * 10) - (state.loans / 500)
    if (score >= 120) return { grade: "S", label: "LEGENDARY!", color: "text-amber-500", bgColor: "bg-amber-500/20 border-amber-500", icon: Crown }
    if (score >= 90) return { grade: "A", label: "EXCELLENT!", color: "text-primary", bgColor: "bg-primary/20 border-primary", icon: Trophy }
    if (score >= 60) return { grade: "B", label: "GOOD RUN", color: "text-accent", bgColor: "bg-accent/20 border-accent", icon: Star }
    if (score >= 30) return { grade: "C", label: "SURVIVED", color: "text-muted-foreground", bgColor: "bg-muted border-muted-foreground", icon: Target }
    return { grade: "D", label: "GAME OVER", color: "text-destructive", bgColor: "bg-destructive/20 border-destructive", icon: Skull }
  }

  const gradeInfo = getGrade()
  const GradeIcon = gradeInfo.icon

  const stats = [
    { icon: TrendingUp, label: "XP Score", value: state.futureScore, color: "text-primary" },
    { icon: Coins, label: "Net Worth", value: `₹${netWorth.toLocaleString()}`, color: netWorth >= 0 ? "text-accent" : "text-destructive" },
    { icon: Shield, label: "Scams Blocked", value: state.scamsAvoided, color: "text-primary" },
    { icon: Sword, label: "Events Handled", value: state.totalEventsHandled, color: "text-accent" },
    { icon: Heart, label: "Final Stress", value: state.stress, color: state.stress === "Low" ? "text-primary" : state.stress === "Critical" ? "text-destructive" : "text-accent" },
    { icon: Trophy, label: "Achievements", value: state.achievements.length, color: "text-amber-500" },
  ]

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-6">
      <div className="w-full max-w-2xl text-center">
        {/* Grade Display */}
        <div className="mb-8">
          <div className={`mx-auto mb-6 flex h-32 w-32 items-center justify-center border-4 ${gradeInfo.bgColor} shadow-[4px_4px_0_0_rgba(0,0,0,0.3)]`}>
            <GradeIcon className={`h-20 w-20 ${gradeInfo.color}`} />
          </div>
          <h1 className={`text-4xl font-bold md:text-5xl font-mono uppercase ${gradeInfo.color}`}>
            {gradeInfo.label}
          </h1>
          <p className="mt-2 text-muted-foreground font-mono">
            {state.playerName} survived 12 months of financial challenges!
          </p>
        </div>

        {/* Grade Card */}
        <Card className={`mb-6 border-4 ${gradeInfo.bgColor} p-8 shadow-[4px_4px_0_0_rgba(0,0,0,0.3)]`}>
          <p className="text-sm text-muted-foreground uppercase tracking-wide font-mono">Final Rank</p>
          <p className={`text-9xl font-bold font-mono ${gradeInfo.color}`}>{gradeInfo.grade}</p>
          <p className="text-muted-foreground font-mono mt-2">
            Difficulty: <span className="text-accent uppercase">{state.difficulty}</span>
          </p>
        </Card>

        {/* Stats Grid */}
        <div className="mb-8 grid grid-cols-2 gap-3 md:grid-cols-3">
          {stats.map((stat) => (
            <Card key={stat.label} className="border-4 border-border bg-card p-4 shadow-[2px_2px_0_0_rgba(0,0,0,0.2)]">
              <stat.icon className={`mx-auto h-6 w-6 ${stat.color}`} />
              <p className={`mt-2 text-2xl font-bold font-mono ${stat.color}`}>{stat.value}</p>
              <p className="text-xs text-muted-foreground font-mono uppercase">{stat.label}</p>
            </Card>
          ))}
        </div>

        {/* Achievements */}
        {state.achievements.length > 0 && (
          <Card className="mb-8 border-4 border-accent/50 bg-accent/10 p-6 shadow-[2px_2px_0_0_rgba(0,0,0,0.2)]">
            <h3 className="mb-4 font-bold text-foreground font-mono uppercase flex items-center justify-center gap-2">
              <Trophy className="h-5 w-5 text-accent" />
              Achievements Unlocked
            </h3>
            <div className="flex flex-wrap justify-center gap-2">
              {state.achievements.map((id) => (
                <Badge 
                  key={id} 
                  variant="outline"
                  className="border-2 border-accent bg-accent/20 font-mono text-sm py-1 px-3"
                >
                  {id.replace(/_/g, " ").toUpperCase()}
                </Badge>
              ))}
            </div>
          </Card>
        )}

        {/* Financial Summary */}
        <Card className="mb-8 border-4 border-border bg-muted/50 p-6 text-left shadow-[2px_2px_0_0_rgba(0,0,0,0.2)]">
          <h3 className="mb-4 font-bold text-foreground text-center font-mono uppercase">Financial Summary</h3>
          <div className="space-y-2 font-mono text-sm">
            <div className="flex justify-between p-2 bg-card border-2 border-border">
              <span className="text-muted-foreground">Final Balance</span>
              <span className="text-foreground font-bold">₹{state.balance.toLocaleString()}</span>
            </div>
            <div className="flex justify-between p-2 bg-card border-2 border-border">
              <span className="text-muted-foreground">Final Savings</span>
              <span className="text-primary font-bold">₹{state.savings.toLocaleString()}</span>
            </div>
            <div className="flex justify-between p-2 bg-card border-2 border-border">
              <span className="text-muted-foreground">Outstanding Loans</span>
              <span className={`font-bold ${state.loans > 0 ? "text-destructive" : "text-primary"}`}>
                ₹{state.loans.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between p-2 bg-primary/20 border-2 border-primary">
              <span className="text-foreground font-bold">Net Worth</span>
              <span className={`font-bold ${netWorth >= 0 ? "text-primary" : "text-destructive"}`}>
                ₹{netWorth.toLocaleString()}
              </span>
            </div>
          </div>
        </Card>

        {/* Key Learnings */}
        <Card className="mb-8 border-4 border-border bg-card p-6 text-left shadow-[2px_2px_0_0_rgba(0,0,0,0.2)]">
          <h3 className="mb-4 font-bold text-foreground text-center font-mono uppercase">Key Learnings</h3>
          <ul className="space-y-2 text-sm font-mono">
            <li className="flex items-start gap-3 p-2 bg-muted/50 border-2 border-border">
              <span className="text-primary font-bold">[+]</span>
              <span className="text-muted-foreground">Always maintain an emergency fund (3-6 months expenses)</span>
            </li>
            <li className="flex items-start gap-3 p-2 bg-muted/50 border-2 border-border">
              <span className="text-primary font-bold">[+]</span>
              <span className="text-muted-foreground">Never share OTP, PIN or card details with anyone</span>
            </li>
            <li className="flex items-start gap-3 p-2 bg-muted/50 border-2 border-border">
              <span className="text-primary font-bold">[+]</span>
              <span className="text-muted-foreground">If it sounds too good to be true, it probably is</span>
            </li>
            <li className="flex items-start gap-3 p-2 bg-muted/50 border-2 border-border">
              <span className="text-primary font-bold">[+]</span>
              <span className="text-muted-foreground">Invest in yourself - skills increase earning potential</span>
            </li>
          </ul>
        </Card>

        {/* Restart Button */}
        <Button
          onClick={onRestart}
          className="w-full md:w-auto h-14 px-12 text-lg font-mono font-bold uppercase border-4 border-primary bg-primary text-primary-foreground hover:bg-primary/90 shadow-[4px_4px_0_0_rgba(0,0,0,0.3)] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all"
        >
          <RefreshCw className="mr-2 h-5 w-5" />
          Play Again
        </Button>

        <p className="mt-6 text-muted-foreground font-mono text-sm">
          Try a different difficulty or customize your starting stats!
        </p>
      </div>
    </div>
  )
}
