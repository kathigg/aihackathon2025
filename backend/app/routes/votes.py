from flask import Blueprint, request, jsonify
from app.db import get_connection

votes_bp = Blueprint("votes", __name__)

@votes_bp.route("/posts/<int:post_id>/vote", methods=["POST"])
def vote_post(post_id):
    data = request.json
    user_id = data["user_id"]
    action = data["action"]  # "up" or "down"

    conn = get_connection()
    cursor = conn.cursor()

    # Remove existing opposite vote first
    if action == "up":
        cursor.execute("DELETE FROM post_downvotes WHERE user_id=%s AND post_id=%s", (user_id, post_id))
        cursor.execute("REPLACE INTO post_upvotes (user_id, post_id) VALUES (%s, %s)", (user_id, post_id))
    elif action == "down":
        cursor.execute("DELETE FROM post_upvotes WHERE user_id=%s AND post_id=%s", (user_id, post_id))
        cursor.execute("REPLACE INTO post_downvotes (user_id, post_id) VALUES (%s, %s)", (user_id, post_id))
    else:
        return jsonify({"error": "Invalid action"}), 400

    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({"message": f"Post {action}voted"})

@votes_bp.route("/posts/<int:post_id>/votes", methods=["GET"])
def get_post_votes(post_id):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT COUNT(*) FROM post_upvotes WHERE post_id=%s", (post_id,))
    upvotes = cursor.fetchone()[0]
    cursor.execute("SELECT COUNT(*) FROM post_downvotes WHERE post_id=%s", (post_id,))
    downvotes = cursor.fetchone()[0]
    cursor.close()
    conn.close()
    return jsonify({"upvotes": upvotes, "downvotes": downvotes})
