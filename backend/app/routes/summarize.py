from openai import OpenAI
import os
from dotenv import load_dotenv
from flask import Blueprint, jsonify, request
from app.db import get_connection

load_dotenv()
client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))

summarize_post_bp = Blueprint("summarize_post", __name__)

def fetch_thread(post_id):
    conn = get_connection()
    if conn is None:
        return None, {"error": "Could not connect to the database"}, 500

    cursor = conn.cursor(dictionary=True)
    cursor.execute("""
        SELECT
        p.*, c.*, d.*
        FROM posts p
        LEFT JOIN comments c ON p.id = c.post_id
        LEFT JOIN drones d ON p.drone_id = d.id
        WHERE p.id = %s
    """, (post_id,))
    everything = cursor.fetchall()
    cursor.close()
    conn.close()
    return everything, None, None

@summarize_post_bp.route("/summarize_post", methods=["GET"])
def summarize_thread():
    post_id = request.args.get("post_id", default=1, type=int)
    rows, error, status = fetch_thread(post_id)
    if error:
        return jsonify(error), status

    prompt = "Summarize the following thread, including post, comments, and drone information:\n\n"
    for row in rows:
        prompt += (
            f"Post Title: {row.get('title', '')}\n"
            f"Post Content: {row.get('text', '')}\n"
            f"Drone Name: {row.get('name', '')}\n"
            f"Drone Features: {row.get('features', '')}\n"
            f"Comment: {row.get('comment_text', '')}\n\n"
        )

    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {"role": "system", "content": "Summarize the information"},
            {"role": "user", "content": prompt}
        ]
    )
    summary = response.choices[0].message.content
    return jsonify({"summary": summary})
