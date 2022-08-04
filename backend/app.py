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

@app.route("/diary", methods=['GET'])
def view_diaries():
    """ Returns a list of all the users diaries """
    user_id = request.args.get("userId")
    user = User.query.get_or_404(user_id)
    diaries = Diary.query.filter(Diary.user_id == user_id).order_by(Diary.date.desc()).all()
    serialized_diaries = [diary.serialize() for diary in diaries]
    return jsonify(serialized_diaries)

@app.route("/diary", methods=['POST'])
def create_diary():
    """ Creates a new diary for the given user and form data"""
    data = request.json
    print(data)
    new_diary = Diary(user_id=data['user_id'],
                      date=data['date'],
                      calorie_goal=data['calorie_goal'],)
    db.session.add(new_diary)
    db.session.commit()
    # Append a new entryline to the new diary. A new fooditem is created if it does not already exist on the server database.
    for entry in data['entries']:
        new_fooditem = Fooditem.query.filter(Fooditem.food_name == entry['food_name']).one_or_none()
        if new_fooditem:
            new_entry = DiaryEntryLine(diary_id=new_diary.id,
                                        fooditem_id=new_fooditem.id,
                                        quantity=entry['qty'])
            new_diary.entryline.append(new_entry)
        else:
            new_fooditem = Fooditem(food_name=entry['food_name'],
                                    calorie=entry['calorie'],
                                    isBrand= 'TRUE' if entry['isBrand'] == 'TRUE' else 'FALSE',
                                    brand_item_id = entry.get('brand_item_id'),
                                    image=entry['image'])
            db.session.add(new_fooditem)
            db.session.commit()
            new_entry = DiaryEntryLine(diary_id=new_diary.id,
                                        fooditem_id=new_fooditem.id,
                                        quantity=entry['qty'])
            new_diary.entryline.append(new_entry)
    db.session.commit()
    entries = new_diary.entryline
    serialized_entries = [entry.serialize() for entry in entries]
    return jsonify({**new_diary.serialize(), 'entries':serialized_entries, 'success':True})

@app.route("/diary/<int:diary_id>", methods=["GET"])
def view_diary(diary_id):
    """ Return data for a specific diary """
    diary = Diary.query.get_or_404(diary_id)
    entries = diary.entryline
    serialized_entries = [entry.serialize() for entry in entries]

    return jsonify({**diary.serialize(),'entries':serialized_entries})

@app.route("/diary/<int:diary_id>", methods=["PUT"])
def edit_diary(diary_id):
    """ Edits a specific diary """

    data= request.json
    diary = Diary.query.get_or_404(diary_id)

    # Delete all current entries and create new entries passed in from the frontend
    for entry in diary.entryline:
        db.session.delete(entry)
    db.session.commit()

    # Append a new entryline to the new diary. A new fooditem is created if it does not already exist on the server database.
    for entry in data['entries']:
        new_fooditem = Fooditem.query.filter(Fooditem.food_name == entry['food_name']).one_or_none()
        if new_fooditem:
            new_entry = DiaryEntryLine(diary_id=diary.id,
                                        fooditem_id=new_fooditem.id,
                                        quantity=entry['quantity'])
            diary.entryline.append(new_entry)
        else:
            new_fooditem = Fooditem(food_name=entry['food_name'],
                                    calorie=entry['calorie'],
                                    isBrand= 'TRUE' if entry['isBrand'] == 'TRUE' else 'FALSE',
                                    brand_item_id = entry.get('brand_item_id'),
                                    image=entry['image'])
            db.session.add(new_fooditem)
            db.session.commit()
            new_entry = DiaryEntryLine(diary_id=diary.id,
                                        fooditem_id=new_fooditem.id,
                                        quantity=entry['quantity'])
            diary.entryline.append(new_entry)
    db.session.commit()
    entries = diary.entryline
    serialized_entries = [entry.serialize() for entry in entries]
    return jsonify({**diary.serialize(), 'entries':serialized_entries, 'success':True})

