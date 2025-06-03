from flask import Blueprint, jsonify, request
from app.db import get_connection

users_bp = Blueprint("users", __name__)

@users_bp.route("/users", methods=["GET"])
def get_users():
    conn = get_connection()
    if conn is None:
        return jsonify({"error": "Could not connect to the database"}), 500

    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT id, first_name, last_name, user_name, email, role, pages_following, dod_verified FROM users;")
    users = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(users)

@users_bp.route("/users/<int:user_id>", methods=["GET"])
def get_user_by_id(user_id):
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT id, first_name, last_name, user_name, role, email, pages_following, dod_verified FROM users WHERE id=%s", (user_id,))
    user = cursor.fetchone()
    cursor.close()
    conn.close()
    if user:
        return jsonify(user)
    return jsonify({"error": "User not found"}), 404
