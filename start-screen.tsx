"use client"

import React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Play, ChevronRight, Coins, Wallet, PiggyBank, User, Briefcase, ArrowLeft, Sword, Shield, Zap, Heart } from "lucide-react"
import type { GameState } from "@/lib/game-types"

interface StartScreenProps {
  onStart: (config: Partial<GameState>) => void
}

export function StartScreen({ onStart }: StartScreenProps) {
  const [step, setStep] = useState<"menu" | "setup">("menu")
  const [playerName, setPlayerName] = useState("")
  const [age, setAge] = useState(22)
  const [monthlyIncome, setMonthlyIncome] = useState(25000)
  const [startingBalance, setStartingBalance] = useState(15000)
  const [savings, setSavings] = useState(10000)
  const [difficulty, setDifficulty] = useState<"peaceful" | "survival" | "hardcore">("survival")

  const handleStartGame = () => {
    onStart({
      balance: startingBalance,
      savings: savings,
      income: monthlyIncome,
      age: age,
      playerName: playerName || "Player",
      difficulty: difficulty,
    })
  }

  const difficultyPresets = {
    peaceful: { 
      income: 35000, 
      balance: 25000, 
      savings: 20000, 
      label: "Peaceful", 
      desc: "2 events/month, easier challenges",
      color: "border-primary bg-primary/20",
      events: 2,
    },
    survival: { 
      income: 25000, 
      balance: 15000, 
      savings: 10000, 
      label: "Survival", 
      desc: "3 events/month, balanced difficulty",
      color: "border-accent bg-accent/20",
      events: 3,
    },
    hardcore: { 
      income: 18000, 
      balance: 8000, 
      savings: 3000, 
      label: "Hardcore", 
      desc: "4 events/month, more rare events",
      color: "border-destructive bg-destructive/20",
      events: 4,
    },
  }

  const applyDifficulty = (diff: "peaceful" | "survival" | "hardcore") => {
    setDifficulty(diff)
    setMonthlyIncome(difficultyPresets[diff].income)
    setStartingBalance(difficultyPresets[diff].balance)
    setSavings(difficultyPresets[diff].savings)
  }

  if (step === "menu") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
        <div className="w-full max-w-lg text-center">
          {/* Title */}
          <div className="mb-8">
            <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center border-4 border-primary bg-primary/20 shadow-[4px_4px_0_0_rgba(0,0,0,0.3)]">
              <span className="text-5xl font-bold text-primary font-mono">$</span>
            </div>
            <h1 className="text-5xl font-bold tracking-tight text-foreground md:text-6xl font-mono uppercase">
              LifeQuest
            </h1>
            <p className="mt-2 text-lg text-accent font-mono">
              Financial Survival Simulator
            </p>
          </div>

          {/* Game Info Box */}
          <Card className="mb-8 border-4 border-border bg-card p-4 shadow-[2px_2px_0_0_rgba(0,0,0,0.2)] text-left">
            <p className="text-xs text-muted-foreground font-mono mb-3 uppercase">How to Play:</p>
            <ul className="space-y-2 text-sm font-mono text-muted-foreground">
              <li className="flex items-center gap-2">
                <Sword className="h-4 w-4 text-accent flex-shrink-0" />
                Face multiple life events each month
              </li>
              <li className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-primary flex-shrink-0" />
                Avoid scams and make smart decisions
              </li>
              <li className="flex items-center gap-2">
                <Heart className="h-4 w-4 text-destructive flex-shrink-0" />
                Manage stress and build your future
              </li>
              <li className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-accent flex-shrink-0" />
                Survive 12 months to win!
              </li>
            </ul>
          </Card>

          {/* Menu Buttons */}
          <div className="flex flex-col gap-3">
            <MenuButton onClick={() => setStep("setup")}>
              <Play className="h-5 w-5" />
              Start New Game
            </MenuButton>
            <MenuButton onClick={() => {}} disabled>
              Load Save (Coming Soon)
            </MenuButton>
            <MenuButton onClick={() => {}} disabled>
              Multiplayer (Coming Soon)
            </MenuButton>
          </div>

          {/* Bottom Info */}
          <div className="mt-12 flex items-center justify-center gap-4 text-muted-foreground text-sm font-mono">
            <span>v2.0.0</span>
            <span>|</span>
            <span>Financial Literacy Edition</span>
          </div>

          {/* Splash Text */}
          <div className="mt-4 text-accent text-sm font-mono animate-pulse">
            {"\"Save money, avoid scams, build your future!\""}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-2xl">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => setStep("menu")}
          className="mb-6 text-muted-foreground hover:text-foreground font-mono"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Menu
        </Button>

        {/* Title */}
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-foreground font-mono uppercase">
            Create New World
          </h2>
          <p className="mt-2 text-muted-foreground font-mono">
            Configure your financial journey
          </p>
        </div>

        {/* Setup Form */}
        <Card className="border-4 border-border bg-card p-6 shadow-[4px_4px_0_0_rgba(0,0,0,0.3)]">
          {/* Player Info */}
          <div className="mb-6">
            <h3 className="text-lg font-bold text-foreground font-mono mb-4 flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              Player Info
            </h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label className="font-mono text-sm text-muted-foreground">Player Name</Label>
                <Input
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  placeholder="Enter your name"
                  className="mt-1 font-mono border-2 border-border bg-input"
                />
              </div>
              <div>
                <Label className="font-mono text-sm text-muted-foreground">Starting Age</Label>
                <Input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(Number(e.target.value))}
                  min={18}
                  max={35}
                  className="mt-1 font-mono border-2 border-border bg-input"
                />
              </div>
            </div>
          </div>

          {/* Difficulty Selection */}
          <div className="mb-6">
            <h3 className="text-lg font-bold text-foreground font-mono mb-4 flex items-center gap-2">
              <Sword className="h-5 w-5 text-accent" />
              Difficulty
            </h3>
            <div className="grid gap-3 md:grid-cols-3">
              {(["peaceful", "survival", "hardcore"] as const).map((diff) => (
                <button
                  key={diff}
                  onClick={() => applyDifficulty(diff)}
                  className={`p-4 border-4 transition-all font-mono text-left ${
                    difficulty === diff
                      ? `${difficultyPresets[diff].color} shadow-[2px_2px_0_0_rgba(0,0,0,0.3)]`
                      : "border-border bg-secondary hover:border-muted-foreground shadow-[2px_2px_0_0_rgba(0,0,0,0.2)]"
                  }`}
                >
                  <span className="block text-sm font-bold text-foreground uppercase">
                    {difficultyPresets[diff].label}
                  </span>
                  <span className="block text-xs text-muted-foreground mt-1">
                    {difficultyPresets[diff].desc}
                  </span>
                  <span className="block text-xs text-accent mt-2">
                    {difficultyPresets[diff].events} events/month
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Financial Setup */}
          <div className="mb-6">
            <h3 className="text-lg font-bold text-foreground font-mono mb-4 flex items-center gap-2">
              <Coins className="h-5 w-5 text-accent" />
              Starting Resources
            </h3>
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <Label className="font-mono text-sm text-muted-foreground flex items-center gap-2">
                  <Briefcase className="h-4 w-4" />
                  Monthly Income
                </Label>
                <Input
                  type="number"
                  value={monthlyIncome}
                  onChange={(e) => setMonthlyIncome(Number(e.target.value))}
                  min={10000}
                  max={100000}
                  step={1000}
                  className="mt-1 font-mono border-2 border-border bg-input"
                />
              </div>
              <div>
                <Label className="font-mono text-sm text-muted-foreground flex items-center gap-2">
                  <Wallet className="h-4 w-4" />
                  Starting Balance
                </Label>
                <Input
                  type="number"
                  value={startingBalance}
                  onChange={(e) => setStartingBalance(Number(e.target.value))}
                  min={0}
                  max={100000}
                  step={1000}
                  className="mt-1 font-mono border-2 border-border bg-input"
                />
              </div>
              <div>
                <Label className="font-mono text-sm text-muted-foreground flex items-center gap-2">
                  <PiggyBank className="h-4 w-4" />
                  Emergency Savings
                </Label>
                <Input
                  type="number"
                  value={savings}
                  onChange={(e) => setSavings(Number(e.target.value))}
                  min={0}
                  max={100000}
                  step={1000}
                  className="mt-1 font-mono border-2 border-border bg-input"
                />
              </div>
            </div>
          </div>

          {/* Preview Stats */}
          <div className="mb-6 p-4 bg-muted/50 border-2 border-border">
            <h4 className="font-mono text-sm font-bold text-foreground mb-3">World Preview</h4>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
              <StatPreview label="Name" value={playerName || "Player"} />
              <StatPreview label="Age" value={`${age} yrs`} />
              <StatPreview label="Income" value={`₹${monthlyIncome.toLocaleString()}`} color="text-primary" />
              <StatPreview label="Balance" value={`₹${startingBalance.toLocaleString()}`} color="text-accent" />
              <StatPreview label="Savings" value={`₹${savings.toLocaleString()}`} color="text-primary" />
            </div>
          </div>

          {/* Start Button */}
          <Button
            onClick={handleStartGame}
            className="w-full h-14 text-lg font-mono font-bold uppercase border-4 border-primary bg-primary text-primary-foreground hover:bg-primary/90 shadow-[4px_4px_0_0_rgba(0,0,0,0.3)] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all"
          >
            <Play className="mr-2 h-5 w-5" />
            Create World & Play
          </Button>
        </Card>

        {/* Tips */}
        <Card className="mt-6 border-4 border-border bg-muted/30 p-4 shadow-[2px_2px_0_0_rgba(0,0,0,0.2)]">
          <p className="text-center text-muted-foreground font-mono text-sm">
            <span className="text-accent font-bold">Tip:</span> Save at least 3 months of expenses for emergencies. Avoid sharing OTPs with anyone!
          </p>
        </Card>
      </div>
    </div>
  )
}

function MenuButton({ children, onClick, disabled }: { children: React.ReactNode; onClick: () => void; disabled?: boolean }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-full py-4 px-6 font-mono text-lg font-bold uppercase border-4 transition-all
        ${disabled 
          ? "border-muted bg-muted/50 text-muted-foreground cursor-not-allowed" 
          : "border-border bg-secondary text-foreground hover:border-accent hover:bg-accent hover:text-accent-foreground shadow-[4px_4px_0_0_rgba(0,0,0,0.3)] active:translate-x-1 active:translate-y-1 active:shadow-none"
        }`}
    >
      <span className="flex items-center justify-center gap-2">
        {children}
        {!disabled && <ChevronRight className="h-5 w-5" />}
      </span>
    </button>
  )
}

function StatPreview({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground font-mono uppercase">{label}</p>
      <p className={`text-sm font-bold font-mono truncate ${color || "text-foreground"}`}>{value}</p>
    </div>
  )
}
