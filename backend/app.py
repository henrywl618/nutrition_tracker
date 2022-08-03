import os
from flask import Flask, request
from models import db, connect_db, User, Fooditem, Diary, DiaryEntryLine, Mealplan, MealplanEntryLine, Tag, MealplanTag

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = (
    os.environ.get('DATABASE_URL', 'postgresql:///nutrition_tracker'))

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_ECHO'] = False
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', "it's a secret")

connect_db(app)
