from flask import Blueprint, request, jsonify
from app.db import get_connection
import bcrypt

auth_bp = Blueprint("auth", __name__)

@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.json
    password_hash = bcrypt.hashpw(data["password"].encode("utf-8"), bcrypt.gensalt()).decode("utf-8")
    conn = get_connection()
    if conn is None:
        return jsonify({"error": "DB connection failed"}), 500

    try:
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO users (first_name, last_name, user_name, role, password, email)
            VALUES (%s, %s, %s, %s, %s, %s)
        """, (data["first_name"], data["last_name"], data["user_name"], data["role"], password_hash, data["email"]))
        conn.commit()
        return jsonify({"message": "User registered successfully"})
    except Exception as e:
        conn.rollback()
        return jsonify({"error": str(e)}), 400
    finally:
        cursor.close()
        conn.close()

@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.json
    conn = get_connection()
    if conn is None:
        return jsonify({"error": "DB connection failed"}), 500
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM users WHERE user_name=%s", (data["user_name"],))
    user = cursor.fetchone()
    cursor.close()
    conn.close()
    if user and bcrypt.checkpw(data["password"].encode("utf-8"), user["password"].encode("utf-8")):
        return jsonify({"message": "Login successful", "user": {k: v for k, v in user.items() if k != "password"}})
    return jsonify({"error": "Invalid credentials"}), 401
