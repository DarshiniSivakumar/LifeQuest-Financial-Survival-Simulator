export interface GameState {
  balance: number
  savings: number
  loans: number
  emiPerMonth: number
  stress: "Low" | "Medium" | "High" | "Critical"
  futureScore: number
  month: number
  day: number
  age: number
  monthName: string
  income: number
  scamsAvoided: number
  decisionsHistory: Decision[]
  achievements: string[]
  eventsThisMonth: number
  totalEventsHandled: number
  streak: number
  playerName: string
  difficulty: "peaceful" | "survival" | "hardcore"
}

export interface Decision {
  event: string
  choice: string
  impact: string
  day: number
  month: string
}

export interface LifeEvent {
  id: string
  title: string
  description: string
  icon: string
  type: "emergency" | "opportunity" | "scam" | "regular" | "random" | "boss"
  rarity: "common" | "uncommon" | "rare" | "legendary"
  expense?: number
  options: EventOption[]
  minMonth?: number
}

export interface EventOption {
  label: string
  description: string
  action: (state: GameState) => Partial<GameState>
  consequence: string
  risk?: "safe" | "moderate" | "risky"
}

export interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  condition: (state: GameState) => boolean
}

export const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
]

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: "first_save",
    title: "First Step",
    description: "Reach ₹20,000 in savings",
    icon: "🎯",
    condition: (state) => state.savings >= 20000,
  },
  {
    id: "scam_hunter",
    title: "Scam Hunter",
    description: "Avoid 3 scams",
    icon: "🛡️",
    condition: (state) => state.scamsAvoided >= 3,
  },
  {
    id: "debt_free",
    title: "Debt Free",
    description: "Clear all loans",
    icon: "🆓",
    condition: (state) => state.loans === 0 && state.totalEventsHandled > 5,
  },
  {
    id: "investor",
    title: "Smart Investor",
    description: "Reach future score of 80",
    icon: "📈",
    condition: (state) => state.futureScore >= 80,
  },
  {
    id: "survivor",
    title: "Survivor",
    description: "Complete 6 months",
    icon: "⚔️",
    condition: (state) => state.month >= 6,
  },
  {
    id: "zen_master",
    title: "Zen Master",
    description: "Keep stress Low for 3 consecutive events",
    icon: "🧘",
    condition: (state) => state.streak >= 3 && state.stress === "Low",
  },
  {
    id: "rich",
    title: "Wealthy",
    description: "Accumulate ₹100,000 total (balance + savings)",
    icon: "💎",
    condition: (state) => state.balance + state.savings >= 100000,
  },
]

// Expanded life events - many more for variety
export const LIFE_EVENTS: LifeEvent[] = [
  // EMERGENCIES
  {
    id: "medical_emergency",
    title: "Medical Emergency",
    description: "A sudden illness requires immediate hospital treatment. The estimated cost is ₹8,000.",
    icon: "🏥",
    type: "emergency",
    rarity: "uncommon",
    expense: 8000,
    options: [
      {
        label: "Use Savings",
        description: "Pay from your emergency fund",
        risk: "safe",
        action: (state) => ({
          savings: Math.max(0, state.savings - 8000),
          stress: state.savings >= 8000 ? state.stress : "High",
          futureScore: state.savings >= 8000 ? state.futureScore + 5 : state.futureScore - 5,
        }),
        consequence: "Paid ₹8,000 from savings. This is why emergency funds exist!",
      },
      {
        label: "Take Loan",
        description: "Borrow money at 12% interest",
        risk: "moderate",
        action: (state) => ({
          loans: state.loans + 8000,
          emiPerMonth: state.emiPerMonth + 1000,
          stress: "High",
          futureScore: state.futureScore - 10,
        }),
        consequence: "Added ₹8,000 loan. EMI increased by ₹1,000/month.",
      },
      {
        label: "Ignore It",
        description: "Hope it gets better",
        risk: "risky",
        action: (state) => ({
          stress: "Critical",
          futureScore: state.futureScore - 20,
        }),
        consequence: "Condition worsened severely. Major health and stress impact!",
      },
    ],
  },
  {
    id: "bike_breakdown",
    title: "Vehicle Breakdown",
    description: "Your bike/scooter broke down and needs ₹3,500 for repairs.",
    icon: "🏍️",
    type: "emergency",
    rarity: "common",
    expense: 3500,
    options: [
      {
        label: "Repair It",
        description: "Pay for repairs now",
        risk: "safe",
        action: (state) => ({
          balance: Math.max(0, state.balance - 3500),
          futureScore: state.futureScore + 2,
        }),
        consequence: "Vehicle repaired. Mobility restored!",
      },
      {
        label: "Use Public Transport",
        description: "Skip repairs for now",
        risk: "moderate",
        action: (state) => ({
          stress: state.stress === "Low" ? "Medium" : state.stress,
          futureScore: state.futureScore - 3,
        }),
        consequence: "Using buses and metros. Inconvenient but saves money.",
      },
    ],
  },
  {
    id: "phone_stolen",
    title: "Phone Stolen",
    description: "Your smartphone was pickpocketed! You need a replacement.",
    icon: "📱",
    type: "emergency",
    rarity: "uncommon",
    expense: 12000,
    options: [
      {
        label: "Buy New Phone",
        description: "Get a mid-range smartphone ₹12,000",
        risk: "safe",
        action: (state) => ({
          balance: Math.max(0, state.balance - 12000),
          stress: state.balance >= 12000 ? state.stress : "High",
        }),
        consequence: "New phone purchased. Stay alert next time!",
      },
      {
        label: "Buy Budget Phone",
        description: "Basic phone for ₹5,000",
        risk: "safe",
        action: (state) => ({
          balance: Math.max(0, state.balance - 5000),
          futureScore: state.futureScore - 2,
        }),
        consequence: "Budget phone works. Limited but functional.",
      },
      {
        label: "Borrow Old Phone",
        description: "Use a friend's spare",
        risk: "moderate",
        action: (state) => ({
          stress: state.stress === "Low" ? "Medium" : state.stress,
        }),
        consequence: "Old phone works. Uncomfortable but free.",
      },
    ],
  },
  {
    id: "laptop_crash",
    title: "Laptop Crashed",
    description: "Your laptop's hard drive failed. Data recovery costs ₹2,000, new SSD costs ₹4,000.",
    icon: "💻",
    type: "emergency",
    rarity: "uncommon",
    expense: 6000,
    options: [
      {
        label: "Full Repair",
        description: "Recovery + New SSD ₹6,000",
        risk: "safe",
        action: (state) => ({
          balance: Math.max(0, state.balance - 6000),
          futureScore: state.futureScore + 3,
        }),
        consequence: "Laptop fully restored with better performance!",
      },
      {
        label: "SSD Only",
        description: "Skip recovery, new SSD ₹4,000",
        risk: "moderate",
        action: (state) => ({
          balance: Math.max(0, state.balance - 4000),
          futureScore: state.futureScore - 2,
        }),
        consequence: "Lost old data but laptop works. Back up next time!",
      },
    ],
  },

  // OPPORTUNITIES
  {
    id: "investment_opportunity",
    title: "Investment Opportunity",
    description: "A mutual fund with good track record. Minimum investment: ₹5,000.",
    icon: "📈",
    type: "opportunity",
    rarity: "common",
    options: [
      {
        label: "Invest ₹5,000",
        description: "Start small",
        risk: "moderate",
        action: (state) => ({
          savings: Math.max(0, state.savings - 5000),
          futureScore: state.futureScore + 15,
        }),
        consequence: "Smart choice! Your investment will grow over time.",
      },
      {
        label: "Invest ₹10,000",
        description: "Go bigger",
        risk: "moderate",
        action: (state) => ({
          savings: Math.max(0, state.savings - 10000),
          futureScore: state.futureScore + 25,
        }),
        consequence: "Aggressive investment! Higher potential returns.",
      },
      {
        label: "Skip",
        description: "Not ready yet",
        risk: "safe",
        action: (state) => ({
          futureScore: state.futureScore - 2,
        }),
        consequence: "Missed opportunity. Maybe next time.",
      },
    ],
  },
  {
    id: "stock_tip",
    title: "Hot Stock Tip",
    description: "A colleague shares a 'sure thing' stock tip. Could double your money... or lose it all.",
    icon: "🎰",
    type: "opportunity",
    rarity: "rare",
    options: [
      {
        label: "Invest ₹3,000",
        description: "Take the risk",
        risk: "risky",
        action: (state) => {
          const win = Math.random() > 0.6
          return win
            ? { balance: state.balance + 6000, futureScore: state.futureScore + 10 }
            : { balance: Math.max(0, state.balance - 3000), futureScore: state.futureScore - 5 }
        },
        consequence: "The market decided your fate...",
      },
      {
        label: "Decline Politely",
        description: "Too risky",
        risk: "safe",
        action: (state) => ({
          futureScore: state.futureScore + 5,
        }),
        consequence: "Wise choice! Avoided speculative gambling.",
      },
    ],
  },
  {
    id: "freelance_gig",
    title: "Freelance Project",
    description: "A client offers ₹15,000 for a weekend project. It will be intense work.",
    icon: "💼",
    type: "opportunity",
    rarity: "uncommon",
    options: [
      {
        label: "Accept It",
        description: "Grind through the weekend",
        risk: "moderate",
        action: (state) => ({
          balance: state.balance + 15000,
          stress: state.stress === "Low" ? "Medium" : state.stress === "Medium" ? "High" : state.stress,
          futureScore: state.futureScore + 8,
        }),
        consequence: "Project completed! Earned ₹15,000 but feeling tired.",
      },
      {
        label: "Negotiate Higher",
        description: "Ask for ₹20,000",
        risk: "risky",
        action: (state) => {
          const accepted = Math.random() > 0.5
          return accepted
            ? { balance: state.balance + 20000, stress: "High" as const, futureScore: state.futureScore + 12 }
            : { futureScore: state.futureScore - 3 }
        },
        consequence: "Let's see if they accept...",
      },
      {
        label: "Decline",
        description: "Rest is important too",
        risk: "safe",
        action: (state) => ({
          stress: state.stress === "High" ? "Medium" : state.stress,
        }),
        consequence: "Prioritized well-being. Sometimes rest is productive.",
      },
    ],
  },
  {
    id: "side_business",
    title: "Business Opportunity",
    description: "A friend wants to start a small online business together. Initial investment: ₹20,000.",
    icon: "🏪",
    type: "opportunity",
    rarity: "rare",
    minMonth: 3,
    options: [
      {
        label: "Partner Up",
        description: "Invest and become co-owner",
        risk: "risky",
        action: (state) => ({
          savings: Math.max(0, state.savings - 20000),
          income: state.income + 3000,
          futureScore: state.futureScore + 20,
          stress: state.stress === "Low" ? "Medium" : state.stress,
        }),
        consequence: "Now a business owner! Passive income of ₹3,000/month.",
      },
      {
        label: "Silent Investor",
        description: "Invest ₹10,000, smaller share",
        risk: "moderate",
        action: (state) => ({
          savings: Math.max(0, state.savings - 10000),
          income: state.income + 1500,
          futureScore: state.futureScore + 10,
        }),
        consequence: "Smaller investment, smaller returns. ₹1,500/month passive income.",
      },
      {
        label: "Pass",
        description: "Not interested",
        risk: "safe",
        action: (state) => state,
        consequence: "Friendship intact, no financial change.",
      },
    ],
  },
  {
    id: "skill_course",
    title: "Skill Development",
    description: "An online certification course costs ₹3,000 but could boost your career.",
    icon: "📚",
    type: "opportunity",
    rarity: "common",
    options: [
      {
        label: "Enroll",
        description: "Invest in yourself",
        risk: "safe",
        action: (state) => ({
          balance: Math.max(0, state.balance - 3000),
          futureScore: state.futureScore + 18,
          income: state.income + 1500,
        }),
        consequence: "Course completed! Future income increased by ₹1,500/month.",
      },
      {
        label: "Maybe Later",
        description: "Not a priority now",
        risk: "safe",
        action: (state) => state,
        consequence: "No changes. Learning can wait.",
      },
    ],
  },
  {
    id: "gym_membership",
    title: "Gym Offer",
    description: "Annual gym membership at 50% off - ₹6,000 (usually ₹12,000).",
    icon: "💪",
    type: "opportunity",
    rarity: "common",
    options: [
      {
        label: "Sign Up",
        description: "Invest in health",
        risk: "safe",
        action: (state) => ({
          balance: Math.max(0, state.balance - 6000),
          stress: state.stress === "Critical" ? "High" : state.stress === "High" ? "Medium" : state.stress === "Medium" ? "Low" : state.stress,
          futureScore: state.futureScore + 8,
        }),
        consequence: "Health is wealth! Stress reduced, feeling energized.",
      },
      {
        label: "Skip",
        description: "Home workouts are free",
        risk: "safe",
        action: (state) => state,
        consequence: "Saved money. YouTube workouts it is!",
      },
    ],
  },

  // SCAMS
  {
    id: "scam_call",
    title: "Suspicious Bank Call",
    description: "Someone claiming to be from your bank asks for your OTP to 'verify your account'.",
    icon: "📞",
    type: "scam",
    rarity: "common",
    options: [
      {
        label: "Hang Up",
        description: "This is suspicious",
        risk: "safe",
        action: (state) => ({
          scamsAvoided: state.scamsAvoided + 1,
          futureScore: state.futureScore + 10,
        }),
        consequence: "Great awareness! Banks never ask for OTP on calls.",
      },
      {
        label: "Share OTP",
        description: "They sound genuine",
        risk: "risky",
        action: (state) => ({
          balance: Math.max(0, state.balance - 15000),
          stress: "Critical",
          futureScore: state.futureScore - 25,
        }),
        consequence: "SCAMMED! Lost ₹15,000. Never share OTP with anyone!",
      },
    ],
  },
  {
    id: "lottery_scam",
    title: "Lottery Winner!",
    description: "You received an SMS saying you won ₹5,00,000! Just pay ₹5,000 processing fee.",
    icon: "🎉",
    type: "scam",
    rarity: "common",
    options: [
      {
        label: "Ignore & Block",
        description: "Too good to be true",
        risk: "safe",
        action: (state) => ({
          scamsAvoided: state.scamsAvoided + 1,
          futureScore: state.futureScore + 10,
        }),
        consequence: "Smart! You can't win a lottery you never entered.",
      },
      {
        label: "Pay Fee",
        description: "What if it's real?",
        risk: "risky",
        action: (state) => ({
          balance: Math.max(0, state.balance - 5000),
          stress: "High",
          futureScore: state.futureScore - 15,
        }),
        consequence: "SCAMMED! Lost ₹5,000. No lottery, only scam.",
      },
    ],
  },
  {
    id: "job_scam",
    title: "Dream Job Offer",
    description: "Email about work-from-home job paying ₹50,000/month. Just pay ₹2,000 registration.",
    icon: "💼",
    type: "scam",
    rarity: "uncommon",
    options: [
      {
        label: "Report as Spam",
        description: "Legitimate jobs don't charge",
        risk: "safe",
        action: (state) => ({
          scamsAvoided: state.scamsAvoided + 1,
          futureScore: state.futureScore + 12,
        }),
        consequence: "Excellent judgment! Real jobs never ask for money.",
      },
      {
        label: "Apply & Pay",
        description: "Could be a real opportunity",
        risk: "risky",
        action: (state) => ({
          balance: Math.max(0, state.balance - 2000),
          stress: state.stress === "Low" ? "Medium" : "High",
          futureScore: state.futureScore - 10,
        }),
        consequence: "SCAMMED! Lost ₹2,000. No job, just empty promises.",
      },
    ],
  },
  {
    id: "crypto_scam",
    title: "Crypto Guru DM",
    description: "Instagram influencer DMs you about 'guaranteed 10x returns' in crypto. Minimum ₹10,000.",
    icon: "🪙",
    type: "scam",
    rarity: "uncommon",
    options: [
      {
        label: "Block & Report",
        description: "No guaranteed returns exist",
        risk: "safe",
        action: (state) => ({
          scamsAvoided: state.scamsAvoided + 1,
          futureScore: state.futureScore + 15,
        }),
        consequence: "Wise choice! Guaranteed returns in crypto = scam.",
      },
      {
        label: "Invest",
        description: "FOMO is real",
        risk: "risky",
        action: (state) => ({
          balance: Math.max(0, state.balance - 10000),
          stress: "Critical",
          futureScore: state.futureScore - 20,
        }),
        consequence: "SCAMMED! Lost ₹10,000. Influencer disappeared.",
      },
    ],
  },
  {
    id: "mlm_scheme",
    title: "Amazing Business Opportunity",
    description: "Old friend invites you to 'revolutionary business' meeting. Entry fee: ₹15,000.",
    icon: "🔺",
    type: "scam",
    rarity: "rare",
    options: [
      {
        label: "Politely Decline",
        description: "Sounds like MLM/pyramid",
        risk: "safe",
        action: (state) => ({
          scamsAvoided: state.scamsAvoided + 1,
          futureScore: state.futureScore + 12,
        }),
        consequence: "You recognized the pyramid scheme structure!",
      },
      {
        label: "Join the 'Team'",
        description: "Trust your friend",
        risk: "risky",
        action: (state) => ({
          balance: Math.max(0, state.balance - 15000),
          stress: "High",
          futureScore: state.futureScore - 18,
        }),
        consequence: "Trapped in MLM! Lost ₹15,000 and friendship strained.",
      },
    ],
  },

  // REGULAR EVENTS
  {
    id: "job_bonus",
    title: "Performance Bonus",
    description: "Great news! You received a ₹10,000 bonus for excellent work.",
    icon: "🏆",
    type: "regular",
    rarity: "uncommon",
    options: [
      {
        label: "Save All",
        description: "Add to emergency fund",
        risk: "safe",
        action: (state) => ({
          savings: state.savings + 10000,
          futureScore: state.futureScore + 12,
        }),
        consequence: "Excellent! Emergency fund growing strong.",
      },
      {
        label: "50-50 Split",
        description: "Save half, spend half",
        risk: "safe",
        action: (state) => ({
          savings: state.savings + 5000,
          balance: state.balance + 5000,
          futureScore: state.futureScore + 5,
          stress: state.stress === "High" ? "Medium" : state.stress,
        }),
        consequence: "Balanced approach! Saved ₹5,000, enjoyed ₹5,000.",
      },
      {
        label: "Treat Yourself",
        description: "You earned it!",
        risk: "moderate",
        action: (state) => ({
          balance: state.balance + 10000,
          stress: "Low",
          futureScore: state.futureScore - 3,
        }),
        consequence: "Enjoyed the bonus! Stress reduced significantly.",
      },
    ],
  },
  {
    id: "rent_increase",
    title: "Rent Increase Notice",
    description: "Landlord increasing rent by ₹2,000/month from next month.",
    icon: "🏠",
    type: "regular",
    rarity: "common",
    options: [
      {
        label: "Accept",
        description: "Stay where you are",
        risk: "safe",
        action: (state) => ({
          income: state.income - 2000,
          stress: state.income - 2000 > 10000 ? state.stress : "High",
        }),
        consequence: "Rent absorbed. Monthly budget tighter.",
      },
      {
        label: "Negotiate",
        description: "Try for ₹1,000 increase",
        risk: "moderate",
        action: (state) => {
          const success = Math.random() > 0.4
          return success
            ? { income: state.income - 1000, futureScore: state.futureScore + 5 }
            : { income: state.income - 2000 }
        },
        consequence: "Let's see how negotiation goes...",
      },
      {
        label: "Move Out",
        description: "Find cheaper place",
        risk: "moderate",
        action: (state) => ({
          balance: Math.max(0, state.balance - 8000),
          stress: "High",
          futureScore: state.futureScore + 3,
        }),
        consequence: "Moving costs ₹8,000 but saves money long-term.",
      },
    ],
  },
  {
    id: "friend_loan",
    title: "Friend Needs Money",
    description: "Close friend asks to borrow ₹5,000 urgently. Promises to return next month.",
    icon: "🤝",
    type: "regular",
    rarity: "common",
    options: [
      {
        label: "Lend Full Amount",
        description: "Help your friend",
        risk: "moderate",
        action: (state) => {
          const returned = Math.random() > 0.3
          return returned
            ? { balance: state.balance - 5000, futureScore: state.futureScore + 5 }
            : { balance: state.balance - 5000, stress: state.stress === "Low" ? "Medium" : state.stress }
        },
        consequence: "Money lent. Hope it comes back...",
      },
      {
        label: "Lend ₹2,000",
        description: "Partial help",
        risk: "moderate",
        action: (state) => ({
          balance: Math.max(0, state.balance - 2000),
        }),
        consequence: "Helped with what you could afford.",
      },
      {
        label: "Can't Help",
        description: "Finances are tight",
        risk: "safe",
        action: (state) => ({
          stress: state.stress === "Low" ? "Medium" : state.stress,
        }),
        consequence: "Prioritized your finances. Friendship slightly strained.",
      },
    ],
  },
  {
    id: "family_wedding",
    title: "Cousin's Wedding",
    description: "Cousin getting married! Expected gifts and travel: ₹8,000-15,000.",
    icon: "💒",
    type: "regular",
    rarity: "uncommon",
    options: [
      {
        label: "Go All Out",
        description: "₹15,000 for gifts & travel",
        risk: "moderate",
        action: (state) => ({
          balance: Math.max(0, state.balance - 15000),
          stress: state.balance >= 15000 ? "Low" : "High",
          futureScore: state.futureScore + 3,
        }),
        consequence: "Family happy! Great memories made.",
      },
      {
        label: "Modest Approach",
        description: "₹8,000 budget",
        risk: "safe",
        action: (state) => ({
          balance: Math.max(0, state.balance - 8000),
        }),
        consequence: "Attended within budget. Family understands.",
      },
      {
        label: "Send Gift Only",
        description: "₹3,000 gift, skip travel",
        risk: "safe",
        action: (state) => ({
          balance: Math.max(0, state.balance - 3000),
          stress: state.stress === "Low" ? "Medium" : state.stress,
        }),
        consequence: "Sent wishes remotely. Some family disappointed.",
      },
    ],
  },
  {
    id: "electricity_bill",
    title: "Surprise Bill",
    description: "Electricity bill way higher than usual: ₹4,500 (normally ₹1,500).",
    icon: "⚡",
    type: "regular",
    rarity: "common",
    options: [
      {
        label: "Pay Immediately",
        description: "Avoid late fees",
        risk: "safe",
        action: (state) => ({
          balance: Math.max(0, state.balance - 4500),
          futureScore: state.futureScore + 2,
        }),
        consequence: "Bill paid. Check AC usage next month!",
      },
      {
        label: "Dispute Bill",
        description: "Request meter reading check",
        risk: "moderate",
        action: (state) => {
          const success = Math.random() > 0.5
          return success
            ? { balance: state.balance - 2000, futureScore: state.futureScore + 5 }
            : { balance: state.balance - 5000, stress: state.stress === "Low" ? "Medium" : state.stress }
        },
        consequence: "Disputing with the electricity board...",
      },
    ],
  },
  {
    id: "promotion_opportunity",
    title: "Promotion Interview",
    description: "Chance for promotion! If selected, ₹8,000/month raise. Need to prepare presentation.",
    icon: "📊",
    type: "opportunity",
    rarity: "rare",
    minMonth: 4,
    options: [
      {
        label: "Prepare Hard",
        description: "Weekend prep, stress but worth it",
        risk: "moderate",
        action: (state) => {
          const success = Math.random() > 0.3
          return success
            ? { income: state.income + 8000, futureScore: state.futureScore + 25, stress: "Medium" as const }
            : { stress: "High" as const, futureScore: state.futureScore + 5 }
        },
        consequence: "Interview done. Waiting for results...",
      },
      {
        label: "Wing It",
        description: "You know your stuff",
        risk: "risky",
        action: (state) => {
          const success = Math.random() > 0.6
          return success
            ? { income: state.income + 8000, futureScore: state.futureScore + 20 }
            : { futureScore: state.futureScore - 5 }
        },
        consequence: "Confidence or overconfidence? Let's see...",
      },
      {
        label: "Decline",
        description: "Not ready for more responsibility",
        risk: "safe",
        action: (state) => ({
          futureScore: state.futureScore - 10,
        }),
        consequence: "Stayed in comfort zone. Missed growth opportunity.",
      },
    ],
  },

  // RANDOM ENCOUNTERS
  {
    id: "found_wallet",
    title: "Found a Wallet",
    description: "Found a wallet with ₹2,000 cash and an ID card on the street.",
    icon: "👛",
    type: "random",
    rarity: "rare",
    options: [
      {
        label: "Return It",
        description: "Find the owner",
        risk: "safe",
        action: (state) => ({
          futureScore: state.futureScore + 15,
          stress: state.stress === "High" ? "Medium" : state.stress,
        }),
        consequence: "Owner grateful! Good karma and self-respect boost.",
      },
      {
        label: "Keep the Cash",
        description: "Finders keepers",
        risk: "moderate",
        action: (state) => ({
          balance: state.balance + 2000,
          futureScore: state.futureScore - 8,
        }),
        consequence: "₹2,000 richer but conscience heavier.",
      },
    ],
  },
  {
    id: "street_food",
    title: "Street Food Craving",
    description: "Delicious street food cart nearby. ₹200 for amazing snacks.",
    icon: "🍜",
    type: "random",
    rarity: "common",
    options: [
      {
        label: "Treat Yourself",
        description: "Life's small pleasures",
        risk: "safe",
        action: (state) => ({
          balance: Math.max(0, state.balance - 200),
          stress: state.stress === "Critical" ? "High" : state.stress === "High" ? "Medium" : state.stress,
        }),
        consequence: "Delicious! Small joys matter.",
      },
      {
        label: "Walk Past",
        description: "Save the money",
        risk: "safe",
        action: (state) => state,
        consequence: "Resisted temptation. ₹200 saved!",
      },
    ],
  },
  {
    id: "lucky_draw",
    title: "Mall Lucky Draw",
    description: "Won a lucky draw at the mall! Choose your prize.",
    icon: "🎁",
    type: "random",
    rarity: "rare",
    options: [
      {
        label: "₹1,000 Voucher",
        description: "Shopping credit",
        risk: "safe",
        action: (state) => ({
          balance: state.balance + 1000,
          stress: state.stress === "High" ? "Medium" : state.stress,
        }),
        consequence: "Nice! Free shopping money.",
      },
      {
        label: "Mystery Box",
        description: "Could be amazing or meh",
        risk: "moderate",
        action: (state) => {
          const value = Math.random() > 0.5 ? 3000 : 500
          return { balance: state.balance + value }
        },
        consequence: "Opening the mystery box...",
      },
    ],
  },
  {
    id: "old_friend",
    title: "Old Friend Meetup",
    description: "Bumped into college friend. They suggest dinner at a nice restaurant.",
    icon: "🍽️",
    type: "random",
    rarity: "common",
    options: [
      {
        label: "Fancy Dinner",
        description: "₹1,500 but good times",
        risk: "safe",
        action: (state) => ({
          balance: Math.max(0, state.balance - 1500),
          stress: state.stress === "Critical" ? "High" : state.stress === "High" ? "Medium" : "Low",
          futureScore: state.futureScore + 3,
        }),
        consequence: "Great conversation! Networking and memories.",
      },
      {
        label: "Suggest Chai",
        description: "₹100 at tea stall",
        risk: "safe",
        action: (state) => ({
          balance: Math.max(0, state.balance - 100),
          stress: state.stress === "High" ? "Medium" : state.stress,
        }),
        consequence: "Simple catch-up. Budget-friendly bonding.",
      },
      {
        label: "Rain Check",
        description: "Too busy right now",
        risk: "safe",
        action: (state) => state,
        consequence: "Postponed meetup. Friend understands.",
      },
    ],
  },
  {
    id: "health_checkup",
    title: "Annual Health Checkup",
    description: "It's been a year. Full body checkup costs ₹2,500.",
    icon: "🏥",
    type: "regular",
    rarity: "uncommon",
    options: [
      {
        label: "Get Checked",
        description: "Prevention is better",
        risk: "safe",
        action: (state) => ({
          balance: Math.max(0, state.balance - 2500),
          futureScore: state.futureScore + 10,
          stress: state.stress === "Critical" ? "High" : state.stress,
        }),
        consequence: "Health report clear! Peace of mind.",
      },
      {
        label: "Skip This Year",
        description: "Feeling healthy anyway",
        risk: "moderate",
        action: (state) => ({
          futureScore: state.futureScore - 5,
        }),
        consequence: "Saved money but skipped important health check.",
      },
    ],
  },
  {
    id: "tax_season",
    title: "Tax Filing Due",
    description: "Income tax return deadline approaching. CA charges ₹1,000 or file yourself.",
    icon: "📋",
    type: "regular",
    rarity: "uncommon",
    minMonth: 2,
    options: [
      {
        label: "Hire CA",
        description: "Professional help ₹1,000",
        risk: "safe",
        action: (state) => ({
          balance: Math.max(0, state.balance - 1000),
          futureScore: state.futureScore + 5,
        }),
        consequence: "Filed correctly! Potential refund coming.",
      },
      {
        label: "DIY Filing",
        description: "Use online portal",
        risk: "moderate",
        action: (state) => {
          const success = Math.random() > 0.3
          return success
            ? { futureScore: state.futureScore + 8 }
            : { balance: Math.max(0, state.balance - 500), stress: state.stress === "Low" ? "Medium" : state.stress }
        },
        consequence: "Attempting to file yourself...",
      },
    ],
  },

  // BOSS EVENTS (Major events)
  {
    id: "job_loss",
    title: "Layoff Notice",
    description: "Company downsizing. You have 1 month notice. ₹50,000 severance offered.",
    icon: "💼",
    type: "boss",
    rarity: "legendary",
    minMonth: 5,
    options: [
      {
        label: "Accept & Job Hunt",
        description: "Take severance, find new job",
        risk: "moderate",
        action: (state) => ({
          balance: state.balance + 50000,
          income: 0,
          stress: "High",
          futureScore: state.futureScore - 10,
        }),
        consequence: "Severance received. Time to job hunt intensively!",
      },
      {
        label: "Negotiate More",
        description: "Ask for better package",
        risk: "risky",
        action: (state) => {
          const success = Math.random() > 0.4
          return success
            ? { balance: state.balance + 75000, income: 0, stress: "High" as const }
            : { balance: state.balance + 30000, income: 0, stress: "Critical" as const }
        },
        consequence: "Negotiating with HR...",
      },
    ],
  },
  {
    id: "inheritance",
    title: "Unexpected Inheritance",
    description: "Distant relative passed away. You inherited ₹1,00,000.",
    icon: "📜",
    type: "boss",
    rarity: "legendary",
    minMonth: 6,
    options: [
      {
        label: "Save It All",
        description: "Emergency fund boost",
        risk: "safe",
        action: (state) => ({
          savings: state.savings + 100000,
          futureScore: state.futureScore + 30,
        }),
        consequence: "Massive savings boost! Financial security improved.",
      },
      {
        label: "Invest It",
        description: "Put in mutual funds",
        risk: "moderate",
        action: (state) => ({
          savings: state.savings + 50000,
          futureScore: state.futureScore + 40,
        }),
        consequence: "Invested wisely! Long-term growth secured.",
      },
      {
        label: "Lifestyle Upgrade",
        description: "New phone, clothes, vacation",
        risk: "risky",
        action: (state) => ({
          balance: state.balance + 100000,
          stress: "Low",
          futureScore: state.futureScore + 5,
        }),
        consequence: "Living large! Enjoyed the windfall.",
      },
    ],
  },
  {
    id: "accident",
    title: "Road Accident",
    description: "Minor accident. Medical bills ₹25,000. Insurance may cover 50%.",
    icon: "🚑",
    type: "boss",
    rarity: "legendary",
    options: [
      {
        label: "Claim Insurance",
        description: "Wait for 50% coverage",
        risk: "moderate",
        action: (state) => ({
          balance: Math.max(0, state.balance - 12500),
          savings: Math.max(0, state.savings - 12500),
          stress: "High",
          futureScore: state.futureScore - 5,
        }),
        consequence: "Insurance claim filed. Paid ₹12,500 from pocket.",
      },
      {
        label: "Pay Fully",
        description: "Skip insurance hassle",
        risk: "safe",
        action: (state) => ({
          balance: Math.max(0, state.balance - 25000),
          stress: "High",
          futureScore: state.futureScore - 10,
        }),
        consequence: "Paid ₹25,000 fully. Recovery focus now.",
      },
    ],
  },
]

export const getRandomEvents = (
  count: number,
  usedIds: Set<string>,
  currentMonth: number,
  difficulty: string
): LifeEvent[] => {
  // Filter available events
  let available = LIFE_EVENTS.filter(
    (e) => !usedIds.has(e.id) && (!e.minMonth || currentMonth >= e.minMonth)
  )

  // Adjust probabilities based on difficulty
  const rarityWeights = {
    peaceful: { common: 50, uncommon: 30, rare: 15, legendary: 5 },
    survival: { common: 40, uncommon: 35, rare: 18, legendary: 7 },
    hardcore: { common: 30, uncommon: 35, rare: 25, legendary: 10 },
  }

  const weights = rarityWeights[difficulty as keyof typeof rarityWeights] || rarityWeights.survival

  const events: LifeEvent[] = []
  
  for (let i = 0; i < count && available.length > 0; i++) {
    // Weighted random selection
    const weighted = available.flatMap((e) => {
      const weight = weights[e.rarity]
      return Array(weight).fill(e)
    })
    
    if (weighted.length === 0) break
    
    const selected = weighted[Math.floor(Math.random() * weighted.length)]
    events.push(selected)
    available = available.filter((e) => e.id !== selected.id)
  }

  return events
}
