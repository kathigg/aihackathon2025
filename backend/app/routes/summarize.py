from openai import OpenAI
import os
from flask import Blueprint, jsonify, request
from app.db import get_connection

summarize_post_bp = Blueprint("summarize_post", __name__)

client = OpenAI(
    api_key=os.environ.get("OPENAI_API_KEY"),
)

def fetch_thread(post_id):
    conn = db.get_connection()
    if conn is None:
        return jsonify({"error": "Could not connect to the database"}), 500

    cursor = conn.cursor(dictionary=True)
    cursor.execute("""
        SELECT
        p.*,
        c.*,
        d.*
        FROM posts p
        LEFT JOIN comments c ON p.id = c.post_id
        LEFT JOIN drones d ON p.drone_id = d.id
        WHERE p.id = :post_id
    """)
    everything = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(everything)

@summarize_post_bp.route("/summarize_post", methods=["GET"])
def summarize_thread(post_id = 1):
    result = fetch_thread(post_id)
    prompt = "Summarize the following thread, including post, comments, and drone information:\n\n"
    for row in results:
        row_dict = row_to_dict(row)
        prompt += (
            f"Post Title: {row_dict.get('title', '')}\n"
            f"Post Content: {row_dict.get('text', '')}\n"
            f"Drone Name: {row_dict.get('name', '')}\n"
            f"Drone Features: {row_dict.get('features', '')}\n"
            f"Comment: {row_dict.get('text', '')}\n\n"
            # Add other fields as needed
        )
    response = openai.ChatCompletion.create(
        model="gpt-4o",
        messages=[
            {"role": "system", "content": "Summarize the information"},
            {"role": "user", "content": prompt}
        ]
    )
    summary = response.choices[0].message.content
    return jsonify({"summary": summary})
