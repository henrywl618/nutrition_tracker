import os, requests
from flask import Flask, request, jsonify 
from flask_cors import CORS
from models import db, connect_db, User, Fooditem, Diary, DiaryEntryLine, Mealplan, MealplanEntryLine, Tag, MealplanTag

NUTRITIONIX_API_HEADERS = {'x-app-id':'cb1063ec',
                           'x-app-key':'fe556ea31678a878f116c76bbd8da68e'}
SEARCH_URL = 'https://trackapi.nutritionix.com/v2/search/instant'

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = (
    os.environ.get('DATABASE_URL', 'postgresql:///nutrition_tracker'))

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_ECHO'] = False
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', "it's a secret")
# Enable CORS support for all routes. Allows React frontend to make http requests to backend server.
CORS(app)

connect_db(app)

@app.route("/")
def view_homepage():
    fooditems = Fooditem.query.all()
    serialized = [fooditem.serialize() for fooditem in fooditems]
    return jsonify(serialized)

@app.route("/search", methods=['GET'])
def search():
    query = request.args.get("query")
    response = requests.get(SEARCH_URL,headers=NUTRITIONIX_API_HEADERS, params={'query':query})
    return jsonify(response.json())
