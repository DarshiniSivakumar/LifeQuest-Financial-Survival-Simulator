# LifeQuest-Financial-Survival-Simulator

## Game Workflow

### 1. Start Screen (Character Setup)

- Player enters their **name** and **age**
- Chooses **difficulty mode**:

- **Peaceful**: 2 events/month (easier)
- **Survival**: 3 events/month (balanced)
- **Hardcore**: 4 events/month (challenging)

- Sets starting finances:

- **Monthly Income** (default ₹25,000)
- **Starting Balance** (default ₹15,000)
- **Emergency Savings** (default ₹10,000)
- Clicks "Create World" to begin


### 2. Main Gameplay Loop (12 Months)

**For each month:**

```plaintext
Month Start → Multiple Events → Monthly Summary → Next Month
```

#### A. Month Start Screen

- Shows current month (January-December)
- Displays how many events will occur
- Player clicks "Begin Month" to start


#### B. Life Events (2-4 per month based on difficulty)

Each event follows this flow:

```plaintext
Event Popup → Player Choice → Consequence Card → Next Event (or Summary)
```

**Event Types:**

- **Emergencies** (medical bills, vehicle breakdown, phone stolen)
- **Opportunities** (investments, freelance gigs, skill courses)
- **Scams** (fake bank calls, lottery scams, crypto schemes)
- **Regular** (bonuses, rent changes, friend requests)
- **Random** (unexpected good/bad luck)
- **Boss Events** (major life events like job loss - rare)


**Event Rarity:**

- Common (60% chance)
- Uncommon (25% chance)
- Rare (10% chance)
- Legendary (5% chance)


#### C. Making Decisions

- Each event shows 2-3 choices
- Choices have **risk indicators**: Safe / Moderate / Risky
- Player selects one option


#### D. Consequence Card

- Shows what happened based on the choice
- Displays stat changes (balance, savings, stress, future score)
- Animations show increases (green) or decreases (red)
- Player clicks continue to proceed


#### E. Progress Tracking

- Progress bar shows events completed this month
- Icons show which events are done vs pending


### 3. Monthly Summary

After all events in a month:

- Shows income vs expenses breakdown
- Lists all decisions made that month
- Displays current stats
- Calculates net change for the month
- Player clicks "Next Month" to continue


### 4. Stats That Matter

| Stat | Description
|-----|-----
| **Balance** | Spending money (used for expenses)
| **Savings** | Emergency fund (protected money)
| **Loans** | Debt amount (increases EMI)
| **EMI/Month** | Monthly loan payments
| **Stress** | Low → Medium → High → Critical
| **Future Score** | 0-100 (determines final grade)
| **Scams Avoided** | Counter for achievements


### 5. Achievement System

Unlocked during gameplay:

- **First Step**: Reach ₹20,000 savings
- **Scam Hunter**: Avoid 3 scams
- **Debt Free**: Clear all loans
- **Smart Investor**: Future score 80+
- **Survivor**: Complete 6 months
- **Zen Master**: Keep stress low for 3 events
- **Wealthy**: ₹100,000 total wealth


### 6. Game Over (After Month 12)

**Final Grade based on Future Score:**

- **S Rank** (90+): Financial Legend
- **A Rank** (75-89): Excellent
- **B Rank** (60-74): Good
- **C Rank** (40-59): Needs Improvement
- **D Rank** (0-39): Failed


**Shows:**

- Final grade with title
- All stats (net worth, savings, loans)
- Achievements earned
- Key financial learnings
- Option to play again
