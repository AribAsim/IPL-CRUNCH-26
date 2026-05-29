<div align="center">

# 🏏 The Anatomy of an IPL Win

### IPL Crunch '26 — Data Analytics Dashboard

*What separates champions from the rest?*
*An intelligence report decoding toss myths, middle-over chokeholds, and the ruthless math behind 1,200+ IPL matches.*

[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=white)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vite.dev/)
[![Python](https://img.shields.io/badge/Python-3.x-3776AB?style=flat-square&logo=python&logoColor=white)](https://python.org/)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

---

**[Live Demo →](https://ipl-crunch-26-beige.vercel.app/) · [Key Findings ↓](#-core-findings) · [Setup ↓](#-local-setup)**

</div>

<br>

## 📌 Project Overview

**IPL Crunch '26** is a cinematic, data-driven analytics dashboard that dissects **17 seasons of IPL cricket** to answer one question:

> *What actually wins in the IPL?*

Instead of raw tables and spreadsheets, this project transforms **500,000+ ball-by-ball deliveries** into a narrative experience — flowing from myth-busting (toss irrelevance) through phase-level domination patterns, into a striking "Wicket Trap" insight, and finally profiling the elite players who made it all happen.

Built as a single-page React application with a dark, premium aesthetic — glassmorphism cards, animated count-ups, Recharts visualizations, and Framer Motion transitions — it's designed to feel like a **Bloomberg Terminal for cricket strategy**.

<br>

---

## 🎯 Core Findings

The dashboard surfaces **four interconnected narratives**, each building on the last:

<table>
<tr>
<td width="50%">

### 🪙 The Toss Myth
Captains agonize over the coin toss — but it's statistically **meaningless**.

| Metric | Value |
|---|---|
| Toss winner wins | **50.49%** |
| Chasing team wins | **53.53%** |
| Captains choosing to field | **~80%** |

The coin doesn't matter. **Chasing does.** And teams have figured it out — field-first choices have risen from 35% (2009) to 81% (2026).

</td>
<td width="50%">

### ⚔️ The Middle-Over Chokehold
The most decisive phase isn't the Powerplay. It's **overs 6–14**.

| Metric | Winners | Losers | Gap |
|---|---|---|---|
| Avg Runs | 74.33 | 67.36 | **+6.97** |
| Avg Run Rate | 8.47 | 7.45 | **+1.02 RPO** |
| Wickets Lost | 1.87 | 2.77 | **−0.90** |

Winners outscore losers by ~7 runs in the middle overs. This is where control becomes domination.

</td>
</tr>
<tr>
<td width="50%">

### 🪤 The Powerplay Wicket Trap
The most surprising finding. Early wickets don't just hurt — they're **fatal**.

| PP Wickets Lost | Win Rate |
|---|---|
| 0 wickets | **67.6%** |
| 1 wicket | **56.7%** |
| 2 wickets | **40.7%** |
| **3 wickets** | **25.9%** ⚠️ |
| 4+ wickets | **<18%** |

Lose 3 wickets in the first 5 overs, and your win probability collapses to **1 in 4**. From 524 lossless Powerplay innings, teams won two-thirds.

</td>
<td width="50%">

### 👑 The Architects (2022–2026)
Behind every system, there are individuals who weaponize it.

**Top Run Scorers:**
| # | Player | Runs | SR | Avg |
|---|---|---|---|---|
| 1 | Shubman Gill | 2,827 | 150.4 | 46.3 |
| 2 | Virat Kohli | 2,757 | 144.1 | 48.4 |
| 3 | Jos Buttler | 2,487 | 149.4 | 44.4 |

**Top Wicket Takers:**
| # | Player | Wkts | Eco | Best |
|---|---|---|---|---|
| 1 | Yuzvendra Chahal | 90 | 8.75 | 5/40 |
| 2 | Arshdeep Singh | 78 | 9.28 | 4/29 |
| 3 | Rashid Khan | 76 | 8.11 | 4/24 |

</td>
</tr>
</table>

<br>

---

## 🖥️ Dashboard Features

| Feature | Description |
|---|---|
| **Cinematic Hero** | Animated title sequence with executive summary cards and live count-up stats |
| **Toss Influence Panel** | Interactive season-by-season trend chart + venue heatmap with 20 stadiums |
| **Phase Impact Analysis** | Side-by-side winner vs. loser metrics across Powerplay, Middle, and Death overs |
| **Wicket Trap Insight** | Step-function visualization of how early wickets crater win probability |
| **Player Leaderboards** | Top 10 batters and bowlers (2022–2026) with stat cards and rank badges |
| **Narrative Bridges** | Italic editorial connectors that guide the reader through a story, not just charts |
| **Glassmorphism UI** | Frosted-glass cards with blur effects, hover lifts, and glow accents |
| **Motion Design** | Scroll-triggered Framer Motion reveals with eased spring curves |
| **Responsive Layout** | Fully adaptive from mobile to ultrawide — nav collapses, grids reflow |

<br>

---

## 🏗️ Architecture & Tech Stack

```
┌─────────────────────────────────────────────────────────────────┐
│                        DATA PIPELINE                            │
│                                                                 │
│   Data.csv (73 MB)                                              │
│   500,000+ ball-by-ball deliveries · 17 seasons · 1,218 matches │
│          │                                                      │
│          ▼                                                      │
│   process_data.py                                               │
│   ├─ Clean & standardize team/venue names                       │
│   ├─ Compute toss influence stats + season/venue trends         │
│   ├─ Phase segmentation (PP / Middle / Death)                   │
│   ├─ Winner vs. Loser correlation analysis                      │
│   ├─ Top batter/bowler aggregation (last 5 seasons)             │
│   └─ Powerplay wicket-trap win probabilities                    │
│          │                                                      │
│          ▼                                                      │
│   processed.json (14 KB)                                        │
│   Optimized, frontend-ready analytics payload                   │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                       FRONTEND (React + Vite)                   │
│                                                                 │
│   src/                                                          │
│   ├─ App.jsx ─────────── Layout shell, nav, narrative bridges   │
│   ├─ components/                                                │
│   │   ├─ Hero.jsx ────── Count-up stats, executive summary      │
│   │   ├─ TossChart.jsx ─ Season trends, venue analysis          │
│   │   ├─ PhaseChart.jsx  Phase-level winner/loser comparison    │
│   │   ├─ InsightBanner ─ Powerplay wicket-trap deep dive        │
│   │   ├─ BatterCards ─── Top 10 batter stat cards               │
│   │   └─ BowlerCards ─── Top 10 bowler stat cards               │
│   ├─ data/                                                      │
│   │   └─ processed.json  Static import of pipeline output       │
│   └─ index.css ───────── Design system (tokens, glass cards)    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend** | React 19 + Vite 8 | Component architecture + fast HMR |
| **Charts** | Recharts 3.8 | Responsive, composable data visualizations |
| **Animation** | Framer Motion 12 | Scroll-triggered reveals + spring physics |
| **Icons** | Lucide React | Clean, consistent iconography |
| **Styling** | Vanilla CSS | Custom design system with CSS variables |
| **Data Pipeline** | Python (Pandas + NumPy) | ETL from raw CSV → optimized JSON |
| **Typography** | Outfit + Plus Jakarta Sans | Display + body font pairing via Google Fonts |

<br>

---

## 📊 Data Pipeline

The Python pipeline (`process_data.py`) transforms a **73 MB raw CSV** into a **14 KB optimized JSON** — a **5,000× compression** of the data into only what the dashboard needs.

### Pipeline Stages

```
Raw CSV (73 MB)
    │
    ├─ 1. CLEAN ──────── Normalize team names (e.g., "Delhi Daredevils" → "Delhi Capitals")
    │                     Standardize 40+ venue aliases into canonical names
    │                     Fix season edge cases (2007/08 → 2008)
    │
    ├─ 2. DERIVE ─────── Identify chasing team per match
    │                     Flag toss-winner-won-match outcomes
    │                     Classify overs into Powerplay / Middle / Death phases
    │
    ├─ 3. AGGREGATE ──── Toss stats: overall, by decision, by season, by venue
    │                     Phase stats: runs, wickets, run rate per phase (winner vs. loser)
    │                     Player stats: top batters + bowlers across last 5 seasons
    │
    ├─ 4. CORRELATE ──── Win probability by Powerplay wickets lost (0–7)
    │                     Phase-level run/wicket/RR correlations with match outcomes
    │
    └─ 5. EXPORT ─────── processed.json → imported directly by React components
```

<br>

---

## 📈 Key Statistical Findings

> These are the numbers that challenge conventional IPL wisdom.

### The Toss is Noise
- **50.49%** toss-win-match-win rate — statistically indistinguishable from a coin flip
- Yet **80%+ of captains** elect to field first, chasing a perceived advantage
- Chasing teams win **53.53%** — a real but modest edge

### The Middle Overs Are Everything
- **69.29%** of matches are won by the team with the higher middle-over run rate
- Winners average **8.47 RPO** in the middle; losers average **7.45 RPO**
- The middle-over wicket gap (**−0.90**) is the strongest separator between winning and losing sides

### Death Overs: Survive, Don't Score
- Death overs show the **smallest run gap** between winners and losers (+3.13 runs)
- But the **largest wicket gap** (−1.09 wickets) — teams that protect wickets in the death win more
- **64.12%** of matches are won by the team losing fewer death-over wickets

### The Powerplay Trap Is Real
- Losing **0 wickets** in the Powerplay → **67.6% win rate**
- Losing **3 wickets** → win rate collapses to **25.9%** (a 42-point drop)
- From 524 lossless Powerplay innings, teams won **354 times** (67.6%)

<br>

---

## 🚀 Local Setup

### Prerequisites
- **Node.js** 18+ and npm
- **Python** 3.8+ (only needed to re-run the data pipeline)

### Quick Start

```bash
# 1. Clone the repository
git clone https://github.com/AribAsim/IPL-CRUNCH-26.git
cd IPL-CRUNCH-26

# 2. Install frontend dependencies
npm install

# 3. Start the dev server
npm run dev
```

The dashboard will be live at **http://localhost:5173**

### Re-running the Data Pipeline (Optional)

If you want to regenerate `processed.json` from the raw data:

```bash
# Install Python dependencies
pip install pandas numpy

# Run the pipeline
python process_data.py
```

This reads `Data.csv` and outputs `processed.json` into the project root. The React app imports it directly.

### Production Build

```bash
npm run build
npm run preview
```

<br>

---

## 💡 Why This Project Matters

Most IPL analysis falls into one of two traps: either dry statistical tables that nobody reads, or vague punditry with no data backing.

**IPL Crunch '26** sits at the intersection — it treats cricket analytics as **data storytelling**. Every chart flows into the next. Every insight builds on the previous one. The result isn't a dashboard you glance at — it's a **narrative you read**.

The project demonstrates:
- **Data journalism thinking** — each section answers a specific question, not just "here's a chart"
- **Ruthless data compression** — 73 MB of raw data distilled into 14 KB of pure signal
- **Design-first engineering** — the glassmorphism UI, animated stat counters, and scroll-triggered reveals aren't decoration; they're pacing tools that control how fast the reader absorbs each insight
- **Narrative architecture** — italic editorial bridges between sections transform a collection of charts into a coherent story with a beginning, middle, and end

> *"17 seasons. 1,200+ matches. 500,000+ balls. One question: what actually wins in the IPL?"*

<br>

---

<div align="center">

**Built for IPL Crunch '26** · Crafted with data, designed with purpose.

</div>
