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

    def serialize(self):
        return {'id':self.id,
                'username':self.username,
                'password':self.password,
                'email':self.email,}

    @classmethod
    def authenticate(cls, username, password):
        """Find user with `username` and `password`.

        It searches for a user whose password hash matches this password
        and, if it finds such a user, returns that user object.

        If can't find matching user (or if password is wrong), returns False.
        """ 
        user = cls.query.filter_by(username=username).first()

        if user:
            is_auth = bcrypt.check_password_hash(user.password, password)
            if is_auth:
                return user

        return False
    
    @classmethod
    def signup(cls, username, password, email):
        """Sign up user.
        Hashes password and adds user to the system.
        """

        hashed_pwd = bcrypt.generate_password_hash(password).decode('UTF-8')

        user = User(
            username=username,
            password=hashed_pwd,
            email=email,
        )

        db.session.add(user)
        return user

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
    entryline = db.relationship('DiaryEntryLine', back_populates="diary", cascade="all, delete")

    def serialize(self):
        return{
            'id':self.id,
            'date':self.date,
            'calorie_goal':self.calorie_goal,
        }

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

    meal = db.Column(
        db.Text,
        default="b"
    )

    fooditem = db.relationship('Fooditem')
    diary = db.relationship('Diary', back_populates="entryline")

    def serialize(self):
        return {
            'id':self.fooditem.id,
            'food_name':self.fooditem.food_name,
            'calorie':self.fooditem.calorie,
            'image':self.fooditem.image,
            'quantity':self.quantity,
            'meal':self.meal,
        }

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
    entryline = db.relationship('MealplanEntryLine', back_populates="mealplan", cascade="all, delete")
    tags = db.relationship('Tag',
                            secondary='mealplan_tag',
                            back_populates='mealplans')
    
    def serialize(self):
        return{
            'id':self.id,
            'title':self.title,
            'header_image':self.header_image,
        }


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

    meal = db.Column(
        db.Text,
        default="b"
    )

    fooditem = db.relationship('Fooditem')
    mealplan = db.relationship('Mealplan', back_populates="entryline")

    def serialize(self):
        return {
            'id':self.fooditem.id,
            'food_name':self.fooditem.food_name,
            'calorie':self.fooditem.calorie,
            'image':self.fooditem.image,
            'quantity':self.quantity,
            'meal':self.meal,
        }


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
