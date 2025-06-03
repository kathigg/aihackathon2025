from flask import Blueprint, jsonify
from app.db import get_connection

users_bp = Blueprint("users", __name__)

@users_bp.route("/users", methods=["GET"])
def get_users():
    conn = get_connection()
    if conn is None:
        return jsonify({"error": "Could not connect to the database"}), 500

    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT id, first_name, last_name, user_name, email, pages_following, dod_verified, FROM users;")
    users = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(users)
