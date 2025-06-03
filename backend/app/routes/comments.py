from flask import Blueprint, request, jsonify
from app.db import get_connection

comments_bp = Blueprint("comments", __name__)

@comments_bp.route("/posts/<int:post_id>/comments", methods=["GET"])
def get_comments(post_id):
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM comments WHERE post_id=%s", (post_id,))
    comments = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(comments)

@comments_bp.route("/comments/<int:comment_id>", methods=["GET"])
def get_comment_by_id(comment_id):
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM comments WHERE id=%s", (comment_id,))
    comment = cursor.fetchone()
    cursor.close()
    conn.close()
    if comment:
        return jsonify(comment)
    return jsonify({"error": "Comment not found"}), 404

@comments_bp.route("/posts/<int:post_id>/comments", methods=["POST"])
def create_comment(post_id):
    data = request.json
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO comments (post_id, user_name, text, role, anonymous)
        VALUES (%s, %s, %s, %s, %s)
    """, (post_id, data["user_name"], data["text"], data.get("role"), data.get("anonymous", False)))
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({"message": "Comment added"})
