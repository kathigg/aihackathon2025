from flask import Flask
from flask_cors import CORS
# Import all blueprints
from app.routes.users import users_bp
from app.routes.auth import auth_bp
from app.routes.posts import posts_bp
from app.routes.comments import comments_bp
from app.routes.votes import votes_bp

def create_app():
    app = Flask(__name__)
    CORS(app)  # Allow React frontend to connect

    # Register Blueprints
    app.register_blueprint(users_bp)
    app.register_blueprint(auth_bp)
    app.register_blueprint(posts_bp)
    app.register_blueprint(comments_bp)
    app.register_blueprint(votes_bp)

    return app
