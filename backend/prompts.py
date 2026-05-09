"""
Prompt Engineering Strategies for FITillegence
-----------------------------------------------
Four distinct strategies are implemented to demonstrate how prompt design
affects the relevance and quality of AI-generated fitness plans.

1. ZERO-SHOT       - Direct instruction, no examples
2. FEW-SHOT        - Provides example outputs to guide format & quality
3. CHAIN-OF-THOUGHT- Asks the model to reason step-by-step before answering
4. ROLE-BASED      - Assigns the model an expert persona

Every strategy returns a Markdown-formatted plan covering:
  • Workout routine
  • Diet recommendations
  • Wellness / lifestyle tips
"""

# ---------------------------------------------------------------------------
# Common formatting instruction reused across strategies
# ---------------------------------------------------------------------------
FORMAT_INSTRUCTION = """
Format your response in clean Markdown with these sections (use these exact headers):

## 🏋️ Workout Plan
Provide a 7-day weekly schedule with exercises, sets, and reps.

## 🥗 Diet Recommendations
Provide a sample day of meals (breakfast, lunch, dinner, 2 snacks) with rough macros.

## 🧘 Wellness Tips
Provide 5 actionable lifestyle tips (sleep, hydration, recovery, mindset, habits).

## ⚠️ Disclaimer
A short non-medical disclaimer.
"""


def _user_summary(u: dict) -> str:
    """Build a clean user profile summary used in every strategy."""
    diet = u.get("dietary_preference", "no preference")
    equipment = u.get("equipment", "basic gym")
    days = u.get("workout_days", 4)
    return (
        f"- Goal: {u['goal'].replace('_', ' ')}\n"
        f"- Age: {u['age']}\n"
        f"- Gender: {u['gender']}\n"
        f"- Weight: {u['weight_kg']} kg\n"
        f"- Height: {u['height_cm']} cm\n"
        f"- Activity level: {u['activity_level']}\n"
        f"- Available equipment: {equipment}\n"
        f"- Preferred workout days/week: {days}\n"
        f"- Dietary preference: {diet}\n"
    )


# ---------------------------------------------------------------------------
# 1. ZERO-SHOT
# ---------------------------------------------------------------------------
def zero_shot_prompt(user: dict) -> str:
    return f"""Create a personalized fitness and nutrition plan for the following user:

{_user_summary(user)}
{FORMAT_INSTRUCTION}
"""


# ---------------------------------------------------------------------------
# 2. FEW-SHOT
# ---------------------------------------------------------------------------
def few_shot_prompt(user: dict) -> str:
    example = """
EXAMPLE INPUT:
- Goal: muscle gain
- Age: 25
- Gender: male
- Weight: 70 kg
- Height: 175 cm
- Activity level: moderate
- Equipment: full gym
- Preferred workout days/week: 5
- Dietary preference: no preference

EXAMPLE OUTPUT:
## 🏋️ Workout Plan
**Day 1 - Push:** Bench press 4x8, Overhead press 3x10, Tricep dips 3x12...
**Day 2 - Pull:** Deadlift 4x6, Pull-ups 3x8, Barbell rows 3x10...
*(rest of week follows push/pull/legs split)*

## 🥗 Diet Recommendations
**Target:** ~2,800 kcal | 180g protein | 350g carbs | 70g fat
- Breakfast: Oats + whey + banana (~600 kcal)
- Lunch: Chicken, rice, broccoli (~700 kcal)
- ...

## 🧘 Wellness Tips
1. Sleep 7-9 hours; muscle grows during recovery.
2. Drink 3L water daily.
3. ...

## ⚠️ Disclaimer
This plan is for educational purposes only and not medical advice.
"""

    return f"""You are generating fitness plans. Study the example below, then produce a plan with the SAME structure and depth for the new user.

{example}

NEW INPUT:
{_user_summary(user)}

NEW OUTPUT:
{FORMAT_INSTRUCTION}
"""


# ---------------------------------------------------------------------------
# 3. CHAIN-OF-THOUGHT
# ---------------------------------------------------------------------------
def chain_of_thought_prompt(user: dict) -> str:
    return f"""You will create a fitness plan, but FIRST reason step-by-step before producing the final answer.

USER PROFILE:
{_user_summary(user)}

STEP-BY-STEP REASONING (do this internally, then write the final plan):
1. Calculate the user's BMR using the Mifflin-St Jeor equation.
2. Adjust for their activity level to estimate TDEE (maintenance calories).
3. Based on their goal, decide if calories should be at a deficit (fat loss),
   surplus (muscle gain), or maintenance.
4. Determine optimal protein intake (1.6-2.2 g/kg for muscle/fat-loss goals).
5. Choose a training split that fits their available days and equipment.
6. Pick exercises appropriate for their experience level and equipment.
7. Build the meal plan to hit the calorie & macro targets.

After reasoning through these steps, output ONLY the final plan in this format:
{FORMAT_INSTRUCTION}

Begin the response with a brief 'Reasoning Summary' (3-4 sentences explaining your math
and key decisions), then output the formatted plan.
"""


# ---------------------------------------------------------------------------
# 4. ROLE-BASED (Expert Persona)
# ---------------------------------------------------------------------------
def role_based_prompt(user: dict) -> str:
    return f"""You are Coach Alex — a certified personal trainer (NASM-CPT) and registered
sports nutritionist with 15 years of experience coaching everyone from beginners to
competitive athletes. You're known for plans that are practical, motivating, and grounded
in evidence-based exercise science. You speak with warmth and confidence, and you always
explain the 'why' behind your recommendations.

A new client has just signed up. Here's their intake form:

{_user_summary(user)}

Write them a personalized plan as Coach Alex would. Be encouraging, specific, and
practical. Avoid generic advice — tailor every recommendation to this exact person.

{FORMAT_INSTRUCTION}

End the plan with a short, motivating note signed "— Coach Alex 💪".
"""


# ---------------------------------------------------------------------------
# Strategy Registry
# ---------------------------------------------------------------------------
STRATEGIES = {
    "zero_shot": {
        "name": "Zero-Shot",
        "description": "Direct instruction with no examples. Fast and lean — relies entirely on the model's pre-trained knowledge.",
        "builder": zero_shot_prompt,
    },
    "few_shot": {
        "name": "Few-Shot",
        "description": "Provides one fully-worked example so the model can mimic the desired structure, depth, and tone.",
        "builder": few_shot_prompt,
    },
    "chain_of_thought": {
        "name": "Chain-of-Thought",
        "description": "Asks the model to reason step-by-step (BMR → TDEE → macros → split) before producing the plan. Improves numerical accuracy.",
        "builder": chain_of_thought_prompt,
    },
    "role_based": {
        "name": "Role-Based (Coach Alex)",
        "description": "Assigns the model an expert persona — a certified trainer with 15 years of experience — for warmer, more practical advice.",
        "builder": role_based_prompt,
    },
}


def build_prompt(strategy_id: str, user: dict) -> str:
    """Public entry point — build a prompt for the given strategy."""
    if strategy_id not in STRATEGIES:
        raise ValueError(f"Unknown strategy: {strategy_id}")
    return STRATEGIES[strategy_id]["builder"](user)
