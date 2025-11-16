from flask import Flask, request, jsonify, render_template
from model.model import classify
app = Flask(__name__)


@app.route("/")
def home():
    return render_template("index.html")

@app.route("/classify", methods=["POST"])
def classify_text():
    data = request.get_json()

    text = data.get("text")
    labels = data.get("labels")

    if not text or not labels:
        return jsonify({"error": "Both 'text' and 'labels' are required"}), 400

    result = classify(text, labels)
    return jsonify(result)

if __name__ == "__main__":
    app.run(debug=True)
