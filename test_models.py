"""SQLAlchemy model tests."""

# run these tests like:
#
#    python -m unittest test_models.py


import os
import datetime
from unittest import TestCase

from models import db, User, Fooditem, Diary, DiaryEntryLine, Mealplan, MealplanEntryLine, Tag, MealplanTag

# BEFORE we import our app, let's set an environmental variable
# to use a different database for tests (we need to do this
# before we import our app, since that will have already
# connected to the database

os.environ['DATABASE_URL'] = "postgresql:///nutrition-test"


# Now we can import app

from app import app

# Create our tables (we do this here, so we only create the tables
# once for all tests --- in each test, we'll delete the data
# and create fresh new clean test data

db.create_all()

class UserModelTestCase(TestCase):
    """Test the User Model."""
    def setUp(self):
        """Create test client, add sample data."""

        User.query.delete()
        Diary.query.delete()
        Mealplan.query.delete()
        Fooditem.query.delete()
        Tag.query.delete()

        self.client = app.test_client()
    
    def test_user_model(self):
        """Does User model work?"""

        u = User(
            email="test@test.com",
            username="testuser",
            password="HASHED_PASSWORD"
        )

        u2 = User(
            email="test2@test.com",
            username="testuser2",
            password="HASHED_PASSWORD2"
        )


        db.session.add_all([u,u2])
        db.session.commit()

        # 2 users should be added
        users = User.query.all()
        self.assertEqual(len(users),2)

        # Users should have no diaries or mealplans
        self.assertEqual(len(u.diaries),0)
        self.assertEqual(len(u.mealplans),0)
        self.assertEqual(len(u2.diaries),0)
        self.assertEqual(len(u2.mealplans),0)
        
    def test_user_signup(self):
        """Does User.signup work?"""

        #Tests User.signup method
        u = User.signup(username="testy", password="password", email="testy@gmail.com")
        db.session.commit()
        self.assertEqual(u.serialize(), User.query.get(u.id).serialize())

        #Test failure by passing in non valid fields
        self.assertRaises(ValueError, User.signup,username="testy2", password="", email="testy@gmail.com")

    
    def test_user_auth(self):
        """Does User.authenticate work?"""
        #Test user authentication
        u = User.signup(username="testy", password="password", email="testy@gmail.com")

        #Should return the user if the correct username and password is passed in
        user = User.authenticate("testy","password")
        self.assertEqual(user, u)

        #Should return false if the incorrect username or password is passed in
        user = User.authenticate("testy","password123")
        self.assertEqual(user, False)
        user = User.authenticate("badusername","password")
        self.assertEqual(user, False)
    
class DiaryModelTestCase(TestCase):
    """Test the Diary Model."""
    def setUp(self):
        """Create test client, add sample data."""

        User.query.delete()
        Diary.query.delete()
        Mealplan.query.delete()
        Fooditem.query.delete()
        Tag.query.delete()

        u = User(
            email="test@test.com",
            username="testuser",
            password="HASHED_PASSWORD"
        )
        db.session.add(u)
        db.session.commit()

        self.client = app.test_client()
    
    def test_diary_model(self):
        """ Does the Diary model work? """
        
        user = User.query.one_or_none()
        diary = Diary(
                user_id=user.id,
                date = datetime.date(2022, 8, 18),
                calorie_goal = 2000
        )

        db.session.add(diary)
        db.session.commit()

        # There should only be 1 diary
        diaries = Diary.query.all()
        self.assertEqual(len(diaries),1)
        self.assertEqual(diaries[0].user_id,user.id)
        self.assertEqual(diaries[0].date,datetime.date(2022,8,18))
        self.assertEqual(diaries[0].calorie_goal,2000)

        # Models should have the correct relationships set up
        self.assertEqual(diaries[0], user.diaries[0])
        self.assertEqual(diaries[0].user, user)

class MealplanModelTestCase(TestCase):
    """Test the Mealplan Model."""
    def setUp(self):
        """Create test client, add sample data."""

        User.query.delete()
        Diary.query.delete()
        Mealplan.query.delete()
        Fooditem.query.delete()
        Tag.query.delete()

        u = User(
            email="test@test.com",
            username="testuser",
            password="HASHED_PASSWORD"
        )
        db.session.add(u)
        db.session.commit()

        self.client = app.test_client()
    
    def test_mealplan_model(self):
        """ Does the Mealplan model work? """
        
        user = User.query.one_or_none()
        mealplan = Mealplan(
                user_id=user.id,
                title = "Test Mealplan"
        )

        db.session.add(mealplan)
        db.session.commit()

        # There should only be 1 mealplan
        mealplans = Mealplan.query.all()
        self.assertEqual(len(mealplans),1)
        self.assertEqual(mealplans[0].user_id,user.id)
        self.assertEqual(mealplans[0].title, "Test Mealplan")

        # Models should have the correct relationships set up
        self.assertEqual(mealplans[0], user.mealplans[0])
        self.assertEqual(mealplans[0].user, user)

class FoodItemModelTestCase(TestCase):
    """Test the Fooditem Model."""
    def setUp(self):
        """Create test client, add sample data."""

        User.query.delete()
        Diary.query.delete()
        Mealplan.query.delete()
        Fooditem.query.delete()
        Tag.query.delete()

        u = User(
            email="test@test.com",
            username="testuser",
            password="HASHED_PASSWORD"
        )

        db.session.add(u)
        db.session.commit()

        diary = Diary(
            user_id=u.id,
            date = datetime.date(2022, 8, 18),
            calorie_goal = 2000
        )

        db.session.add(diary)
        db.session.commit()

        self.client = app.test_client()
    
    def test_fooditem_model(self):
        """ Does the Mealplan model work? """
        
        user = User.query.one_or_none()
        fooditem = Fooditem(
                food_name='Test Food',
                calorie=100,
                protein=5,
                fat=3,
                carbs=10,
                serving_size='cup',
                isBrand= 'FALSE',
                brand_item_id = None,
                image="")

        db.session.add(fooditem)
        db.session.commit()

        item = Fooditem.query.all()

        self.assertEqual(len(item),1)
    
    def test_fooditem_relationship(self):
        """ Does the Fooditem relationships work? """
        
        user = User.query.one_or_none()
        diary = Diary.query.one_or_none()
        # Create a new fooditem
        fooditem = Fooditem(
                food_name='Test Food',
                calorie=100,
                protein=5,
                fat=3,
                carbs=10,
                serving_size='cup',
                isBrand= 'FALSE',
                brand_item_id = None,
                image="")

        db.session.add(fooditem)
        db.session.commit()

        # Create a new entry line and connect to the diary.
        entryline = DiaryEntryLine(diary_id=diary.id,
                                    fooditem_id=fooditem.id,
                                    quantity=2,
                                    meal='b')
        
        diary.entryline.append(entryline)
        db.session.commit()

        # Test that the relationship is working.
        self.assertEqual(entryline.fooditem, fooditem)
        self.assertEqual(diary.entryline[0].fooditem, fooditem)

