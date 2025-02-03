#!/usr/bin/env python3

from flask import Flask, make_response, jsonify
from flask_migrate import Migrate
from models import db, Earthquake, EarthquakeSchema

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///app.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.json.compact = False

migrate = Migrate(app, db)
db.init_app(app)

# Create an instance of the Marshmallow schema
earthquake_schema = EarthquakeSchema()
earthquakes_schema = EarthquakeSchema(many=True)

@app.route('/')
def index():
    body = {'message': 'Flask SQLAlchemy Lab 1'}
    return make_response(body, 200)

# Route to get an earthquake by ID
@app.route('/earthquakes/<int:id>', methods=['GET'])
def get_earthquake_by_id(id):
    earthquake = Earthquake.query.get(id)
    
    if earthquake is None:
        return jsonify({'message': f'Earthquake {id} not found.'}), 404
    
    # Serialize the earthquake object using the schema
    return jsonify(earthquake_schema.dump(earthquake))

# Route to get all earthquakes with a minimum magnitude
@app.route('/earthquakes/magnitude/<float:magnitude>', methods=['GET'])
def get_earthquakes_by_magnitude(magnitude):
    earthquakes = Earthquake.query.filter(Earthquake.magnitude >= magnitude).all()
    
    # If no earthquakes found with the given magnitude
    if not earthquakes:
        return jsonify({'count': 0, 'quakes': []}), 200
    
    # Serialize the list of earthquakes
    return jsonify({
        'count': len(earthquakes),
        'quakes': earthquakes_schema.dump(earthquakes)
    })

if __name__ == '__main__':
    app.run(port=5555, debug=True)