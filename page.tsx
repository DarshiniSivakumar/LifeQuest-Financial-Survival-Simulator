"use client"

import { useState, useCallback, useEffect } from "react"
import { Dashboard } from "@/components/game/dashboard"
import { EventPopup } from "@/components/game/event-popup"
import { ConsequenceCard } from "@/components/game/consequence-card"
import { MonthlySummary } from "@/components/game/monthly-summary"
import { StartScreen } from "@/components/game/start-screen"
import { GameOver } from "@/components/game/game-over"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import {
  type GameState,
  type LifeEvent,
  MONTHS,
  ACHIEVEMENTS,
  getRandomEvents,
} from "@/lib/game-types"
import { Sword, Heart, Shield, Trophy, Zap, Calendar, ChevronRight, Sparkles } from "lucide-react"

type GamePhase = "start" | "playing" | "event" | "consequence" | "summary" | "gameover"

const EVENTS_PER_MONTH = {
  peaceful: 2,
  survival: 3,
  hardcore: 4,
}

const getInitialState = (config?: Partial<GameState>): GameState => ({
  balance: config?.balance ?? 15000,
  savings: config?.savings ?? 10000,
  loans: 0,
  emiPerMonth: 0,
  stress: "Low",
  futureScore: 50,
  month: 0,
  day: 1,
  age: config?.age ?? 22,
  monthName: "January",
  income: config?.income ?? 25000,
  scamsAvoided: 0,
  decisionsHistory: [],
  achievements: [],
  eventsThisMonth: 0,
  totalEventsHandled: 0,
  streak: 0,
  playerName: config?.playerName ?? "Player",
  difficulty: config?.difficulty ?? "survival",
})

export default function FinancialGamePage() {
  const [gamePhase, setGamePhase] = useState<GamePhase>("start")
  const [gameState, setGameState] = useState<GameState>(getInitialState())
  const [currentEvent, setCurrentEvent] = useState<LifeEvent | null>(null)
  const [monthEvents, setMonthEvents] = useState<LifeEvent[]>([])
  const [currentEventIndex, setCurrentEventIndex] = useState(0)
  const [consequence, setConsequence] = useState<string>("")
  const [stateChanges, setStateChanges] = useState<Record<string, { before: number | string; after: number | string }>>({})
  const [usedEvents, setUsedEvents] = useState<Set<string>>(new Set())
  const [newAchievements, setNewAchievements] = useState<string[]>([])
  const [showAchievement, setShowAchievement] = useState(false)

  const startGame = (config?: Partial<GameState>) => {
    const newState = getInitialState(config)
    setGameState(newState)
    setUsedEvents(new Set())
    setMonthEvents([])
    setCurrentEventIndex(0)
    setNewAchievements([])
    setGamePhase("playing")
  }

  // Check for new achievements
  const checkAchievements = useCallback((state: GameState) => {
    const earned: string[] = []
    for (const achievement of ACHIEVEMENTS) {
      if (!state.achievements.includes(achievement.id) && achievement.condition(state)) {
        earned.push(achievement.id)
      }
    }
    return earned
  }, [])

  // Generate events for the month
  const generateMonthEvents = useCallback(() => {
    const eventsCount = EVENTS_PER_MONTH[gameState.difficulty]
    const events = getRandomEvents(eventsCount, usedEvents, gameState.month, gameState.difficulty)
    
    // Update used events
    const newUsed = new Set(usedEvents)
    for (const event of events) {
      newUsed.add(event.id)
    }
    setUsedEvents(newUsed)
    setMonthEvents(events)
    setCurrentEventIndex(0)
    
    return events
  }, [gameState.month, gameState.difficulty, usedEvents])

  const startMonth = useCallback(() => {
    const events = generateMonthEvents()
    if (events.length > 0) {
      setCurrentEvent(events[0])
      setGamePhase("event")
    } else {
      setGamePhase("summary")
    }
  }, [generateMonthEvents])

  const handleChoice = (optionIndex: number) => {
    if (!currentEvent) return

    const option = currentEvent.options[optionIndex]
    const beforeState = { ...gameState }
    const changes = option.action(gameState)
    
    // Calculate day based on event index
    const dayOfMonth = Math.floor((currentEventIndex + 1) * (28 / monthEvents.length))
    
    const newState: GameState = {
      ...gameState,
      ...changes,
      day: dayOfMonth,
      totalEventsHandled: gameState.totalEventsHandled + 1,
      eventsThisMonth: gameState.eventsThisMonth + 1,
      streak: (changes.stress === "Low" || gameState.stress === "Low") ? gameState.streak + 1 : 0,
      decisionsHistory: [
        ...gameState.decisionsHistory,
        {
          event: currentEvent.title,
          choice: option.label,
          impact: option.consequence,
          day: dayOfMonth,
          month: gameState.monthName,
        },
      ],
    }

    // Check for achievements
    const earnedAchievements = checkAchievements(newState)
    if (earnedAchievements.length > 0) {
      newState.achievements = [...newState.achievements, ...earnedAchievements]
      setNewAchievements(earnedAchievements)
      setShowAchievement(true)
    }

    // Build state changes for display
    const displayChanges: Record<string, { before: number | string; after: number | string }> = {}
    const keys = ["balance", "savings", "loans", "stress", "futureScore", "income"] as const
    for (const key of keys) {
      if (beforeState[key] !== newState[key]) {
        displayChanges[key] = { before: beforeState[key], after: newState[key] }
      }
    }

    setStateChanges(displayChanges)
    setGameState(newState)
    setConsequence(option.consequence)
    setGamePhase("consequence")
  }

  const handleConsequenceContinue = () => {
    // Check if there are more events this month
    const nextIndex = currentEventIndex + 1
    if (nextIndex < monthEvents.length) {
      setCurrentEventIndex(nextIndex)
      setCurrentEvent(monthEvents[nextIndex])
      setGamePhase("event")
    } else {
      // Month complete, show summary
      setGamePhase("summary")
    }
  }

  const handleNextMonth = () => {
    const expenses = gameState.emiPerMonth + Math.floor(gameState.income * 0.6)
    const netChange = gameState.income - expenses

    const newMonth = (gameState.month + 1) % 12
    const yearsPassed = Math.floor((gameState.month + 1) / 12)

    const newState: GameState = {
      ...gameState,
      balance: gameState.balance + netChange,
      month: newMonth,
      day: 1,
      monthName: MONTHS[newMonth],
      age: gameState.age + yearsPassed,
      loans: Math.max(0, gameState.loans - (gameState.emiPerMonth > 0 ? 500 : 0)),
      eventsThisMonth: 0,
      stress:
        gameState.stress === "Critical"
          ? "High"
          : gameState.stress === "High"
            ? "Medium"
            : gameState.stress,
    }

    setGameState(newState)
    setCurrentEvent(null)
    setMonthEvents([])

    if (gameState.month === 11) {
      setGamePhase("gameover")
    } else {
      setGamePhase("playing")
    }
  }

  // Auto-hide achievement notification
  useEffect(() => {
    if (showAchievement) {
      const timer = setTimeout(() => setShowAchievement(false), 3000)
      return () => clearTimeout(timer)
    }
  }, [showAchievement])

  if (gamePhase === "start") {
    return <StartScreen onStart={startGame} />
  }

  if (gamePhase === "gameover") {
    return <GameOver state={gameState} onRestart={() => startGame()} />
  }

  // Calculate progress
  const healthPercent = Math.max(0, Math.min(100, gameState.futureScore))
  const stressPercent = gameState.stress === "Low" ? 100 : gameState.stress === "Medium" ? 70 : gameState.stress === "High" ? 40 : 15
  const monthProgress = (currentEventIndex / Math.max(1, monthEvents.length)) * 100
  const yearProgress = ((gameState.month) / 12) * 100

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Achievement Popup */}
      {showAchievement && newAchievements.length > 0 && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-top duration-300">
          <Card className="border-4 border-accent bg-accent/20 p-4 shadow-[4px_4px_0_0_rgba(0,0,0,0.3)]">
            <div className="flex items-center gap-3">
              <Trophy className="h-8 w-8 text-accent" />
              <div>
                <p className="text-xs text-muted-foreground font-mono uppercase">Achievement Unlocked!</p>
                <p className="font-bold text-foreground font-mono">
                  {ACHIEVEMENTS.find(a => a.id === newAchievements[0])?.title}
                </p>
              </div>
            </div>
          </Card>
        </div>
      )}

      <div className="container mx-auto max-w-4xl p-4 md:p-6">
        {/* Header */}
        <header className="mb-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center bg-primary border-4 border-border shadow-[3px_3px_0_0_rgba(0,0,0,0.3)]">
                <span className="text-2xl font-bold text-primary-foreground font-mono">$</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground font-mono uppercase tracking-tight">
                  {gameState.playerName}&apos;s Quest
                </h1>
                <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono">
                  <Calendar className="h-3 w-3" />
                  <span>{gameState.monthName} {gameState.day}, Year 1</span>
                  <span className="text-accent">|</span>
                  <span>Age {gameState.age}</span>
                </div>
              </div>
            </div>
            
            {/* Stats Bars */}
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <Heart className="h-4 w-4 text-destructive" />
                <div className="w-32 h-3 bg-muted border-2 border-border overflow-hidden">
                  <div 
                    className="h-full bg-destructive transition-all duration-500"
                    style={{ width: `${healthPercent}%` }}
                  />
                </div>
                <span className="text-xs font-mono w-8">{gameState.futureScore}</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-primary" />
                <div className="w-32 h-3 bg-muted border-2 border-border overflow-hidden">
                  <div 
                    className="h-full bg-primary transition-all duration-500"
                    style={{ width: `${stressPercent}%` }}
                  />
                </div>
                <span className="text-xs font-mono w-8">{gameState.stress}</span>
              </div>
            </div>
          </div>

          {/* Year Progress */}
          <div className="mt-4">
            <div className="flex items-center justify-between text-xs font-mono text-muted-foreground mb-1">
              <span>YEAR PROGRESS</span>
              <span>{gameState.month + 1}/12 MONTHS</span>
            </div>
            <div className="h-2 bg-muted border-2 border-border overflow-hidden">
              <div 
                className="h-full bg-accent transition-all duration-500"
                style={{ width: `${yearProgress}%` }}
              />
            </div>
          </div>
        </header>

        {/* Dashboard */}
        <Dashboard state={gameState} />

        {/* Achievements Row */}
        {gameState.achievements.length > 0 && (
          <div className="mt-4 flex gap-2 flex-wrap">
            {gameState.achievements.map(id => {
              const achievement = ACHIEVEMENTS.find(a => a.id === id)
              return achievement ? (
                <Badge 
                  key={id} 
                  variant="outline" 
                  className="border-2 border-accent bg-accent/10 font-mono text-xs gap-1"
                >
                  <span>{achievement.icon}</span>
                  {achievement.title}
                </Badge>
              ) : null
            })}
          </div>
        )}

        {/* Action Area */}
        {gamePhase === "playing" && (
          <Card className="mt-6 border-4 border-dashed border-accent/50 bg-card p-8 text-center shadow-[4px_4px_0_0_rgba(0,0,0,0.2)]">
            <Sparkles className="h-12 w-12 mx-auto mb-4 text-accent" />
            <h3 className="text-xl font-bold text-foreground mb-2 font-mono uppercase">
              {gameState.monthName} Awaits
            </h3>
            <p className="text-muted-foreground mb-2 font-mono text-sm">
              {EVENTS_PER_MONTH[gameState.difficulty]} life events will challenge you this month.
            </p>
            <p className="text-xs text-muted-foreground mb-6 font-mono">
              Difficulty: <span className="text-accent uppercase">{gameState.difficulty}</span>
            </p>
            <Button
              onClick={startMonth}
              className="h-14 px-8 text-lg font-mono font-bold uppercase border-4 border-primary bg-primary text-primary-foreground hover:bg-primary/90 shadow-[4px_4px_0_0_rgba(0,0,0,0.3)] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all"
            >
              <Sword className="mr-2 h-5 w-5" />
              Begin Month
            </Button>
          </Card>
        )}

        {/* Month Events Progress */}
        {(gamePhase === "event" || gamePhase === "consequence") && monthEvents.length > 0 && (
          <Card className="mt-4 border-4 border-border bg-card p-4 shadow-[2px_2px_0_0_rgba(0,0,0,0.2)]">
            <div className="flex items-center justify-between text-xs font-mono text-muted-foreground mb-2">
              <span className="flex items-center gap-2">
                <Zap className="h-3 w-3 text-accent" />
                EVENT {currentEventIndex + 1} OF {monthEvents.length}
              </span>
              <span>{gameState.monthName}</span>
            </div>
            <div className="flex gap-2">
              {monthEvents.map((event, idx) => (
                <div
                  key={event.id}
                  className={`flex-1 h-3 border-2 border-border transition-all duration-300 ${
                    idx < currentEventIndex 
                      ? "bg-primary" 
                      : idx === currentEventIndex 
                        ? "bg-accent animate-pulse" 
                        : "bg-muted"
                  }`}
                />
              ))}
            </div>
            <div className="flex justify-between mt-2">
              {monthEvents.map((event, idx) => (
                <span 
                  key={event.id}
                  className={`text-lg ${idx <= currentEventIndex ? "" : "opacity-30"}`}
                >
                  {event.icon}
                </span>
              ))}
            </div>
          </Card>
        )}

        {/* Recent Decisions Log */}
        {gameState.decisionsHistory.length > 0 && gamePhase === "playing" && (
          <Card className="mt-6 border-4 border-border bg-card p-4 shadow-[2px_2px_0_0_rgba(0,0,0,0.2)]">
            <h3 className="font-bold text-foreground font-mono uppercase mb-3 text-sm flex items-center gap-2">
              <ChevronRight className="h-4 w-4" />
              Recent Quest Log
            </h3>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {gameState.decisionsHistory.slice(-3).reverse().map((decision, i) => (
                <div
                  key={`${decision.event}-${decision.day}-${i}`}
                  className="border-2 border-border bg-muted/50 p-2 text-xs font-mono"
                >
                  <span className="text-muted-foreground">{decision.month} {decision.day}:</span>{" "}
                  <span className="font-bold text-accent">{decision.event}</span>
                  <span className="text-muted-foreground"> - {decision.choice}</span>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Hotbar */}
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 hidden md:flex z-40">
          <div className="flex gap-1 bg-card/95 border-4 border-border p-2 shadow-[4px_4px_0_0_rgba(0,0,0,0.3)] backdrop-blur-sm">
            <HotbarSlot label="Balance" value={`₹${gameState.balance.toLocaleString()}`} active />
            <HotbarSlot label="Savings" value={`₹${gameState.savings.toLocaleString()}`} highlight={gameState.savings >= 20000} />
            <HotbarSlot label="Income" value={`₹${gameState.income.toLocaleString()}`} />
            <HotbarSlot label="Loans" value={`₹${gameState.loans.toLocaleString()}`} warning={gameState.loans > 0} />
            <HotbarSlot label="Events" value={`${gameState.totalEventsHandled}`} />
            <HotbarSlot label="Scams" value={`${gameState.scamsAvoided} saved`} highlight={gameState.scamsAvoided > 0} />
          </div>
        </div>

        {/* Event Popup */}
        <EventPopup
          event={currentEvent}
          open={gamePhase === "event"}
          onChoice={handleChoice}
          state={gameState}
        />

        {/* Consequence Card */}
        <ConsequenceCard
          open={gamePhase === "consequence"}
          consequence={consequence}
          onContinue={handleConsequenceContinue}
          changes={stateChanges}
          hasMoreEvents={currentEventIndex < monthEvents.length - 1}
        />

        {/* Monthly Summary */}
        <MonthlySummary
          open={gamePhase === "summary"}
          state={gameState}
          onNextMonth={handleNextMonth}
          eventsHandled={monthEvents.length}
        />
      </div>
    </div>
  )
}

function HotbarSlot({ 
  label, 
  value, 
  active,
  highlight,
  warning,
}: { 
  label: string
  value: string
  active?: boolean
  highlight?: boolean
  warning?: boolean
}) {
  return (
    <div className={`w-20 h-16 flex flex-col items-center justify-center border-2 transition-colors ${
      active 
        ? "border-accent bg-accent/20" 
        : warning 
          ? "border-destructive/50 bg-destructive/10"
          : highlight
            ? "border-primary/50 bg-primary/10"
            : "border-border bg-secondary"
    }`}>
      <span className="text-[10px] text-muted-foreground font-mono uppercase">{label}</span>
      <span className={`text-xs font-bold font-mono ${
        warning ? "text-destructive" : highlight ? "text-primary" : "text-foreground"
      }`}>{value}</span>
    </div>
  )
}
