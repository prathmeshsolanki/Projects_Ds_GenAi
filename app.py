from flask import Flask, render_template, request, jsonify
import random
from datetime import datetime
import os

app = Flask(__name__)

quotes = [
    "Push yourself, because no one else is going to do it for you.",
    "Every day is a chance to get better.",
    "You're capable of amazing things!",
    "Success is the sum of small efforts repeated daily.",
    "Stay positive, work hard, make it happen.",
    "Discipline is choosing between what you want now and what you want most."
]

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/log', methods=['POST'])
def save_log():
    data = request.json
    mood = data.get('mood')
    tasks = data.get('tasks', [])

    if not mood:
        return jsonify({"error": "Mood is required"}), 400

    # Productivity score
    score = len(tasks) * 5
    mood_boost = {
        "happy": 20,
        "motivated": 30,
        "stressed": 15,
        "lazy": 5,
        "sad": 10
    }
    score += mood_boost.get(mood.lower(), 0)
    score = max(0, min(score, 500))




    # Generate quote and date
    quote = random.choice(quotes)
    date = datetime.now().strftime("%Y-%m-%d")

    # Log to file
    with open("daily_logs.txt", "a") as file:
        file.write(f"{date} | Mood: {mood} | Tasks: {tasks} | Score: {score}\n")

    return jsonify({
        'date': date,
        'mood': mood.capitalize(),
        'tasks': tasks,
        'score': score,
        'quote': quote
    })

@app.route('/logs', methods=['GET'])
def get_logs():
    if not os.path.exists("daily_logs.txt"):
        return jsonify([])

    with open("daily_logs.txt", "r") as file:
        entries = file.readlines()

    logs = []
    for entry in entries:
        logs.append(entry.strip())

    return jsonify(logs)

if __name__ == '__main__':
    app.run(debug=True)
