import os, requests, datetime
from flask import Flask, request, jsonify 
from flask_cors import CORS
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required, JWTManager, current_user
from sqlalchemy.exc import IntegrityError, DataError
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
# Setup the Flask-JWT-Extended extension
app.config["JWT_SECRET_KEY"] = "supersecretkey"
app.config["JWT_TOKEN_LOCATION"] = ["headers"]
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = datetime.timedelta(hours=24)
jwt = JWTManager(app)

connect_db(app)

@app.route("/")
def view_homepage():
    fooditems = Fooditem.query.all()
    serialized = [fooditem.serialize() for fooditem in fooditems]
    return jsonify(serialized)

@app.route("/signup", methods=["POST"])
def signup():
    try:
        new_user = User.signup(
            username=request.json.get("username"), 
            password=request.json.get("password"),
            email=request.json.get("email") )
        db.session.commit()
        access_token = create_access_token(identity=new_user)
        response = jsonify(msg="Signup successful",access_token=access_token)
        return response
    except IntegrityError:
        return jsonify(msg="Username already taken")


@app.route("/login", methods=["POST"])
def login():
    username = request.json.get("username")
    password = request.json.get("password")
    user = User.authenticate(username, password)
    if not user:
        return jsonify({"msg": "Bad username or password"}), 401

    access_token = create_access_token(identity=user)
    response = jsonify(msg="Login successful",access_token=access_token)
    return response

# Register a callback function that takes whatever object is passed in as the
# identity when creating JWTs and converts it to a JSON serializable format.
@jwt.user_identity_loader
def user_identity_lookup(user):
    return user.id


# Register a callback function that loads a user from your database whenever
# a protected route is accessed. This should return any python object on a
# successful lookup, or None if the lookup failed for any reason (for example
# if the user has been deleted from the database).
@jwt.user_lookup_loader
def user_lookup_callback(_jwt_header, jwt_data):
    identity = jwt_data["sub"]
    return User.query.get_or_404(identity)


@app.route("/search", methods=['GET'])
def search():
    """Make an API call to NUTRITIONIX API to get results for search bar"""
    query = request.args.get("query")
    try:
        response = requests.get(SEARCH_URL,
                                headers=NUTRITIONIX_API_HEADERS, 
                                params={'query':query})
        return jsonify(response.json())
    except Exception as e:
        print(e)

@app.route("/nutrition/<category>", methods=['GET'])
def get_nutrition(category):
    """Make an API call to NUTRITIONIX API to get nutrition data for a specific fooditem"""
    if category == 'brand':
        try:
            id = request.args.get("nix_item_id")
            response = requests.get("https://trackapi.nutritionix.com/v2/search/item", 
                                    headers=NUTRITIONIX_API_HEADERS,
                                    params={'nix_item_id':id})
            return jsonify(response.json()["foods"][0])
        except Exception as e:
            print(e)
    elif category == 'common':
        try:
            query = request.args.get("food_name")
            response = requests.post("https://trackapi.nutritionix.com/v2/natural/nutrients",
                                    headers=NUTRITIONIX_API_HEADERS,
                                    data={"query":query})
            return jsonify(response.json()["foods"][0]) 
        except Exception as e:
            print(e)

@app.route("/diary", methods=['GET'])
@jwt_required()
def view_diaries():
    """ Returns a list of all the users diaries """
    user = User.query.get_or_404(current_user.id)
    diaries = Diary.query.filter(Diary.user_id == user.id).order_by(Diary.date.desc()).all()
    # Calculate nutrition totals for each particular diary to send back in the response
    serialized_diaries = [diary.serialize() for diary in diaries]
    return jsonify(serialized_diaries)

@app.route("/diary", methods=['POST'])
@jwt_required()
def create_diary():
    """ Creates a new diary for the given user and form data"""
    try:
        data = request.json
        print(data)
        new_diary = Diary(user_id=current_user.id,
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
                                            quantity=entry['quantity'],
                                            meal=entry['meal'])
                new_diary.entryline.append(new_entry)
            else:
                new_fooditem = Fooditem(food_name=entry['food_name'],
                                        calorie=entry['calorie'],
                                        protein=entry['protein'],
                                        fat=entry['fat'],
                                        carbs=entry['carbs'],
                                        isBrand= 'TRUE' if entry['isBrand'] == 'TRUE' else 'FALSE',
                                        brand_item_id = entry.get('brand_item_id'),
                                        image=entry['image'])
                db.session.add(new_fooditem)
                db.session.commit()
                new_entry = DiaryEntryLine(diary_id=new_diary.id,
                                            fooditem_id=new_fooditem.id,
                                            quantity=entry['quantity'],
                                            meal=entry['meal'])
                new_diary.entryline.append(new_entry)
        db.session.commit()
        entries = new_diary.entryline
        serialized_entries = [entry.serialize() for entry in entries]
        return jsonify({**new_diary.serialize(), 'entries':serialized_entries, 'success':True})
    except DataError:
        return jsonify(msg="Please enter a valid date")

@app.route("/diary/<int:diary_id>", methods=["GET"])
@jwt_required()
def view_diary(diary_id):
    """ Return data for a specific diary """
    diary = Diary.query.get_or_404(diary_id)
    # Users can only view their own diaries
    if diary.user.id == current_user.id:
        entries = diary.entryline
        serialized_entries = [entry.serialize() for entry in entries]
        return jsonify({**diary.serialize(),'entries':serialized_entries})
    else:
        return jsonify(msg="Not authorized"),401

@app.route("/diary/<int:diary_id>", methods=["PUT"])
@jwt_required()
def edit_diary(diary_id):
    """ Edits a specific diary """

    data= request.json
    diary = Diary.query.get_or_404(diary_id)
    # Users can only edit their own diaries
    if diary.user.id == current_user.id:
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
                                            quantity=entry['quantity'],
                                            meal=entry['meal'])
                diary.entryline.append(new_entry)
            else:
                new_fooditem = Fooditem(food_name=entry['food_name'],
                                        calorie=entry['calorie'],
                                        protein=entry['protein'],
                                        fat=entry['fat'],
                                        carbs=entry['carbs'],
                                        isBrand= 'TRUE' if entry['isBrand'] == 'TRUE' else 'FALSE',
                                        brand_item_id = entry.get('brand_item_id'),
                                        image=entry['image'])
                db.session.add(new_fooditem)
                db.session.commit()
                new_entry = DiaryEntryLine(diary_id=diary.id,
                                            fooditem_id=new_fooditem.id,
                                            quantity=entry['quantity'],
                                            meal=entry['meal'])
                diary.entryline.append(new_entry)
        db.session.commit()
        entries = diary.entryline
        serialized_entries = [entry.serialize() for entry in entries]
        return jsonify({**diary.serialize(), 'entries':serialized_entries, 'success':True})
    else:
        return jsonify(msg="Not authorized"),401

@app.route("/diary/<int:diary_id>", methods=["DELETE"])
@jwt_required()
def delete_diary(diary_id):
    """ Removes a single diary from the database """

    # Query for a diary using its id and remove it from the database.
    diary = Diary.query.get_or_404(diary_id)
    user = diary.user
    # Users can only delete their own diaries. 
    if user.id == current_user.id:
        db.session.delete(diary)
        db.session.commit()
        # Get the new list of diaries for
        diaries = Diary.query.filter(Diary.user_id == user.id).order_by(Diary.date.desc()).all()
        serialized_diaries = [diary.serialize() for diary in diaries]
        return jsonify(serialized_diaries)
    else:
        return jsonify(msg="Not authorized"),401

@app.route("/meal", methods=['GET'])
@jwt_required()
def view_meals():
    """ Returns a list of all mealplans """
    meals = Mealplan.query.all()
    serialized_meals = [meal.serialize() for meal in meals]
    return jsonify(serialized_meals)

@app.route("/meal", methods=['POST'])
@jwt_required()
def create_meal():
    """ Creates a new meal for the given user and form data"""
    # try:
    data = request.json
    print(data)
    new_meal = Mealplan(user_id=current_user.id,
                    title=data['title'],
                    header_image=data['header_image'],)
    db.session.add(new_meal)
    db.session.commit()

    # Finds and adds any tags
    tags = data['tags']
    for tag in tags:
        new_tag = Tag.query.get(tag)
        new_meal.tags.append(new_tag)
    db.session.commit()

    # Append a new entryline to the new meal. A new fooditem is created if it does not already exist on the server database.
    for entry in data['entries']:
        new_fooditem = Fooditem.query.filter(Fooditem.food_name == entry['food_name']).one_or_none()
        if new_fooditem:
            new_entry = MealplanEntryLine(mealplan_id=new_meal.id,
                                        fooditem_id=new_fooditem.id,
                                        quantity=entry['quantity'],
                                        meal=entry['meal'])
            new_meal.entryline.append(new_entry)
        else:
            new_fooditem = Fooditem(food_name=entry['food_name'],
                                    calorie=entry['calorie'],
                                    protein=entry['protein'],
                                    fat=entry['fat'],
                                    carbs=entry['carbs'],
                                    isBrand= 'TRUE' if entry['isBrand'] == 'TRUE' else 'FALSE',
                                    brand_item_id = entry.get('brand_item_id'),
                                    image=entry['image'])
            db.session.add(new_fooditem)
            db.session.commit()
            new_entry = MealplanEntryLine(mealplan_id=new_meal.id,
                                        fooditem_id=new_fooditem.id,
                                        quantity=entry['quantity'],
                                        meal=entry['meal'])
            new_meal.entryline.append(new_entry)
    db.session.commit()
    entries = new_meal.entryline
    serialized_entries = [entry.serialize() for entry in entries]
    return jsonify({**new_meal.serialize(), 'entries':serialized_entries, 'success':True})
    # except Exception as e:
    #     print(str(e))
    #     return jsonify(msg="Error occurred")

@app.route("/meal/<int:meal_id>", methods=["GET"])
@jwt_required()
def view_meal(meal_id):
    """ Return data for a specific mealplan """
    meal = Mealplan.query.get_or_404(meal_id)
    entries = meal.entryline
    serialized_entries = [entry.serialize() for entry in entries]
    return jsonify({**meal.serialize(),'entries':serialized_entries})

@app.route("/meal/<int:meal_id>", methods=["PUT"])
@jwt_required()
def edit_meal(meal_id):
    """ Edits a specific meal """

    data= request.json
    meal = Mealplan.query.get_or_404(meal_id)
    # Users can only edit their own mealplans
    if meal.user.id == current_user.id:
        # Delete all current entries and tag associations and create new entries and tag associations passed in from the frontend
        for entry in meal.entryline:
            db.session.delete(entry)
        tags = MealplanTag.query.filter(MealplanTag.mealplan_id == meal.id).all()
        for tag in tags:
            db.session.delete(tag)
        db.session.commit()

        # Finds and adds any tags
        tags = data['tags']
        for tag in tags:
            new_tag = Tag.query.get(tag)
            meal.tags.append(new_tag)
        import pdb
        
        # Append a new entryline to the new diary. A new fooditem is created if it does not already exist on the server database.
        for entry in data['entries']:
            new_fooditem = Fooditem.query.filter(Fooditem.food_name == entry['food_name']).one_or_none()
            if new_fooditem:
                new_entry = MealplanEntryLine(mealplan_id=meal.id,
                                            fooditem_id=new_fooditem.id,
                                            quantity=entry['quantity'],
                                            meal=entry['meal'])
                meal.entryline.append(new_entry)
            else:
                new_fooditem = Fooditem(food_name=entry['food_name'],
                                        calorie=entry['calorie'],
                                        protein=entry['protein'],
                                        fat=entry['fat'],
                                        carbs=entry['carbs'],
                                        isBrand= 'TRUE' if entry['isBrand'] == 'TRUE' else 'FALSE',
                                        brand_item_id = entry.get('brand_item_id'),
                                        image=entry['image'])
                db.session.add(new_fooditem)
                db.session.commit()
                new_entry = MealplanEntryLine(mealplan_id=meal.id,
                                            fooditem_id=new_fooditem.id,
                                            quantity=entry['quantity'],
                                            meal=entry['meal'])
                meal.entryline.append(new_entry)
        db.session.commit()
        entries =  meal.entryline
        serialized_entries = [entry.serialize() for entry in entries]
        return jsonify({**meal.serialize(), 'entries':serialized_entries, 'success':True})
    else:
        return jsonify(msg="Not authorized"),401

@app.route("/meal/<int:meal_id>", methods=["DELETE"])
@jwt_required()
def delete_meal(meal_id):
    """ Removes a single mealplan from the database """

    # Query for a mealplan using its id and remove it from the database.
    meal = Mealplan.query.get_or_404(meal_id)
    user = meal.user
    # Users can only delete their own mealplans. 
    if user.id == current_user.id:
        db.session.delete(meal)
        db.session.commit()
        # Get the new list of diaries for
        meals = Mealplan.query.all()
        serialized_meals = [meal.serialize() for meal in meals]
        return jsonify(serialized_meals)
    else:
        return jsonify(msg="Not authorized"),401



