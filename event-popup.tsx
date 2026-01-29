"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import type { LifeEvent, GameState } from "@/lib/game-types"
import { AlertTriangle, Sparkles, Skull, FileText, Zap, TrendingUp, Shield } from "lucide-react"

interface EventPopupProps {
  event: LifeEvent | null
  open: boolean
  onChoice: (optionIndex: number) => void
  state: GameState
}

export function EventPopup({ event, open, onChoice, state }: EventPopupProps) {
  if (!event) return null

  const typeConfig = {
    emergency: { 
      icon: AlertTriangle, 
      color: "text-destructive", 
      bg: "bg-destructive/10",
      border: "border-destructive",
      label: "EMERGENCY" 
    },
    opportunity: { 
      icon: TrendingUp, 
      color: "text-primary", 
      bg: "bg-primary/10",
      border: "border-primary",
      label: "OPPORTUNITY" 
    },
    scam: { 
      icon: Shield, 
      color: "text-amber-500", 
      bg: "bg-amber-500/10",
      border: "border-amber-500",
      label: "SUSPICIOUS" 
    },
    regular: { 
      icon: FileText, 
      color: "text-accent", 
      bg: "bg-accent/10",
      border: "border-accent",
      label: "LIFE EVENT" 
    },
    random: { 
      icon: Zap, 
      color: "text-primary", 
      bg: "bg-primary/10",
      border: "border-primary",
      label: "RANDOM" 
    },
    boss: { 
      icon: Skull, 
      color: "text-destructive", 
      bg: "bg-destructive/20",
      border: "border-destructive",
      label: "BOSS EVENT" 
    },
  }

  const config = typeConfig[event.type]
  const Icon = config.icon

  const rarityColors = {
    common: "bg-muted text-muted-foreground border-muted",
    uncommon: "bg-primary/20 text-primary border-primary/50",
    rare: "bg-accent/20 text-accent border-accent/50",
    legendary: "bg-amber-500/20 text-amber-500 border-amber-500/50",
  }

  const riskStyles = {
    safe: "border-primary hover:bg-primary/20",
    moderate: "border-accent hover:bg-accent/20", 
    risky: "border-destructive hover:bg-destructive/20",
  }

  return (
    <Dialog open={open}>
      <DialogContent className="max-w-md border-4 border-border bg-card sm:max-w-lg shadow-[8px_8px_0_0_rgba(0,0,0,0.3)] p-0 gap-0">
        {/* Header */}
        <div className={`${config.bg} border-b-4 ${config.border} p-6`}>
          <DialogHeader>
            <div className="flex items-center gap-2 mb-3">
              <div className={`p-2 border-2 ${config.border} ${config.bg}`}>
                <Icon className={`h-5 w-5 ${config.color}`} />
              </div>
              <Badge variant="outline" className={`font-mono text-xs ${config.color} ${config.border}`}>
                {config.label}
              </Badge>
              <Badge variant="outline" className={`font-mono text-xs ${rarityColors[event.rarity]}`}>
                {event.rarity.toUpperCase()}
              </Badge>
            </div>
            
            <DialogTitle className="text-2xl font-mono uppercase flex items-center gap-3">
              <span className="text-3xl">{event.icon}</span>
              {event.title}
            </DialogTitle>
            <DialogDescription className="text-base leading-relaxed font-mono mt-2">
              {event.description}
            </DialogDescription>
          </DialogHeader>
        </div>

        {/* Options */}
        <div className="p-6 space-y-3">
          <p className="text-xs font-mono text-muted-foreground uppercase mb-4">Choose Your Action:</p>
          
          {event.options.map((option, index) => {
            const risk = option.risk || "safe"
            const riskStyle = riskStyles[risk]
            
            return (
              <button
                key={option.label}
                onClick={() => onChoice(index)}
                className={`w-full text-left p-4 border-4 font-mono transition-all bg-card shadow-[2px_2px_0_0_rgba(0,0,0,0.2)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none ${riskStyle}`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold uppercase">{option.label}</span>
                  {option.risk && (
                    <Badge 
                      variant="outline" 
                      className={`text-[10px] font-mono ${
                        option.risk === "safe" 
                          ? "text-primary border-primary/50" 
                          : option.risk === "moderate"
                            ? "text-accent border-accent/50"
                            : "text-destructive border-destructive/50"
                      }`}
                    >
                      {option.risk.toUpperCase()}
                    </Badge>
                  )}
                </div>
                <span className="text-xs text-muted-foreground block">
                  {option.description}
                </span>
              </button>
            )
          })}
        </div>

        {/* Footer Stats */}
        <div className="border-t-4 border-border bg-muted/50 px-6 py-3 flex justify-between text-xs font-mono text-muted-foreground">
          <span>Balance: ₹{state.balance.toLocaleString()}</span>
          <span>Savings: ₹{state.savings.toLocaleString()}</span>
          <span>Stress: {state.stress}</span>
        </div>
      </DialogContent>
    </Dialog>
  )
}
