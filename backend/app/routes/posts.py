from flask import Blueprint, request, jsonify
from app.db import get_connection

posts_bp = Blueprint("posts", __name__)

@posts_bp.route("/posts", methods=["GET"])
def get_posts():
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM posts")
    posts = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(posts)

@posts_bp.route("/posts/page/<string:page>", methods=["GET"])
def get_posts_by_page(page):
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM posts WHERE page=%s", (page,))
    posts = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(posts)

@posts_bp.route("/posts/<int:post_id>", methods=["GET"])
def get_post_by_id(post_id):
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM posts WHERE id=%s", (post_id,))
    post = cursor.fetchone()
    cursor.close()
    conn.close()
    if post:
        return jsonify(post)
    return jsonify({"error": "Post not found"}), 404

@posts_bp.route("/posts", methods=["POST"])
def create_post():
    data = request.json
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO posts (title, user_name, drone_id, text, page, anonymous, tags, trl_level, urgency_label, media)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
    """, (
        data["title"], data["user_name"], data.get("drone_id"), data["text"], 
        data["page"], data.get("anonymous", False), data.get("tags"), 
        data.get("trl_level"), data.get("urgency_label"), data.get("media")
    ))
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({"message": "Post created"})