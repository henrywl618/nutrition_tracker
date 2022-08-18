"""App Route tests."""

# run these tests like:
#
#    FLASK_ENV=production python -m unittest test_message_views.py


import os, datetime, json
from unittest import TestCase

from models import db, connect_db, User, Fooditem, Diary, DiaryEntryLine, Mealplan, MealplanEntryLine, Tag, MealplanTag

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

class UserRouteTestCase(TestCase):
    """ Test routes for users """

    def setUp(self):
        """Create test client, add sample data."""

        User.query.delete()
        Diary.query.delete()
        Mealplan.query.delete()
        Fooditem.query.delete()
        Tag.query.delete()

        self.client = app.test_client()

        self.testuser = User.signup(username="testuser",
                                    email="test@test.com",
                                    password="testuser")
        
        
        db.session.commit()

        self.diary = Diary(
                            date=datetime.date(2022,8,18),
                            user_id=self.testuser.id,
                            calorie_goal=2000
                            )
        self.mealplan = Mealplan(
                                user_id=self.testuser.id,
                                title="Test Mealplan"
                                )
        self.fooditem = Fooditem(
                                food_name='Test Food',
                                calorie=100,
                                protein=5,
                                fat=3,
                                carbs=10,
                                serving_size='cup',
                                isBrand= 'FALSE',
                                brand_item_id = None,
                                image=""
                                )

        db.session.add_all([self.fooditem,self.mealplan,self.diary])
        db.session.commit()

        # Create a new entry line and connect to the diary.
        self.entryline1 = DiaryEntryLine(diary_id=self.diary.id,
                                    fooditem_id=self.fooditem.id,
                                    quantity=2,
                                    meal='b')
        self.entryline2 = MealplanEntryLine(mealplan_id=self.mealplan.id,
                                    fooditem_id=self.fooditem.id,
                                    quantity=2,
                                    meal='b')
        
        self.diary.entryline.append(self.entryline1)
        self.mealplan.entryline.append(self.entryline2)
        db.session.commit()

    def test_signup_route(self):
        """ Are we getting the proper response from the signup route?"""

        with self.client as c:

            response = c.post('/signup',
                              json={'username':'test1',
                                      'password':'test1',
                                      'email':'test1@gmail.com'})
            data = json.loads(response.get_data(as_text=True))
            # Test for a successful response
            self.assertEqual(response.status_code, 200)
            self.assertEqual(data['msg'], 'Signup successful')
            self.assertEqual(data['user'], 'test1')
            # Should not create an account if the username already exists.
            response2 = c.post('/signup',
                              json={'username':'test1',
                                      'password':'test1',
                                      'email':'test1@gmail.com'})
            data2 = json.loads(response2.get_data(as_text=True))
            self.assertEqual(response2.status_code,200)
            self.assertEqual(data2['msg'], 'Username already taken')

    def test_login_route(self):
        """ Are we getting the proper response from the login route?"""

        with self.client as c:

            response = c.post('/login',
                              json={'username':'testuser',
                                      'password':'testuser'})
            data = json.loads(response.get_data(as_text=True))
            # Test for a successful response
            self.assertEqual(response.status_code, 200)
            self.assertEqual(data['msg'], 'Login successful')
            self.assertEqual(data['user'], 'testuser')
            # Should not login if the username or password is incorrect.
            response2 = c.post('/login',
                              json={'username':'testuser',
                                      'password':'badpassword'})
            data2 = json.loads(response2.get_data(as_text=True))
            self.assertEqual(response2.status_code,401)
            self.assertEqual(data2['msg'], 'Bad username or password')

            response3 = c.post('/login',
                              json={'username':'baduser',
                                      'password':'testuser'})
            data3 = json.loads(response3.get_data(as_text=True))
            self.assertEqual(response3.status_code,401)
            self.assertEqual(data3['msg'], 'Bad username or password')
    
    def test_diary_route(self):
        """ Are we getting the proper response from the dairy route?"""

        with self.client as c:

            response = c.post('/login',
                              json={'username':'testuser',
                                      'password':'testuser'})
            data = json.loads(response.get_data(as_text=True))
            jwt = data['access_token']

            resp = c.get('/diary',
                        headers={'Authorization': f'Bearer {jwt}'})
            data2 = json.loads(resp.get_data(as_text=True))
            
            diary = Diary.query.one_or_none()
            # Test for a successful response
            self.assertEqual(resp.status_code, 200)
            self.assertEqual(diary.id, data2[0]['id'])
            
    def test_mealplan_route(self):
        """ Are we getting the proper response from the mealplan route?"""

        with self.client as c:

            response = c.post('/login',
                              json={'username':'testuser',
                                      'password':'testuser'})
            data = json.loads(response.get_data(as_text=True))
            jwt = data['access_token']

            resp = c.get('/meal',
                        headers={'Authorization': f'Bearer {jwt}'})
            data2 = json.loads(resp.get_data(as_text=True))
            
            mealplan = Mealplan.query.one_or_none()
            # Test for a successful response
            self.assertEqual(resp.status_code, 200)
            self.assertEqual(mealplan.id, data2[0]['id'])





