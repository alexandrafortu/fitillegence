# FITillegence — Demo Script (5–7 min)

A guided walkthrough you can use during your capstone presentation.

---

## Before the demo
- [ ] Run `python app.py` in `backend/` so the server is already running.
- [ ] Browser open to `http://localhost:5001`.
- [ ] Have `docs/PROMPT_ENGINEERING.md` open in a second tab as backup.
- [ ] Phone on do-not-disturb. WiFi confirmed working.

---

## 1. The Hook (30s)

> "Most fitness apps either give you generic advice or hide flexibility behind paywalls. I built FITillegence to show that with a small amount of code and the right prompts, AI can deliver coaching that's actually personalized — and to demonstrate exactly *how* prompt engineering changes that output."

*(Scroll the hero section so the animated orb and floating cards play.)*

---

## 2. Problem & Solution (45s)

- Click "Learn More" → scroll to the 4 feature cards.
- Briefly explain: tell us your goal → pick a strategy → get a plan → compare strategies.

---

## 3. Architecture (45s)

> "It's a Flask app serving both the backend and frontend. The backend talks to Google's Gemini API. There's no database — by design — because the project requirement was localhost-only and stateless. The interesting part lives in `prompts.py`, which holds four different ways of asking the AI for the same thing."

*(Optional: split-screen with VS Code showing the file tree.)*

---

## 4. Single Plan Demo (60s)

- Scroll to the form.
- Fill in: muscle gain, age 22, male, 70kg, 175cm, moderate activity, 5 days/week, full gym, no preference.
- Strategy: **Role-Based (Coach Alex)**.
- Click **Generate My Plan**.
- While it loads (~5s), say:

> "I'm using Gemini 1.5 Flash because the free tier is generous and response time is great for live demos. The strategy I picked here — Role-Based — casts the model as a 15-year veteran trainer named Coach Alex."

- When the plan renders, scroll through the workout, diet, and wellness sections. Read one or two highlights.

---

## 5. Strategy Comparison Demo (90s) ⭐ The 25% moment

- Scroll back up, click **Compare All Strategies**.
- While 4 plans generate (~30s), explain:

> "This is the part I'm most proud of. The same user input is being sent to four different prompts: zero-shot, few-shot, chain-of-thought, and role-based. Watch how the same user gets four meaningfully different plans."

- When all four cards render, walk through the differences:
  - **Zero-shot:** clinical, brief.
  - **Few-shot:** very structured, mirrors the example.
  - **Chain-of-thought:** opens with reasoning summary — calculates BMR/TDEE/macros explicitly.
  - **Role-based:** warm, motivating, signed by Coach Alex.

> "The big lesson: a single line of prompt change — like adding 'You are an experienced coach' — changes the entire feel and usefulness of the output."

---

## 6. Code Tour (45s)

- Show `backend/prompts.py` — point at the four functions.
- Show how each one uses the same `_user_summary()` helper but wraps it differently.
- Point out the strategy registry at the bottom.

---

## 7. Wrap-Up (30s)

> "Three takeaways: First, prompt engineering is real engineering — the four strategies behave noticeably differently. Second, full-stack AI apps don't need to be complicated; a single Flask file plus a vanilla JS frontend is enough for something polished. Third, tools like this are non-medical, but they're a strong proof of concept for accessible, personalized guidance."

---

## Q&A backup answers

- **"Why Gemini and not OpenAI?"** Gemini's free tier was generous enough to make the side-by-side comparison feature feasible without billing concerns. The architecture would change by ~5 lines if I switched to OpenAI.
- **"Why no database?"** Project requirement, but also: stateless makes the app trivial to demo and reason about. State could be added with SQLite in under an hour.
- **"How would you scale this?"** Add a queue (Redis) for the comparison endpoint, since each comparison is 4 sequential Gemini calls. Cache identical requests.
- **"Is the medical advice safe?"** Every plan has a disclaimer, and the prompts explicitly position the app as educational. Real production would require professional review.
