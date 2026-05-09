# Project Design Document — FITillegence

**Author:** Fortu Alexandra Andrea S.
**Project:** AI-Powered Personal Fitness Companion (Capstone)
**Domain:** Health & Fitness

---

## 1. Problem Statement

Many individuals struggle to start and maintain a fitness routine because:
- Generic fitness advice doesn't account for personal context (goals, body stats, equipment, dietary needs).
- Personal trainers and nutritionists are expensive and not universally accessible.
- Available apps either oversimplify recommendations or hide real flexibility behind paywalls.

**FITillegence** addresses this by providing dynamic, AI-generated fitness and nutrition plans tailored to each user — running locally, with no account required, and showcasing how prompt engineering improves AI output quality.

---

## 2. Objectives

1. Demonstrate practical use of Generative AI in the health & fitness domain.
2. Build a full-stack web application using only local development tools.
3. Integrate Google Gemini's API via Python.
4. Implement and evaluate **four prompt engineering strategies**.
5. Deliver a responsive, polished UI that displays AI output clearly.

---

## 3. System Architecture

```
┌──────────────────────┐         ┌─────────────────────┐         ┌──────────────────┐
│   Frontend (Browser) │ ──API─► │  Backend (Flask)    │ ──HTTPS►│  Gemini API      │
│  HTML / CSS / JS     │         │  Python 3.10+       │         │  (Google AI)     │
│  - Form              │ ◄───────│  - Routes           │ ◄───────│                  │
│  - Result renderer   │         │  - Prompt builder   │         │                  │
│  - Compare dashboard │         │  - Validation       │         │                  │
└──────────────────────┘         └─────────────────────┘         └──────────────────┘
```

### Why this architecture?

- **No database**: project requirements specify localhost-only with no DB. State is held in the request/response cycle.
- **Single Flask app serves both frontend and backend**: simplifies deployment and dev experience — one command starts everything.
- **Stateless API**: each call is independent, making it easy to test and reason about.

---

## 4. Tech Stack Justification

| Choice | Reason |
|--------|--------|
| **Flask** | Lightweight, minimal config, ideal for small-team capstone projects. Easier than FastAPI for first-time backend devs. |
| **Vanilla JS** | No build step. Removes Node/npm complexity from the demo. The app stays fast and the codebase stays small. |
| **Gemini (`gemini-1.5-flash`)** | Free tier is generous, response time is fast (3-8s), output quality is strong for this use case. Switching to `gemini-1.5-pro` is a one-line change. |
| **CSS variables + animations** | Maintainable theming + an attractive demo without needing a UI framework. |

---

## 5. User Flow

1. **Land on hero** → animated headline + CTA invites the user to build a plan.
2. **Fill the form** → goal, body stats, equipment, dietary preference.
3. **Choose strategy** OR **click Compare All**.
4. **Loading spinner** appears while the backend calls Gemini.
5. **Plan renders** in formatted cards (workout / diet / wellness sections).
6. **Compare mode** shows 4 plans side-by-side for evaluation.

---

## 6. Data Model (in-memory)

Since there's no database, the only "data" is the request payload:

```python
{
  "goal": "fat_loss" | "muscle_gain" | "maintenance" | "endurance" | "general_wellness",
  "age": int,           # 10-100
  "gender": "male" | "female" | "other",
  "weight_kg": float,   # 30-300
  "height_cm": float,   # 100-250
  "activity_level": "sedentary" | "light" | "moderate" | "active" | "very_active",
  "workout_days": int,  # 1-7
  "equipment": str,
  "dietary_preference": str,
  "strategy": str       # one of: zero_shot | few_shot | chain_of_thought | role_based
}
```

Validation happens server-side in `validate_user_input()` to catch missing fields, out-of-range values, and invalid enum choices.

---

## 7. API Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `GET`  | `/`                   | Serves the frontend (`index.html`) |
| `GET`  | `/api/health`         | Status, model name, key-loaded boolean |
| `GET`  | `/api/strategies`     | Returns metadata for all prompt strategies |
| `POST` | `/api/generate-plan`  | Returns a plan from one chosen strategy |
| `POST` | `/api/compare-prompts`| Returns plans from all 4 strategies |

---

## 8. Error Handling

- Missing or invalid input → `400 Bad Request` with a clear `error` message.
- Gemini API failure (rate limit, network, key invalid) → `500 Internal Server Error` with the underlying error.
- The frontend displays errors in a styled error card and prompts the user to check `.env`.

---

## 9. Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| Gemini rate limits during demo | Use `gemini-1.5-flash` (higher RPM than pro). Add light request throttling if needed. |
| AI hallucinating unsafe advice | Every plan ends with a disclaimer. App is explicitly non-medical. |
| API key leaking | Key is only stored in `.env`, which is `.gitignore`d. `.env.example` is committed instead. |
| Plan format inconsistency | Each prompt enforces a strict Markdown header structure. Frontend handles minor variations. |

---

## 10. Future Enhancements (Out of Scope for Capstone)

- User accounts + plan history (would require a database)
- Progress tracking & weekly check-ins
- Voice input via Web Speech API
- Streaming Gemini responses for instant feedback
- Multi-language support

---

## 11. Evaluation Criteria Mapping

| Criterion | Weight | How FITillegence Addresses It |
|-----------|--------|-------------------------------|
| Functional App & AI Integration | 30% | Working Flask + Gemini app with two distinct endpoints. |
| Prompt Engineering Effectiveness | 25% | Four documented strategies + side-by-side comparison UI. |
| Code Quality & Design | 20% | Modular code (`app.py` vs `prompts.py`), validation, error handling. |
| Technical Documentation | 15% | This file + `PROMPT_ENGINEERING.md` + extensive README. |
| Presentation & Demo | 10% | Animated UI with comparison dashboard makes for a compelling live demo. |
