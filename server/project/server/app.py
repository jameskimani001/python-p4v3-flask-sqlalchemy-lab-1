from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)
CORS(app)

# Database configuration
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///food_waste.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = 'your-secret-key'  # Change this in production

db = SQLAlchemy(app)

# Models
class User(db.Model):
    id = db.Column(db.String, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    role = db.Column(db.String(20), nullable=False)
    is_verified = db.Column(db.Boolean, default=False)
    donations = db.relationship('Donation', backref='donor', lazy=True)
    claims = db.relationship('Claim', backref='claimer', lazy=True)

class Donation(db.Model):
    id = db.Column(db.String, primary_key=True)
    user_id = db.Column(db.String, db.ForeignKey('user.id'), nullable=False)
    food_type = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=False)
    location = db.Column(db.String(200), nullable=False)
    status = db.Column(db.String(20), default='available')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    claims = db.relationship('Claim', backref='donation', lazy=True)

class Claim(db.Model):
    id = db.Column(db.String, primary_key=True)
    user_id = db.Column(db.String, db.ForeignKey('user.id'), nullable=False)
    donation_id = db.Column(db.String, db.ForeignKey('donation.id'), nullable=False)
    status = db.Column(db.String(20), default='pending')
    claimed_at = db.Column(db.DateTime, default=datetime.utcnow)

with app.app_context():
    db.create_all()

# Routes
@app.route('/api/donations', methods=['GET'])
def get_donations():
    donations = Donation.query.all()
    return jsonify([{
        'id': d.id,
        'food_type': d.food_type,
        'description': d.description,
        'location': d.location,
        'status': d.status,
        'created_at': d.created_at.isoformat(),
        'donor': d.donor.name
    } for d in donations])

@app.route('/api/donations', methods=['POST'])
def create_donation():
    data = request.json
    donation = Donation(
        id=data['id'],
        user_id=data['user_id'],
        food_type=data['food_type'],
        description=data['description'],
        location=data['location']
    )
    db.session.add(donation)
    db.session.commit()
    return jsonify({'message': 'Donation created successfully'}), 201

@app.route('/api/donations/<donation_id>', methods=['PUT'])
def update_donation(donation_id):
    donation = Donation.query.get_or_404(donation_id)
    data = request.json
    donation.food_type = data.get('food_type', donation.food_type)
    donation.description = data.get('description', donation.description)
    donation.location = data.get('location', donation.location)
    donation.status = data.get('status', donation.status)
    db.session.commit()
    return jsonify({'message': 'Donation updated successfully'})

@app.route('/api/donations/<donation_id>', methods=['DELETE'])
def delete_donation(donation_id):
    donation = Donation.query.get_or_404(donation_id)
    db.session.delete(donation)
    db.session.commit()
    return jsonify({'message': 'Donation deleted successfully'})

@app.route('/api/claims', methods=['POST'])
def create_claim():
    data = request.json
    claim = Claim(
        id=data['id'],
        user_id=data['user_id'],
        donation_id=data['donation_id']
    )
    donation = Donation.query.get(data['donation_id'])
    donation.status = 'claimed'
    db.session.add(claim)
    db.session.commit()
    return jsonify({'message': 'Claim created successfully'}), 201

@app.route('/api/claims/<claim_id>', methods=['PUT'])
def update_claim_status(claim_id):
    claim = Claim.query.get_or_404(claim_id)
    data = request.json
    claim.status = data['status']
    if data['status'] == 'completed':
        claim.donation.status = 'completed'
    db.session.commit()
    return jsonify({'message': 'Claim status updated successfully'})

if __name__ == '__main__':
    app.run(debug=True)