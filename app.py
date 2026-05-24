from flask import Flask, render_template, request, redirect, session, url_for
from werkzeug.security import generate_password_hash, check_password_hash
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import func
from datetime import datetime
import os
from werkzeug.utils import secure_filename

app =  Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///database.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] =  False
app.secret_key = "bmspmpim"
db = SQLAlchemy(app)


#User(user_id, name, email, password_hash, phone, role, is_verified, created_at)
class User(db.Model):
    user_id = db.Column(db.Integer, primary_key=True, autoincrement=True)

    # Foreign Key
    role_id = db.Column(db.Integer)

    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(128), nullable=False)
    phone = db.Column(db.String(15), unique=True, nullable=True)
    role = db.Column(db.String(1), nullable=False)
    is_verified = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime(timezone=True), server_default=func.now())


class Restaurant(db.Model):

    restaurant_id = db.Column(db.Integer, primary_key=True, autoincrement=True)


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
    
    ngo_name = db.Column(db.String(150), nullable=False)
    registration_no = db.Column(db.String(100), unique=True, nullable=False)

    address = db.Column(db.String(255), nullable=False)
    pincode = db.Column(db.String(10), nullable=False)

    latitude = db.Column(db.Float, nullable=False)
    longitude = db.Column(db.Float, nullable=False)

    capacity = db.Column(db.Integer, nullable=True)
    focus_area = db.Column(db.String(100), nullable=False)

    created_at = db.Column(db.DateTime(timezone=True), server_default=func.now())




class FoodListing(db.Model):
    listing_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    restaurant_id = db.Column(db.Integer, nullable=False)
    food_name = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=True)
    quantity = db.Column(db.Float, nullable=False)
    quantity_unit = db.Column(db.String(50), nullable=True)
    food_type = db.Column(db.String(50), nullable=False)
    prepared_at = db.Column(db.DateTime, nullable=False)
    expires_at = db.Column(db.DateTime, nullable=False)
    pickup_deadline = db.Column(db.DateTime, nullable=False)
    status = db.Column(db.String(20), default='active')
    allergens = db.Column(db.String(255), nullable=True)
    created_at = db.Column(db.DateTime(timezone=True), server_default=func.now())

class DonationRequest(db.Model):
    request_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    listing_id = db.Column(db.Integer, nullable=False)
    ngo_id = db.Column(db.Integer, nullable=False)
    requested_qty = db.Column(db.Float, nullable=False)
    status = db.Column(db.String(50), nullable=False)
    note = db.Column(db.Text, nullable=True)
    requested_at = db.Column(db.DateTime(timezone=True), server_default=func.now())
    responded_at = db.Column(db.DateTime, nullable=True)
    picked_up_at = db.Column(db.DateTime, nullable=True)

class Donation(db.Model):
    donation_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    request_id = db.Column(db.Integer, nullable=False)
    actual_qty = db.Column(db.Float, nullable=False)
    actual_qty_unit = db.Column(db.String(50), nullable=True)
    people_fed = db.Column(db.Integer, nullable=True)
    co2_saved_kg = db.Column(db.Float, nullable=True)
    feedback_by_ngo = db.Column(db.Text, nullable=True)
    rating_by_ngo = db.Column(db.Integer, nullable=True)
    donated_at = db.Column(db.DateTime(timezone=True), server_default=func.now())

class Notification(db.Model):
    notif_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, nullable=False)
    type = db.Column(db.String(50), nullable=False)
    title = db.Column(db.String(150), nullable=False)
    message = db.Column(db.Text, nullable=False)
    is_read = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime(timezone=True), server_default=func.now())

class ImpactMetric(db.Model):
    metric_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    date = db.Column(db.Date, nullable=False)
    total_donations = db.Column(db.Integer, default=0)
    total_qty_kg = db.Column(db.Float, default=0.0)
    people_fed = db.Column(db.Integer, default=0)
    co2_saved_kg = db.Column(db.Float, default=0.0)
    active_restaurants = db.Column(db.Integer, default=0)
    active_ngos = db.Column(db.Integer, default=0)
    updated_at = db.Column(db.DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

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
    if request.method=="POST":
        email = request.form["email"]
        user = User.query.filter_by(email = email).first_or_404()
        if user:
            if check_password_hash(user.password,request.form["password"]):
                session['role'] = 'N'
                session['id'] = user.role_id
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

        n = NGO()
        
        n.ngo_name = data["nname"]
        n.registration_no = data["regno"]
        n.capacity = data["capacity"]
        n.focus_area = data["type"]
        n.address = data["address"]
        n.pincode = data["pincode"]
        n.latitude = data["lat"]
        n.longitude = data["lon"]
        
        db.session.add(n)
        db.session.commit()

        user = User()
        user.name = data["name"]
        user.email = data["email"]
        user.phone = data["phone"]
        user.password = generate_password_hash(data["password"])
        user.role = 'N'
        user.role_id = n.ngo_id
        db.session.add(user)
        db.session.commit()

        session['role'] = 'N'
        session['id'] = n.ngo_id


        return redirect("/ngo/dashboard")

    return render_template("auth/ngo-register.html")


@app.route("/ngo/profile")
def nProfile():
    if session.get("role",0) != 'N': 
        return render_template("invalid.html",error="Forbidden access")
    
    ngo = NGO.query.get(session["id"])
    user = User.query.filter_by(role_id = session["id"],role= 'N').first()
    return render_template("ngo/profile.html",n=ngo, email = user.email, phone=user.phone  )

@app.route("/ngo/update", methods=["POST"])
def nUpdate():
    n = NGO.query.get(session["id"])
    user = User.query.filter_by(role_id = session["id"],role= 'N').first()
    data = request.form
    n.ngo_name = data["name"]
    n.registration_no = data["reg"]
    user.email = data["email"]
    user.phone = data["phone"]
    n.capacity = data["cap"]
    n.focus_area = data["cat"]
    # n.latitude = data["lat"]
    # n.longitude = data["lon"]

    db.session.add(n)
    db.session.add(user)
    db.session.commit()
    return redirect("/ngo/profile")
    

@app.route("/ngo/dashboard")
def nDashboard():
    if session.get("role",0) != 'N': 
        return render_template("invalid.html",error="Forbidden access")
    return render_template("ngo/dashboard.html")


# RESTAURANT
@app.route("/restaurant/login", methods=["GET","POST"])
def rLogin():
    if request.method=="POST":
        email = request.form["email"]
        user = User.query.filter_by(email = email).first_or_404()
        if user:
            if check_password_hash(user.password,request.form["password"]):
                session['role'] = 'R'
                session['id'] = user.role_id
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
        
        r = Restaurant()
        
        r.restaurant_name = data["rname"]
        r.fssai_license= data["fssai"]
        r.cuisine_type= data["type"]
        r.operating_hours = data["interval"]
        r.address = data["address"]
        r.pincode = data["pincode"]
        r.longitude = data["lon"]
        r.latitude = data["lat"]
        
        db.session.add(r)
        db.session.commit()

        user = User()
        user.name = data["name"]
        user.email = data["email"]
        user.phone = data["phone"]
        user.password = generate_password_hash(data["password"])
        user.role = 'R'
        user.role_id = r.restaurant_id
        db.session.add(user)
        db.session.commit()

        session['role'] = 'R'
        session['id'] = user.role_id

        return redirect("/restaurant/dashboard")
    
    return render_template("auth/restaurant-register.html")

@app.route("/restaurant/dashboard")
def rDashboard():
    if session.get("role",0) != 'R': 
        return render_template("invalid.html",error="Forbidden access")
    
    return render_template("/restaurant/dashboard.html")



@app.route('/restaurant/create-listing', methods=['GET','POST'])
def create_listing():
    if session.get('role',0) != 'R':
        return render_template('invalid.html', error='Forbidden access')

    if request.method == 'POST':
        data = request.form
        listing = FoodListing()
        listing.restaurant_id = session.get('id')
        listing.food_name = data.get('food_name')
        listing.description = data.get('description')
        try:
            listing.quantity = float(data.get('quantity') or 0)
        except:
            listing.quantity = 0
        listing.quantity_unit = data.get('quantity_unit')
        listing.food_type = data.get('food_type')
        listing.allergens = data.get('allergens')
        listing.prepared_at = datetime.fromisoformat(data.get('prepared_at'))
        listing.expires_at = datetime.fromisoformat(data.get('expires_at'))
        listing.pickup_deadline = datetime.fromisoformat(data.get('pickup_deadline'))

        db.session.add(listing)
        db.session.commit()
        return redirect(url_for('rActiveListings'))

    return render_template('restaurant/create-listing.html')

@app.route("/restaurant/active-listings")
def rActiveListings():
    if session.get("role",0) != 'R': 
        return render_template("invalid.html",error="Forbidden access")
    return render_template("restaurant/active-listings.html")

@app.route("/restaurant/analytics")
def rAnalytics():
    if session.get("role",0) != 'R': 
        return render_template("invalid.html",error="Forbidden access")
    return render_template("restaurant/analytics.html")

@app.route("/restaurant/notifications")
def rNotifications():
    if session.get("role",0) != 'R': 
        return render_template("invalid.html",error="Forbidden access")
    return render_template("restaurant/notifications.html")

@app.route("/restaurant/profile")
def rProfile():
    if session.get("role",0) != 'R': 
        return render_template("invalid.html",error="Forbidden access")
    return render_template("restaurant/profile.html")

@app.route("/logout")
def logout():
    session.pop("role",0)
    return home()

if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    app.run(debug=True,host='0.0.0.0')