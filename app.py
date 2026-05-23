from flask import Flask, render_template, request, redirect
from werkzeug.security import generate_password_hash, check_password_hash
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import func
from datetime import datetime

app =  Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///database.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] =  False

db = SQLAlchemy(app)

#User(user_id, name, email, password_hash, phone, role, is_verified, created_at)
class User(db.Model):
    user_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    phone = db.Column(db.String(15), unique=True, nullable=True)
    role = db.Column(db.String(50), nullable=False, default='USER')
    is_verified = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=func.now)
   


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/login")
def login():
    return render_template("auth/select-role.html")

@app.route("/register")
def register():
    return render_template("auth/start-role.html")

# NGO

@app.route("/ngo/login", methods=["GET","POST"])
def nLogin():

    return render_template("auth/ngo-login.html")

@app.route("/ngo/register")
def nRegister():
    return render_template("auth/ngo-register.html")

# RESTAURANT
@app.route("/restaurant/login")
def rLogin():
    return render_template("auth/restaurant-login.html")

@app.route("/restaurant/register")
def rRegister():
    return render_template("auth/restaurant-register.html")




if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    app.run(debug=True,host='0.0.0.0')