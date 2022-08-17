"""Seed database with sample data from CSV Files."""

from csv import DictReader
from app import db
from models import User, Fooditem, Diary, DiaryEntryLine, Mealplan, MealplanEntryLine, Tag, MealplanTag


db.drop_all()
db.create_all()

with open('generator/user.csv') as user:
    db.session.bulk_insert_mappings(User, DictReader(user))

with open('generator/fooditem.csv') as fooditem:
    db.session.bulk_insert_mappings(Fooditem, DictReader(fooditem))

with open('generator/diary.csv') as diary:
    db.session.bulk_insert_mappings(Diary, DictReader(diary))

with open('generator/diary_entryline.csv') as diary_entryline:
    db.session.bulk_insert_mappings(DiaryEntryLine, DictReader(diary_entryline))

with open('generator/mealplan.csv') as mealplan:
    db.session.bulk_insert_mappings(Mealplan, DictReader(mealplan))

with open('generator/mealplan_entryline.csv') as mealplan_entryline:
    db.session.bulk_insert_mappings(MealplanEntryLine, DictReader(mealplan_entryline))

with open('generator/tag.csv') as tag:
    db.session.bulk_insert_mappings(Tag, DictReader(tag))

with open('generator/mealplan_tag.csv') as mealplan_tag:
    db.session.bulk_insert_mappings(MealplanTag, DictReader(mealplan_tag))

db.session.commit()