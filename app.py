from flask import Flask, render_template, request, redirect, session
from werkzeug.security import generate_password_hash, check_password_hash
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import func
from datetime import datetime

app =  Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///database.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] =  False
app.secret_key = "bmspmpim"
db = SQLAlchemy(app)


class Test(db.Model):
    id = db.Column(db.Integer,primary_key=True,autoincrement=True)
    name = db.Column(db.String(10),nullable=False)

#User(user_id, name, email, password_hash, phone, role, is_verified, created_at)
class User(db.Model):
    user_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(128), nullable=False)
    phone = db.Column(db.String(15), unique=True, nullable=True)
    role = db.Column(db.String(1), nullable=False)
    is_verified = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.now())


class Restaurant(db.Model):

    restaurant_id = db.Column(db.Integer, primary_key=True, autoincrement=True)

    # Foreign key to User
    user_id = db.Column(db.Integer, nullable=False)

    restaurant_name = db.Column(db.String(150), nullable=False)
    address = db.Column(db.String(255), nullable=False)
    pincode = db.Column(db.String(10), nullable=False)

    latitude = db.Column(db.Float, nullable=False)
    longitude = db.Column(db.Float, nullable=False)

    fssai_license = db.Column(db.String(50), unique=True, nullable=False)
    cuisine_type = db.Column(db.String(100), nullable=False)
    operating_hours = db.Column(db.String(100), nullable=True)

    created_at = db.Column(db.DateTime(timezone=True), server_default=func.now())

class NGO(db.Model):

    ngo_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    # Foreign Key
    user_id = db.Column(db.Integer, nullable=False)
    
    ngo_name = db.Column(db.String(150), nullable=False)
    registration_no = db.Column(db.String(100), unique=True, nullable=False)

    address = db.Column(db.String(255), nullable=False)
    pincode = db.Column(db.String(10), nullable=False)

    latitude = db.Column(db.Float, nullable=False)
    longitude = db.Column(db.Float, nullable=False)

    capacity = db.Column(db.Integer, nullable=True)
    focus_area = db.Column(db.String(100), nullable=False)

    created_at = db.Column(db.DateTime(timezone=True), server_default=func.now())


@app.route("/")
def home():
    return render_template("index.html", data = "Shahil")


@app.route("/login")
def login():
    return render_template("auth/select-role.html")

@app.route("/register")
def register():
    return render_template("auth/start-role.html")

# NGO

@app.route("/ngo/login", methods=["GET","POST"])
def nLogin():
    if request.method=="POST":
        email = request.form["email"]
        user = User.query.filter_by(email = email).first_or_404()
        if user:
            if check_password_hash(user.password,request.form["password"]):
                return redirect("/ngo/dashboard")
            else:
                return render_template("invalid.html",error="Invalid password")
        
        else:
            return render_template("invalid.html",error="No such user Found")

    return render_template("auth/ngo-login.html")


@app.route("/ngo/register", methods=["GET","POST"])
def nRegister():
    if request.method=="POST":
        data = request.form
        user = User()
        user.name = data["name"]
        user.email = data["email"]
        user.phone = data["phone"]
        user.password = generate_password_hash(data["password"])
        user.role = 'N'
        db.session.add(user)
        db.session.commit()

        n = NGO()
        
        n.ngo_name = data["nname"]
        n.registration_no = data["regno"]
        n.capacity = data["capacity"]
        n.focus_area = data["type"]
        n.address = data["address"]
        n.pincode = data["pincode"]
        n.latitude = data["lat"]
        n.longitude = data["lon"]

        n.user_id = user.user_id
        
        db.session.add(n)
        db.session.commit()

        return redirect("/ngo/dashboard")

    return render_template("auth/ngo-register.html")

@app.route("/ngo/dashboard")
def nDashboard():

    return render_template("ngo/dashboard.html")




# RESTAURANT
@app.route("/restaurant/login", methods=["GET","POST"])
def rLogin():
    if request.method=="POST":
        email = request.form["email"]
        user = User.query.filter_by(email = email).first_or_404()
        if user:
            if check_password_hash(user.password,request.form["password"]):
                return redirect("/restaurant/dashboard")
            else:
                return render_template("invalid.html",error="Invalid password")
        
        else:
            return render_template("invalid.html",error="No such user Found")

    return render_template("auth/restaurant-login.html")

@app.route("/restaurant/register", methods=["GET","POST"])
def rRegister():
    if request.method=="POST":
        data = request.form
        user = User()
        user.name = data["name"]
        user.email = data["email"]
        user.phone = data["phone"]
        user.password = generate_password_hash(data["password"])
        user.role = 'R'
        db.session.add(user)
        db.session.commit()

        r = Restaurant()
        
        r.restaurant_name = data["rname"]
        r.fssai_license= data["fssai"]
        r.cuisine_type= data["type"]
        r.operating_hours = data["interval"]
        r.address = data["address"]
        r.pincode = data["pincode"]
        r.longitude = data["lon"]
        r.latitude = data["lat"]
        r.user_id = user.user_id
        
        db.session.add(r)
        db.session.commit()

        return redirect("/restaurant/dashboard")
    
    return render_template("auth/restaurant-register.html")

@app.route("/restaurant/dashboard")
def rDashboard():
    return render_template("/restaurant/dashboard.html")



# TEST
@app.route("/add",methods=["GET","POST"])
def testing():
    if request.method=="POST":
        obj = Test()
        obj.name = request.form["v"]
        db.session.add(obj)
        db.session.commit()
        return redirect("/add")

    return render_template("take.html")




if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    app.run(debug=True,host='0.0.0.0')