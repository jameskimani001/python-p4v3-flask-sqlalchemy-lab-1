from flask_sqlalchemy import SQLAlchemy
from marshmallow_sqlalchemy import SQLAlchemyAutoSchema

# Initialize the SQLAlchemy instance
db = SQLAlchemy()

class Earthquake(db.Model):
    __tablename__ = "earthquakes"

    id = db.Column(db.Integer, primary_key=True)
    magnitude = db.Column(db.Float)
    location = db.Column(db.String(255))
    year = db.Column(db.Integer)

    # The __repr__ method for a string representation of the instance
    def __repr__(self):
        return f"<Earthquake {self.id}, {self.magnitude}, {self.location}, {self.year}>"

    # to_dict method to convert instance attributes into a dictionary (useful for JSON responses)
    def to_dict(self):
        return {
            "id": self.id,
            "magnitude": self.magnitude,
            "location": self.location,
            "year": self.year
        }

# Marshmallow schema for serialization
class EarthquakeSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = Earthquake
        load_instance = True  # This allows loading the instance from data