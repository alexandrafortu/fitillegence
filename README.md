# 🏋️ FITillegence

> **Your AI Fitness Companion** — Personalized workouts, custom diet plans, and wellness coaching, crafted in seconds by advanced AI.

<p align="center">
  <strong>Powered by Groq + Llama 3.3 70B · Built with Flask · Vanilla HTML/CSS/JS</strong>
</p>

---

## 📖 Table of Contents

- [About](#about)
- [Features](#features)
- [Screenshots](#screenshots)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the App](#running-the-app)
- [How to Use](#how-to-use)
- [Project Structure](#project-structure)
- [Documentation](#documentation)
- [Troubleshooting](#troubleshooting)
- [Tech Stack](#tech-stack)
- [Credits](#credits)

---

## 🎯 About

**FITillegence** is an AI-powered personal fitness companion that generates personalized workout plans, diet recommendations, and wellness tips based on your unique profile. The app's standout feature is its **4 prompt engineering strategies** (Zero-Shot, Few-Shot, Chain-of-Thought, and Role-Based) that you can compare side-by-side to see how different prompting techniques affect AI output quality.

This project was built as a capstone for an AI-powered application course, demonstrating practical applications of:
- 🧠 Advanced prompt engineering
- ⚡ Fast LLM inference via Groq
- 🎨 Modern responsive web design
- 🛡️ Server-side input validation
- 🔬 Side-by-side AI output comparison

---

## ✨ Features

### Core functionality
- 🎯 **5 fitness goals** — Fat Loss, Muscle Gain, Maintenance, Endurance, General Wellness
- 🧠 **4 AI strategies** — Zero-Shot, Few-Shot, Chain-of-Thought, Role-Based (Coach Alex)
- 🔬 **Compare All 4** — Run every strategy on the same input and see them side-by-side
- 📊 **Live BMI calculator** — Updates as you adjust weight/height sliders
- 🥗 **6 dietary preferences** — Vegetarian, Vegan, Pescatarian, Halal, Keto, No preference
- 🏋️ **3 equipment levels** — Bodyweight only, Basic home gym, Full gym access

### User experience
- 📱 **Fully responsive** — Works on desktop, tablet, and phone
- ✨ **Multi-step form** — 4 quick steps, no overwhelming forms
- 🎨 **Premium Energy theme** — Black + electric orange aesthetic
- 🌀 **Orbital hero animation** — 8 fitness icons orbiting around a central figure
- 🎉 **Celebration on success** — Confetti when your plan is ready
- ♻️ **Reset & retry** — Build multiple plans in one session
- 🔒 **Privacy-first** — No data stored, no accounts, no tracking

---

## 📸 Screenshots

> Add your screenshots to `docs/screenshots/` and they'll display here:
>
> - `docs/screenshots/01-hero.png` — Home page with orbital animation
> - `docs/screenshots/02-compare-dashboard.png` — Side-by-side strategy comparison
> - `docs/screenshots/03-bmi-calculator.png` — Live BMI in the form
> - `docs/screenshots/04-mobile-view.png` — Mobile responsive layout

---

## 🔧 Prerequisites

Before you begin, make sure you have:

| Tool | Version | Check command |
|---|---|---|
| **Python** | 3.10 or higher | `python3 --version` |
| **pip** | Latest | `pip3 --version` |
| **Git** | Any recent | `git --version` |
| **Groq API key** | Free tier works | [Get one here](https://console.groq.com/keys) |

> 💡 **Tip:** If you're on macOS and `python3 --version` returns something below 3.10, install Python 3.12 via Homebrew: `brew install python@3.12`

---

## 📥 Installation

### Step 1 — Clone the repository

```bash
git clone https://github.com/alexandrafortu/FITillegence.git
cd FITillegence
```

### Step 2 — Set up the Python virtual environment

```bash
cd backend
python3 -m venv venv
```

### Step 3 — Activate the virtual environment

**On macOS / Linux:**
```bash
source venv/bin/activate
```

**On Windows (PowerShell):**
```bash
venv\Scripts\Activate.ps1
```

> ✅ You'll know it worked when you see `(venv)` at the start of your terminal prompt.

### Step 4 — Install Python dependencies

```bash
pip install -r requirements.txt
```

This installs:
- `flask==3.0.3` — Web framework
- `flask-cors==4.0.1` — Cross-origin handling
- `python-dotenv==1.0.1` — Environment variable loader
- `groq==0.11.0` — Official Groq Python SDK

---

## ⚙️ Configuration

### Step 1 — Get your Groq API key

1. Visit [https://console.groq.com/keys](https://console.groq.com/keys)
2. Sign up (free) and create a new API key
3. Copy the key — it starts with `gsk_...`

### Step 2 — Create your `.env` file

In the `backend/` folder, copy the example file:

```bash
cp .env.example .env
```

### Step 3 — Add your API key to `.env`

Open `backend/.env` in any text editor and replace the placeholder:

```
GROQ_API_KEY=gsk_your_actual_key_here
GROQ_MODEL=llama-3.3-70b-versatile
```

> ⚠️ **Important:** The `.env` file is in `.gitignore` — your key will **never** be pushed to GitHub. Keep it secret!

---

## 🚀 Running the App

### Step 1 — Make sure your virtual environment is activated

```bash
cd backend
source venv/bin/activate   # macOS/Linux
# OR
venv\Scripts\Activate.ps1  # Windows
```

### Step 2 — Start the Flask server

```bash
python app.py
```

You should see output like:
```
 * Running on http://127.0.0.1:5001
 * Press CTRL+C to quit
```

### Step 3 — Open the app in your browser

Visit: **[http://localhost:5001](http://localhost:5001)**

🎉 You should see FITillegence with the orbital hero animation!

### Step 4 — When you're done

Press `Ctrl + C` in your terminal to stop the server, then:
```bash
deactivate
```
to exit the virtual environment.

---

## 🎮 How to Use

### Generate your first plan

1. **Land on the home page** — See the orbital animation and intro
2. **Click "Build My Plan"** — Scrolls down to the form
3. **Step 1 — Goal:** Choose one of 5 fitness goals (Fat Loss, Muscle Gain, etc.)
4. **Step 2 — You:** Set gender, age, weight, and height (sliders update live + BMI shown)
5. **Step 3 — Setup:** Select activity level, workout days/week, equipment, and diet
6. **Step 4 — Strategy:** Pick one of 4 AI strategies:
   - 🎭 **Role-Based** — Friendly coach persona (great for first-timers)
   - 🧮 **Chain-of-Thought** — Step-by-step BMR/TDEE calculation (most accurate)
   - 📋 **Few-Shot** — Follows a worked example (most consistent formatting)
   - ⚡ **Zero-Shot** — Direct instruction, no examples (fastest baseline)
7. **Click "Generate My Plan"** — AI generates your plan in 2-5 seconds
8. **Read your plan** — 4 sections: Workout, Diet, Wellness Tips, Disclaimer
9. **Click "Build Another"** to start over with new inputs

### Compare all 4 strategies (the cool part! 🔬)

Instead of picking one strategy in Step 4, click **🔬 Compare All 4** at the bottom. The AI will generate plans using all 4 strategies side-by-side so you can see how prompting affects output quality. Takes about 8-15 seconds.

---

## 📂 Project Structure

```
FITillegence/
├── backend/
│   ├── app.py              # Flask routes & LLM client
│   ├── prompts.py          # 4 prompt strategies
│   ├── requirements.txt    # Python dependencies
│   ├── .env.example        # Template (no real key)
│   └── .env                # Your real key (gitignored)
│
├── frontend/
│   ├── index.html          # Single-page app
│   ├── css/style.css       # All styling
│   └── js/app.js           # Form logic + API calls
│
├── docs/
│   ├── PROJECT_DESIGN.md           # Architecture decisions
│   ├── PROMPT_ENGINEERING.md       # Deep dive on 4 strategies
│   ├── DEMO_SCRIPT.md              # Presentation walkthrough
│   ├── MILESTONE_MAPPING.md        # Capstone milestone tracker
│   ├── TESTING_LOG.md              # QA test results
│   ├── TECHNICAL_DOCS.md           # Full technical docs (Markdown)
│   └── FITillegence_Technical_Documentation.docx  # Same as Word file
│
├── .gitignore              # Excludes .env, venv/, etc.
└── README.md               # This file
```

---

## 📚 Documentation

This project includes comprehensive documentation:

| File | What it covers |
|---|---|
| 📖 **README.md** (this file) | Setup, install, and usage |
| 🏗️ **docs/PROJECT_DESIGN.md** | Architecture and design decisions |
| 🧠 **docs/PROMPT_ENGINEERING.md** | Deep dive on the 4 prompt strategies (25% of grade!) |
| 🎤 **docs/DEMO_SCRIPT.md** | 5-7 minute presentation walkthrough |
| 🗺️ **docs/MILESTONE_MAPPING.md** | Each milestone mapped to specific code lines |
| 🧪 **docs/TESTING_LOG.md** | 15+ test scenarios validated |
| 📐 **docs/TECHNICAL_DOCS.md** | Complete technical reference |

---

## 🐛 Troubleshooting

### "ModuleNotFoundError: No module named 'flask'"
You forgot to activate the virtual environment, or you didn't install dependencies.
```bash
cd backend
source venv/bin/activate
pip install -r requirements.txt
```

### "GROQ_API_KEY not found" or "401 Unauthorized"
Your `.env` file is missing or the key is wrong.
1. Check that `backend/.env` exists (it's gitignored, so it won't appear after cloning)
2. Open it and confirm your key is on the line `GROQ_API_KEY=gsk_...`
3. Make sure there are no quotes around the key
4. Restart the Flask server

### "Port 5001 is already in use"
Another process is using port 5001. Either:
- Stop the other process: find it with `lsof -i :5001` and kill it
- Or change the port in `app.py` (last line: `app.run(port=5001)` → `port=5002`)

### Blank page or "Failed to fetch"
The Flask server isn't running, or it crashed. Check your terminal where you ran `python app.py` — it should show `Running on http://127.0.0.1:5001`. If it crashed, scroll up to see the error.

### macOS: "Symbol not found: _XML_SetAllocTrackerActivationThreshold"
This is the macOS Tahoe libexpat bug. Fix:
```bash
brew install expat
install_name_tool -change /usr/lib/libexpat.1.dylib "$(brew --prefix expat)/lib/libexpat.1.dylib" $(python3 -c "import pyexpat; print(pyexpat.__file__)")
codesign --force --sign - $(python3 -c "import pyexpat; print(pyexpat.__file__)")
```

### Plans look weird or repetitive
The LLM occasionally produces lower-quality output. Try:
1. Clicking "Build Another" and regenerating
2. Trying a different strategy (Chain-of-Thought tends to be more reliable)
3. Adjusting your inputs slightly (e.g., age 25 → 26)

### Animations are choppy
Your machine may be struggling with the particle background. Either:
- Close other browser tabs
- Open `frontend/js/app.js` and reduce particle count (`const COUNT = ...`)

---

## 🛠️ Tech Stack

### Backend
- **Python 3.12** — Runtime
- **Flask 3.0.3** — Web framework
- **Groq SDK 0.11.0** — Official client for Groq API
- **Llama 3.3 70B** — The LLM doing the heavy lifting
- **python-dotenv** — Secret management

### Frontend
- **HTML5** — Semantic structure
- **CSS3** — Custom properties, animations, glassmorphism
- **Vanilla JavaScript** — No frameworks, no build step
- **Canvas API** — Particle background
- **Intersection Observer** — Scroll-reveal animations
- **Fetch API** — Backend communication

### External Services
- **Groq Cloud** — Ultra-fast LLM inference (~500+ tokens/sec)

### Why Groq instead of OpenAI/Gemini?
- ⚡ **Speed** — 10× faster than typical GPT-4 responses
- 💸 **Cost** — Free tier is generous, perfect for capstone
- 🔓 **Open model** — Llama 3.3 is open-weight, aligning with academic transparency
- 🛡️ **Reliable** — No deprecation surprises (the original Gemini build had to be migrated)

---

## ⚠️ Disclaimer

FITillegence generates AI-powered fitness suggestions for **educational and informational purposes only**. The plans produced by this app are **not medical advice** and should not replace consultation with qualified health professionals (physicians, registered dietitians, certified personal trainers).

**Before starting any new fitness or diet program:**
- Consult your doctor, especially if you have pre-existing medical conditions
- Listen to your body — stop any exercise that causes pain
- Pregnancy, chronic conditions, or eating disorders require specialized professional guidance
- The AI does not know your full medical history

This project was built as an academic exercise. **Use at your own discretion.**

---

## 👤 Credits

**Built with 💪 by Fortu Alexandra Andrea S.**

- **Project:** Capstone — AI-Powered Personal Fitness Companion
- **Year:** 2026
- **License:** Academic project — not licensed for commercial use
- **GitHub:** [github.com/alexandrafortu/FITillegence](https://github.com/alexandrafortu/FITillegence)

### Special thanks
- **Groq** for fast, free LLM inference
- **Meta** for open-sourcing Llama 3.3 70B
- **Anthropic's Claude** for development assistance during the build process

---

<p align="center">
  <strong>Ready to crush your fitness goals? 💪 Run <code>python app.py</code> and let's go!</strong>
</p>