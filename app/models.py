from app import db, login
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin


class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(64), index=True, unique=True)
    email = db.Column(db.String(64), index=True, unique=True)
    password_hash = db.Column(db.String(128))
    transactions = db.relationship('Transactions', backref='user_transactions', lazy='dynamic')
    categories = db.relationship('Categories', backref='user_categories', lazy='dynamic')

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)


class Transactions(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    category = db.Column(db.String(64), index=True)
    amount = db.Column(db.Float)
    type = db.Column(db.String(64))
    date = db.Column(db.Date)
    archived = db.Column(db.String(2))
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))


class Categories(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    category = db.Column(db.String(64), index=True)
    amount = db.Column(db.Float)
    type = db.Column(db.String(64))
    frequency = db.Column(db.String(64), index=True)
    archived = db.Column(db.String(2))
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))


@login.user_loader
def load_user(id):
    return User.query.get(int(id))