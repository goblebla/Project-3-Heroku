# import necessary libraries
# from models import create_classes
import os
# import numpy as np

import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func

from flask import (
    Flask,
    render_template,
    jsonify,
    request,
    redirect)

# engine = create_engine("sqlite:///Unemployment.db")
# # reflect an existing database into a new model
# Base= automap_base()
# # reflect the tables
# Base.prepare(engine, reflect=True)
# #Saving reference to the table
# state_unemployment = Base.classes.Unemployment_New
# session = Session(engine)
#################################################
# Flask Setup
#################################################
app = Flask(__name__)

#################################################
# Database Setup
#################################################

from flask_sqlalchemy import SQLAlchemy
app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:///Unemployment.db"

# Remove tracking modifications
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# reflect an existing database into a new model
Base= automap_base()
# reflect the tables
engine = create_engine("sqlite:///Unemployment.db")

Base.prepare(engine, reflect=True)

# Unemployment_Data = Base.classes.Unemployment_New
Unemployment_Data = Base.classes.COVID_Unemployment


# unemployment = create_classes(db)

# conn = engine.connect()

# create route that renders index.html template
@app.route("/")
def home():
    return render_template("index.html")

# @app.route("/COVIDUnemployment")
# def dataroute():
#     return render_template("COVIDUnemployment.html")


# # Query the database and send the jsonified results
# @app.route("/send", methods=["GET", "POST"])
# def send():
#     if request.method == "POST":
#         name = request.form["petName"]
#         lat = request.form["petLat"]
#         lon = request.form["petLon"]

#         pet = Pet(name=name, lat=lat, lon=lon)
#         db.session.add(pet)
#         db.session.commit()
#         return redirect("/", code=302)

#     return render_template("form.html")


@app.route("/api/unemployment")
def pals():
    # results = conn.execute("SELECT State, date(Filedweekended), ContinuedClaims FROM Unemployment_New")
    # results = db.session.query("Unemployment_New.State", "Unemployment_New.Filedweekended", "Unemployment_New.ContinuedClaims").all()
    results = db.session.query(Unemployment_Data).all()

    claims_data = []

    for result in results:
        claims_dict = {"State": result.State, 
        "Date": result.Date,
        "cumulative_cases": result.cumulative_cases,
        "cumulative_cases_per_100_000": result.cumulative_cases_per_100_000,
        "cumulative_deaths": result.cumulative_deaths,
        "cumulative_deaths_per_100_000": result.cumulative_deaths_per_100_000,
        "new_cases": result.new_cases,
        "new_cases_7_day_rolling_avg": result.new_cases_7_day_rolling_avg, 
        "new_deaths": result.new_deaths, 
        "new_deaths_7_day_rolling_avg": result.new_deaths_7_day_rolling_avg,
        "new_deaths_per_100_000": result.new_deaths_per_100_000,
        "new_cases_per_100_000": result.new_cases_per_100_000,
        "InitialClaims": result.InitialClaims, 
        "ContinuedClaims": result.ContinuedClaims, 
        "InsuredUnemploymentRate": result.InsuredUnemploymentRate}
        claims_data.append(claims_dict)
        print(result)

    return jsonify(claims_data)


if __name__ == "__main__":
    app.run(debug=True)
