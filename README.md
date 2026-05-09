# 🏋️ FITillegence — AI-Powered Personal Fitness Companion

> A capstone project demonstrating Generative AI, prompt engineering, and full-stack development.
> Built by **Fortu Alexandra Andrea S.**

FITillegence is a localhost web application that delivers personalized workout plans, diet recommendations, and wellness advice using **Google Gemini AI**. Its standout feature is a **prompt-engineering comparison dashboard** that lets users see how four different prompting strategies (zero-shot, few-shot, chain-of-thought, role-based) change the AI's output in real time.

---

## ✨ Features

- 🎯 Personalized fitness plans based on user goal, body stats, and equipment
- 🧠 **4 prompt engineering strategies** built in
- 🔬 **Side-by-side strategy comparison** — see how prompting changes output
- 🎨 Bold gradient UI with smooth animations
- ⚡ No database required — runs entirely on localhost
- 🔌 Powered by Google Gemini (free tier)

---

## 🛠️ Tech Stack

| Layer    | Tech                         |
|----------|------------------------------|
| Frontend | HTML5, CSS3, vanilla JavaScript |
| Backend  | Python 3.10+, Flask, Flask-CORS |
| AI       | Google Gemini API (`google-generativeai`) |
| Tooling  | VS Code, Git, GitHub         |

---

## 📁 Project Structure

```
FITillegence/
├── backend/
│   ├── app.py              # Flask server, routes, Gemini integration
│   ├── prompts.py          # 4 prompt engineering strategies
│   ├── requirements.txt    # Python dependencies
│   └── .env.example        # Template for your API key
├── frontend/
│   ├── index.html          # Main page
│   ├── css/style.css       # Bold gradient styling + animations
│   └── js/app.js           # Form handling + API calls
├── docs/
│   ├── PROJECT_DESIGN.md            # Project Design Document deliverable
│   └── PROMPT_ENGINEERING.md        # Prompt strategies deliverable
├── .gitignore
└── README.md
```

---

## 🚀 Quick Start (Mac)

### 1. Clone the repository
```bash
git clone https://github.com/<your-username>/FITillegence.git
cd FITillegence
```

### 2. Get a free Gemini API key
Visit https://aistudio.google.com/app/apikey and create a key.

### 3. Set up the backend
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
# Open .env in any editor and paste your Gemini API key
```

### 4. Run the server
```bash
python app.py
```
Open your browser to **http://localhost:5001** and start building plans! 🎉

---

## 🧠 Prompt Engineering Strategies

| Strategy | Description |
|----------|-------------|
| **Zero-Shot** | Direct instruction, no examples. Tests baseline model knowledge. |
| **Few-Shot** | Provides one worked example to anchor format and depth. |
| **Chain-of-Thought** | Walks the model through BMR → TDEE → macros → split before answering. |
| **Role-Based** | Casts the model as "Coach Alex," a 15-year veteran trainer. |

See `docs/PROMPT_ENGINEERING.md` for full prompt text and analysis.

---

## 📡 API Endpoints

| Method | Path | Purpose |
|--------|------|---------|
| `GET`  | `/api/health` | Health check + lists available strategies |
| `GET`  | `/api/strategies` | Strategy metadata (id, name, description) |
| `POST` | `/api/generate-plan` | Generate a plan with one chosen strategy |
| `POST` | `/api/compare-prompts` | Generate plans with all strategies |

**Example request body:**
```json
{
  "goal": "muscle_gain",
  "age": 25,
  "gender": "male",
  "weight_kg": 70,
  "height_cm": 175,
  "activity_level": "moderate",
  "workout_days": 4,
  "equipment": "basic home gym",
  "dietary_preference": "no preference",
  "strategy": "role_based"
}
```

---

## 🎓 Capstone Deliverables Map

| Deliverable | File |
|-------------|------|
| Project Design Document | `docs/PROJECT_DESIGN.md` |
| Functional Localhost Application | The repo itself — runs on `localhost:5001` |
| Prompt Engineering Strategies Document | `docs/PROMPT_ENGINEERING.md` |
| Code Repository | This GitHub repo |
| Project Presentation/Demo | (separate slide deck) |

---

## ⚠️ Disclaimer

FITillegence is an educational project. AI-generated fitness and diet advice is **not a substitute for professional medical or nutritional consultation**. Always consult a qualified professional before starting any new fitness program.

---

## 📝 License

MIT — feel free to fork and adapt for your own learning.
