# backend/app.py

from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import os
from werkzeug.utils import secure_filename
import boto3
from botocore.exceptions import NoCredentialsError
from werkzeug.security import generate_password_hash, check_password_hash
import jwt
from functools import wraps
from config import Config
from models import db, User, Image
from sqlalchemy import text  # Import text for raw SQL queries

app = Flask(__name__)
app.config.from_object(Config)
CORS(app)
db.init_app(app)

# Create all database tables
with app.app_context():
    db.create_all()
    try:
        db.session.execute(text('SELECT 1'))  # Check database connection with text()
        print("Database connected successfully!")
    except Exception as e:
        print(f"Database connection failed: {e}")

# Configure S3 for file storage
s3 = boto3.client(
    's3',
    aws_access_key_id=Config.AWS_ACCESS_KEY_ID,
    aws_secret_access_key=Config.AWS_SECRET_ACCESS_KEY,
)

BUCKET_NAME = 'img-store-container'  # Replace with your bucket name

# Health check endpoint
@app.route('/health', methods=['GET'])
def health_check():
    try:
        db.session.execute(text('SELECT 1'))  # Simple query to check connection with text()
        return jsonify({'status': 'healthy'}), 200
    except Exception as e:
        return jsonify({'status': 'unhealthy', 'error': str(e)}), 500

# S3 Bucket check endpoint
@app.route('/s3-check', methods=['GET'])
def s3_check():
    try:
        # Check if you can list the bucket contents
        response = s3.list_objects_v2(Bucket=BUCKET_NAME)
        if 'Contents' in response:
            return jsonify({'status': 'S3 connected', 'message': f'Bucket contains {len(response["Contents"])} objects'}), 200
        else:
            return jsonify({'status': 'S3 connected', 'message': 'Bucket is empty'}), 200
    except Exception as e:
        return jsonify({'status': 'S3 connection failed', 'error': str(e)}), 500

# Decorator to require authentication
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        if 'Authorization' in request.headers:
            token = request.headers['Authorization'].split(" ")[1]  # Expecting "Bearer <token>"
        if not token:
            return jsonify({'message': 'Token is missing!'}), 401
        try:
            data = jwt.decode(token, Config.JWT_SECRET_KEY, algorithms=["HS256"])
            current_user = User.query.get(data['user_id'])
        except Exception as e:
            return jsonify({'message': 'Token is invalid!'}), 401
        return f(current_user, *args, **kwargs)
    return decorated

# User registration
@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    print(f"Received registration data: {data}")
    # Use 'pbkdf2:sha256' as the hash method
    hashed_password = generate_password_hash(data['password'], method='pbkdf2:sha256')
    new_user = User(username=data['username'], password_hash=hashed_password)
    db.session.add(new_user)
    db.session.commit()
    return jsonify({'message': 'User created'}), 201

# User login
@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.query.filter_by(username=data['username']).first()
    
    if user and check_password_hash(user.password_hash, data['password']):
        token = jwt.encode({'user_id': user.id}, Config.JWT_SECRET_KEY, algorithm="HS256")
        return jsonify({'token': token})
    
    return jsonify({'message': 'Invalid username or password'}), 401

# Upload image to S3
@app.route('/upload', methods=['POST'])
@token_required
def upload_image(current_user):
    if 'file' not in request.files:
        return jsonify({'error': 'No file provided'}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    filename = secure_filename(file.filename)
    try:
        s3.upload_fileobj(file, BUCKET_NAME, filename)
        new_image = Image(filename=filename, upload_time=datetime.now(), user_id=current_user.id)  # Use actual user ID
        db.session.add(new_image)
        db.session.commit()
        return jsonify({'message': 'Image uploaded successfully'}), 200
    except NoCredentialsError:
        return jsonify({'error': 'Credentials not available'}), 500
    except Exception as e:
        print(f"An error occurred: {e}")
        return jsonify({'error': 'Upload failed', 'message': str(e)}), 500

# Fetch images
@app.route('/images', methods=['GET'])
@token_required
def get_images(current_user):
    images = Image.query.filter_by(user_id=current_user.id).all()  # Fetch only user's images
    return jsonify({'images': [image.filename for image in images]})

if __name__ == '__main__':
    app.run(port=8000)
