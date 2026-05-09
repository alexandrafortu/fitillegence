"""
FITillegence - AI-Powered Personal Fitness Companion
Backend: Flask + Groq API (Llama 3.3 70B)

Endpoints:
  GET  /                   -> serves the frontend
  POST /api/generate-plan  -> generates a fitness plan using a chosen prompt strategy
  POST /api/compare-prompts-> generates plans using ALL strategies for comparison
  GET  /api/health         -> health check
"""

import os
import logging
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from dotenv import load_dotenv
from groq import Groq

from prompts import build_prompt, STRATEGIES

# ---------------------------------------------------------------------------
# Setup
# ---------------------------------------------------------------------------
load_dotenv()

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
)
logger = logging.getLogger("FITillegence")

GROQ_API_KEY = os.getenv("GROQ_API_KEY")
if not GROQ_API_KEY:
    logger.warning("GROQ_API_KEY is not set! Add it to backend/.env")

# Llama 3.3 70B is Groq's flagship free model. Fast and high quality.
MODEL_NAME = os.getenv("GROQ_MODEL", "llama-3.3-70b-versatile")

# Initialize Groq client
client = Groq(api_key=GROQ_API_KEY) if GROQ_API_KEY else None

# Flask serves the frontend from ../frontend
FRONTEND_DIR = os.path.join(os.path.dirname(__file__), "..", "frontend")
app = Flask(__name__, static_folder=FRONTEND_DIR, static_url_path="")
CORS(app)


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------
def call_llm(prompt: str) -> str:
    """Send a prompt to Groq and return the text response."""
    if not client:
        raise RuntimeError("Groq client not initialized. Check GROQ_API_KEY in .env")
    try:
        completion = client.chat.completions.create(
            model=MODEL_NAME,
            messages=[{"role": "user", "content": prompt}],
            temperature=0.7,
            max_tokens=2048,
            top_p=0.9,
        )
        return completion.choices[0].message.content or "No content generated."
    except Exception as e:
        logger.exception("Groq API call failed")
        raise RuntimeError(f"Groq API error: {e}")


def validate_user_input(data: dict) -> tuple[bool, str]:
    """Light validation. Returns (ok, error_msg)."""
    required = ["goal", "age", "gender", "weight_kg", "height_cm", "activity_level"]
    for field in required:
        if field not in data or data[field] in (None, ""):
            return False, f"Missing field: {field}"

    valid_goals = {"fat_loss", "muscle_gain", "maintenance", "endurance", "general_wellness"}
    if data["goal"] not in valid_goals:
        return False, f"Invalid goal. Choose from: {', '.join(valid_goals)}"

    try:
        age = int(data["age"])
        weight = float(data["weight_kg"])
        height = float(data["height_cm"])
        if not (10 <= age <= 100):
            return False, "Age must be between 10 and 100."
        if not (30 <= weight <= 300):
            return False, "Weight must be between 30 and 300 kg."
        if not (100 <= height <= 250):
            return False, "Height must be between 100 and 250 cm."
    except (ValueError, TypeError):
        return False, "Age, weight, and height must be numeric."

    return True, ""


# ---------------------------------------------------------------------------
# Routes
# ---------------------------------------------------------------------------
@app.route("/")
def index():
    return send_from_directory(FRONTEND_DIR, "index.html")


@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({
        "status": "ok",
        "provider": "Groq",
        "model": MODEL_NAME,
        "api_key_loaded": bool(GROQ_API_KEY),
        "strategies_available": list(STRATEGIES.keys()),
    })


@app.route("/api/strategies", methods=["GET"])
def list_strategies():
    """Return metadata for each prompt engineering strategy."""
    return jsonify([
        {"id": key, "name": meta["name"], "description": meta["description"]}
        for key, meta in STRATEGIES.items()
    ])


@app.route("/api/generate-plan", methods=["POST"])
def generate_plan():
    """Generate a fitness plan with a chosen strategy."""
    data = request.get_json(silent=True) or {}
    strategy = data.get("strategy", "role_based")

    if strategy not in STRATEGIES:
        return jsonify({"error": f"Unknown strategy '{strategy}'"}), 400

    ok, err = validate_user_input(data)
    if not ok:
        return jsonify({"error": err}), 400

    prompt = build_prompt(strategy, data)
    logger.info(f"Generating plan | strategy={strategy} | goal={data['goal']}")

    try:
        result = call_llm(prompt)
    except RuntimeError as e:
        return jsonify({"error": str(e)}), 500

    return jsonify({
        "strategy": strategy,
        "strategy_name": STRATEGIES[strategy]["name"],
        "user_input": data,
        "plan": result,
    })


@app.route("/api/compare-prompts", methods=["POST"])
def compare_prompts():
    """Generate plans with all strategies side-by-side for comparison."""
    data = request.get_json(silent=True) or {}

    ok, err = validate_user_input(data)
    if not ok:
        return jsonify({"error": err}), 400

    results = []
    for strategy_id, meta in STRATEGIES.items():
        prompt = build_prompt(strategy_id, data)
        try:
            plan = call_llm(prompt)
        except RuntimeError as e:
            plan = f"⚠️ Error: {e}"
        results.append({
            "strategy": strategy_id,
            "strategy_name": meta["name"],
            "description": meta["description"],
            "plan": plan,
        })
        logger.info(f"Compared strategy: {strategy_id}")

    return jsonify({"user_input": data, "results": results})


# ---------------------------------------------------------------------------
# Run
# ---------------------------------------------------------------------------
if __name__ == "__main__":
    port = int(os.getenv("PORT", 5001))
    print("\n" + "=" * 60)
    print(f"  🏋️  FITillegence is running at http://localhost:{port}")
    print(f"  Provider: Groq")
    print(f"  Model: {MODEL_NAME}")
    print(f"  API key loaded: {bool(GROQ_API_KEY)}")
    print("=" * 60 + "\n")
    app.run(host="0.0.0.0", port=port, debug=True)