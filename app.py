from flask import Flask, render_template, request, redirect
from werkzeug.security import generate_password_hash, check_password_hash

app =  Flask(__name__)

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

# GATEWAY PATH



if __name__ == "__main__":
    app.run(debug=True,host='0.0.0.0')