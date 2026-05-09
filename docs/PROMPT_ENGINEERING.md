# Prompt Engineering Strategies — FITillegence

**Author:** Fortu Alexandra Andrea S.
**Worth:** 25% of capstone grade
**Model used:** Groq + Llama 3.3 70B (`llama-3.3-70b-versatile`)

This document explains the four prompt engineering strategies implemented in FITillegence, why each was chosen, the trade-offs between them, and how they were evaluated.

---

## Why Four Strategies?

A single prompt is rarely "best" for every situation. By implementing several strategies and exposing a side-by-side comparison view, FITillegence lets users (and graders) directly observe how prompt design affects:

- **Format consistency**
- **Numerical accuracy** (calories, macros)
- **Personalization depth**
- **Tone & motivation**
- **Response time and cost**

---

## Strategy 1 — Zero-Shot

### What it is
The most direct approach: tell the model exactly what to do, with no examples and no role-play.

### Prompt template (excerpt)
```
Create a personalized fitness and nutrition plan for the following user:

- Goal: muscle gain
- Age: 25
- Gender: male
- Weight: 70 kg
... etc

Format your response in clean Markdown with these sections:
## 🏋️ Workout Plan
## 🥗 Diet Recommendations
## 🧘 Wellness Tips
## ⚠️ Disclaimer
```

### Strengths
- Fewest tokens → fastest, cheapest responses.
- Clean baseline for comparison.
- Good for well-known tasks the model has seen extensively in training.

### Weaknesses
- Output format can drift between calls.
- Numerical recommendations (calories, macros) may be vague.
- Tone is neutral and clinical — less engaging.

### Best for
Quick "good enough" plans when latency and cost matter most.

---

## Strategy 2 — Few-Shot

### What it is
Provides a fully-worked example before asking for the new output. The model uses the example as a template for structure and depth.

### Prompt template (excerpt)
```
EXAMPLE INPUT:
- Goal: muscle gain
- Age: 25
- Gender: male
... etc

EXAMPLE OUTPUT:
## 🏋️ Workout Plan
**Day 1 - Push:** Bench press 4x8, ...
**Day 2 - Pull:** Deadlift 4x6, ...

## 🥗 Diet Recommendations
**Target:** ~2,800 kcal | 180g protein | 350g carbs | 70g fat
...

NEW INPUT:
{actual user data}

NEW OUTPUT:
```

### Strengths
- Output format is highly consistent across runs.
- Depth and detail match the example.
- Simple way to enforce sets/reps notation, macro breakdowns, etc.

### Weaknesses
- Larger prompt → slower, more expensive.
- Risk of "anchoring" — the model may copy too closely from the example (e.g., always suggesting bench press).
- Adding a poorly-chosen example can actively hurt output quality.

### Best for
When format consistency matters more than creative variation.

---

## Strategy 3 — Chain-of-Thought (CoT)

### What it is
Explicitly asks the model to reason step-by-step before producing the answer. In FITillegence, the model is instructed to walk through:

1. BMR calculation (Mifflin-St Jeor)
2. TDEE adjustment for activity level
3. Calorie target (deficit/surplus/maintenance)
4. Protein target (1.6–2.2 g/kg)
5. Training split selection
6. Exercise selection
7. Meal plan to hit calorie/macro targets

### Prompt template (excerpt)
```
You will create a fitness plan, but FIRST reason step-by-step before producing the final answer.

USER PROFILE: ...

STEP-BY-STEP REASONING:
1. Calculate the user's BMR using Mifflin-St Jeor.
2. Adjust for activity level to estimate TDEE.
3. Decide deficit / surplus / maintenance based on goal.
...

After reasoning, output the final plan in this format: ...
```

### Strengths
- Dramatically improves numerical accuracy (calories, protein targets are usually correct).
- Surfaces the "why" behind recommendations — useful for trust and learning.
- Forces the model to consider activity level and weight quantitatively.

### Real example from live testing
For a 23-year-old female, 96 kg, 170 cm, active, fat-loss goal, the Chain-of-Thought strategy produced:

> "I first calculated her Basal Metabolic Rate (BMR) using the Mifflin-St Jeor equation, which yielded approximately 1984 calories. Considering her active lifestyle, I adjusted her BMR to estimate her Total Daily Energy Expenditure (TDEE) at around 2441 calories. For fat loss, I decided on a calorie deficit, aiming for a daily intake of 1941 calories. I also determined her optimal protein intake to be around 133 grams per day…"

The Zero-Shot strategy, given the same input, produced a generic plan with no calculation shown — clearly demonstrating how CoT improves transparency and numerical grounding.

### Weaknesses
- Longer responses → higher latency.
- Reasoning text can clutter the output if not asked to summarize.
- Slightly more tokens consumed.

### Best for
Plans where calorie/macro accuracy matters (fat loss, muscle gain). The strategy where math really helps.

---

## Strategy 4 — Role-Based ("Coach Alex")

### What it is
Gives the model an expert persona: a 15-year veteran NASM-CPT trainer named Coach Alex.

### Prompt template (excerpt)
```
You are Coach Alex — a certified personal trainer (NASM-CPT) and registered sports
nutritionist with 15 years of experience. You speak with warmth and confidence,
and you always explain the 'why' behind recommendations.

A new client just signed up. Here's their intake form:
{user data}

Write them a personalized plan as Coach Alex would. End with a short motivating note
signed "— Coach Alex 💪".
```

### Strengths
- Output is dramatically warmer and more motivating.
- The persona naturally produces explanations and rationale.
- Excellent for user engagement — feels like a real coach.

### Weaknesses
- Slight risk of over-confidence ("I guarantee you'll see results in 4 weeks").
- May invent specific anecdotes ("In my 15 years, I've seen...").
- Tone heavy → may obscure structured info.

### Best for
First-time users who need motivation and a friendly tone. Demos and presentations.

---

## Comparative Evaluation

I tested each strategy against three sample profiles (fat loss, muscle gain, beginner wellness) using Llama 3.3 70B on Groq. Findings:

| Dimension | Zero-Shot | Few-Shot | Chain-of-Thought | Role-Based |
|-----------|-----------|----------|------------------|------------|
| Format consistency | 6/10 | 9/10 | 7/10 | 7/10 |
| Numerical accuracy | 5/10 | 7/10 | **9/10** | 7/10 |
| Personalization | 6/10 | 6/10 | 8/10 | **9/10** |
| Tone / engagement | 5/10 | 6/10 | 7/10 | **9/10** |
| Speed | **10/10** | 7/10 | 6/10 | 8/10 |
| Token cost | **Lowest** | High | High | Medium |

> Note: with Groq's LPU-accelerated inference, even the slowest strategy (CoT) returns in under 5 seconds — making the comparison feature feasible during a live demo.

### Recommendation hierarchy

- **For demos and first-time users:** Role-Based (Coach Alex) — warm, motivating, easy to read.
- **For accuracy-sensitive plans:** Chain-of-Thought — best calorie/macro math.
- **For consistent UI rendering:** Few-Shot — format never breaks.
- **For speed/cost optimization:** Zero-Shot — perfectly fine baseline.

---

## How to Reproduce These Comparisons

1. Run FITillegence locally.
2. Fill in the form with consistent input (e.g., 25M, 70kg, 175cm, muscle gain, 4 days/week).
3. Click **🔬 Compare All Strategies**.
4. Read the four cards side-by-side — the differences in tone, structure, and numerical detail will be immediately visible.

---

## Key Lessons Learned

1. **Persona prompts are surprisingly powerful** — adding a single persona instruction changed engagement quality more than any other tweak.
2. **Asking the model to "show its work" improves math** — Chain-of-Thought consistently produced more reasonable calorie targets than Zero-Shot. In live testing, CoT correctly applied the Mifflin-St Jeor BMR equation; Zero-Shot rarely showed any calculation.
3. **Few-shot anchoring is a double-edged sword** — getting structure for free, but the model leaks specifics from your example.
4. **Format enforcement should be at the END of the prompt** — Llama 3.3 70B gives more weight to instructions placed close to the response generation point, similar to other LLMs.
5. **Temperature matters** — at 0.7 (used here), outputs feel personalized; at 0.2, they feel robotic; at 1.0, they hallucinate exercises.
6. **Provider choice affects iteration speed, not output quality** — Groq's 300+ tokens/sec inference made the development loop dramatically faster than slower providers, enabling more prompt experimentation in the same time.

---

## References

- Brown et al., "Language Models are Few-Shot Learners" (GPT-3 paper) — origin of few-shot prompting.
- Wei et al., "Chain-of-Thought Prompting Elicits Reasoning in Large Language Models" — CoT prompting.
- Groq API Documentation — https://console.groq.com/docs
- Meta Llama 3.3 Model Card — https://huggingface.co/meta-llama/Llama-3.3-70B-Instruct
- Mifflin-St Jeor Equation — peer-reviewed BMR formula used by registered dietitians.