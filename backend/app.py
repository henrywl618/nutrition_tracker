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
    """Make an API call to NUTRITIONIX API to get results for search bar"""
    query = request.args.get("query")
    response = requests.get(SEARCH_URL,
                            headers=NUTRITIONIX_API_HEADERS, 
                            params={'query':query})
    return jsonify(response.json())

@app.route("/nutrition/<category>", methods=['GET'])
def get_nutrition(category):
    """Make an API call to NUTRITIONIX API to get nutrition data for a specific fooditem"""
    if category == 'brand':
        id = request.args.get("nix_item_id")
        response = requests.get("https://trackapi.nutritionix.com/v2/search/item", 
                                headers=NUTRITIONIX_API_HEADERS,
                                params={'nix_item_id':id})
        return jsonify(response.json()["foods"][0])
    elif category == 'common':
        query = request.args.get("food_name")
        response = requests.post("https://trackapi.nutritionix.com/v2/natural/nutrients",
                                 headers=NUTRITIONIX_API_HEADERS,
                                 data={"query":query})
        return jsonify(response.json()["foods"][0])    
