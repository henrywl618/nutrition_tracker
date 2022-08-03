""" SQLAlchemy models for Nutrition Tracker """

from flask_bcrypt import Bcrypt
from flask_sqlalchemy import SQLAlchemy

bcrypt = Bcrypt()
db = SQLAlchemy()

class User(db.Model):
    """User in the system"""
    __tablename__ = 'user'

    id = db.Column(
        db.Integer,
        primary_key=True,
    )

    email = db.Column(
        db.Text,
        nullable=False,
        unique=True,
    )

    username = db.Column(
        db.Text,
        nullable=False,
        unique=True,
    )

    profile_image_url = db.Column(
        db.Text,
        default="/static/images/default-pic.png",
    )

    password = db.Column(
        db.Text,
        nullable=False,
    )

    diaries = db.relationship('Diary', back_populates="user")
    mealplans = db.relationship('Mealplan', back_populates="user")

class Fooditem(db.Model):
    """An individual food item"""
    __tablename__="fooditem"

    id = db.Column(
        db.Integer,
        primary_key=True,
    )

    food_name = db.Column(
        db.Text,
        nullable=False
    )

    calorie = db.Column(
        db.Integer,
        nullable=False
    )

    image = db.Column(
        db.Text
    )

    brand_item_id = db.Column(
        db.String
    )

    isBrand = db.Column(
        db.Text,
        nullable=False,
        default='FALSE'
    )

    def serialize(self):
        return {
            'id':self.id,
            'food_name':self.food_name,
            'calorie':self.calorie,
            'image':self.image
        }

class Diary(db.Model):
    """An individual dialy food diary"""
    __tablename__="diary"
    
    id = db.Column(
        db.Integer,
        primary_key=True,
    )

    user_id = db.Column(
        db.Integer,
        db.ForeignKey('user.id', ondelete='CASCADE'),
        nullable=False
    )

    date = db.Column(
        db.Date,
        nullable=False
    )

    calorie_goal = db.Column(
        db.Integer,
        nullable=False
    )

    user = db.relationship('User', back_populates='diaries')
    entryline = db.relationship('DiaryEntryLine', back_populates="diary")

class DiaryEntryLine(db.Model):
    """Mapping Diary to EntryLine and an EntryLine to Fooditem"""
    __tablename__="diary_entryline"

    diary_id = db.Column(
        db.Integer,
        db.ForeignKey('diary.id', ondelete="cascade"),
        primary_key=True
    )

    fooditem_id = db.Column(
        db.Integer,
        db.ForeignKey('fooditem.id', ondelete="cascade"),
        primary_key=True
    )

    quantity = db.Column(
        db.Integer,
        default=1
    )

    fooditem = db.relationship('Fooditem')
    diary = db.relationship('Diary', back_populates="entryline")

class Mealplan(db.Model):
    """An individual mealplan"""
    __tablename__="mealplan"
    
    id = db.Column(
        db.Integer,
        primary_key=True,
    )

    title = db.Column(
        db.Text,
        nullable=False,
    )

    user_id = db.Column(
        db.Integer,
        db.ForeignKey('user.id', ondelete='CASCADE'),
        nullable=False
    )

    header_image = db.Column(
        db.Text
    )


    user = db.relationship('User', back_populates='mealplans')
    entryline = db.relationship('MealplanEntryLine', back_populates="mealplan")
    tags = db.relationship('Tag',
                            secondary='mealplan_tag',
                            back_populates='mealplans')


class MealplanEntryLine(db.Model):
    """Mapping Mealplan to EntryLine and an EntryLine to Fooditem"""
    __tablename__="mealplan_entryline"

    mealplan_id = db.Column(
        db.Integer,
        db.ForeignKey('mealplan.id', ondelete="cascade"),
        primary_key=True
    )

    fooditem_id = db.Column(
        db.Integer,
        db.ForeignKey('fooditem.id', ondelete="cascade"),
        primary_key=True
    )

    quantity = db.Column(
        db.Integer,
        default=1
    )

    fooditem = db.relationship('Fooditem')
    mealplan = db.relationship('Mealplan', back_populates="entryline")

class Tag(db.Model):
    """Tags for dietary options"""

    __tablename__="tag"


    name = db.Column(
        db.Text,
        primary_key=True
    )

    mealplans = db.relationship('Mealplan',
                                secondary='mealplan_tag', 
                                back_populates="tags")

class MealplanTag(db.Model):
    """ Conection for Mealplan <---> Tag """

    __tablename__="mealplan_tag"

    mealplan_id = db.Column(
        db.Integer,
        db.ForeignKey('mealplan.id', ondelete='cascade'),
        primary_key=True,
    )

    tag_name = db.Column(
        db.Text,
        db.ForeignKey('tag.name', ondelete='cascade'),
        primary_key=True,
    )

    
def connect_db(app):
    """Connect this database to provided Flask app.
    This will be called in the Flask app.
    """

    db.app = app
    db.init_app(app)
