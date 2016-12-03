from django.test import TestCase, Client, RequestFactory
from .models import *
import math, json
from .views import *

class RecipesTest(TestCase):
                                # Seeds the test database with data we obtained
    fixtures = ['sample-data']  # from python manage.py dumpdata 

    def test_load_more(self): 
        page_size = 6
        recipes_cnt = Recipe.objects.all().count()

        client = Client()       

        #Initial request
        response = client.get('/api/recipes')
        self.assertEqual(response.status_code, 200)

        body = response.json()

        #Correct Schema
        self.assertIn('data',body)
        self.assertIn('next',body)
        
        #Correct Size
        self.assertTrue(len(body['data']) <= page_size) 
        
        #Next is not None
        self.assertTrue(body['next'])

        
        for i in range(math.ceil(recipes_cnt/page_size) - 2):
            next_response = client.get(body['next'])
            
            self.assertEqual(next_response.status_code, 200)            
            body = next_response.json()
    
            self.assertIn('data',body)
            self.assertIn('next',body)
            
            self.assertTrue(len(body['data']) == page_size) 

            self.assertTrue(body['next'])

            

        next_response = client.get(body['next'])            
        self.assertEqual(next_response.status_code, 200)            
        body = next_response.json()

        self.assertIn('data',body)
        self.assertIn('next',body)
        
        self.assertTrue(len(body['data']) <= page_size) 
        self.assertFalse(body['next'])

    def test_query_params(self): 
        page_size = 6
        recipes_cnt = Recipe.objects.all().count()

        client = Client()       

        #Initial request
        response = client.get('/api/recipes?wrongparameters')
        self.assertEqual(response.status_code, 200)

        #Invalid Values
        response = client.get('/api/recipes?sort_by=200')
        self.assertEqual(response.status_code, 406)

        response = client.get('/api/recipes?sort_by=0')
        self.assertEqual(response.status_code, 406)

        response = client.get('/api/recipes?sort_by=-1')
        self.assertEqual(response.status_code, 406)

        response = client.get('/api/recipes?cuisine=a')
        self.assertEqual(response.status_code, 406)

        response = client.get('/api/recipes?location_lat=as')
        self.assertEqual(response.status_code, 406)

        #Empty Respnses
        response = client.get('/api/recipes?search=noexiststhisinthedb')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json()['data']), 0)

        #No Empty Responses
        response = client.get('/api/recipes?search=a')
        self.assertEqual(response.status_code, 200)
        self.assertNotEqual(len(response.json()['data']), 0)

        response = client.get('/api/recipes?searcha=a')
        self.assertEqual(response.status_code, 200)
        self.assertNotEqual(len(response.json()['data']), 0)

        response = client.get('/api/recipes?category=1&category=2&category=3')
        self.assertEqual(response.status_code, 200)
        
class RecipesQueryTest(TestCase):
    
    fixtures = ['query']

    def test_single_word(self): 
        
        client = Client()       

        response = client.get('/api/recipes?search=Something')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json()['data']), 1)

        response = client.get('/api/recipes?search=somEthing')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json()['data']), 1)

        response = client.get('/api/recipes?search=omEth')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json()['data']), 1)

        response = client.get('/api/recipes?search=Else Something')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json()['data']), 1)

        response = client.get('/api/recipes?search=SomethingElse')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json()['data']), 0)

        response = client.get('/api/recipes?search=no related')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json()['data']), 0)
        
    def test_multiple_words(self): 
        
        client = Client()       

        response = client.get('/api/recipes?search=frito')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json()['data']), 1)

        response = client.get('/api/recipes?search=veGetable')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json()['data']), 1)

        response = client.get('/api/recipes?search=This is not right Vegetable')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json()['data']), 1)

        response = client.get('/api/recipes?search=This migh fri be right')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json()['data']), 1)

        response = client.get('/api/recipes?search=Frito Make-Ahead Vegetable Medley')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json()['data']), 1)
        
        response = client.get('/api/recipes?search=This is not right for sure')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json()['data']), 0)

    def test_category(self): 
        
        client = Client()       

        response = client.get('/api/recipes?category=1')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json()['data']), 2)

        response = client.get('/api/recipes?category=2')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json()['data']), 3)

        response = client.get('/api/recipes?category=3')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json()['data']), 0)

        response = client.get('/api/recipes?category=3&category=1')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json()['data']), 2)

        response = client.get('/api/recipes?category=3&category=2&category=1')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json()['data']), 3)
        
        response = client.get('/api/recipes?category=4')
        self.assertEqual(response.status_code, 406)

    def test_cuisine(self): 
        
        client = Client()       

        response = client.get('/api/recipes?cuisine=1')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json()['data']), 0)

        response = client.get('/api/recipes?cuisine=2')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json()['data']), 0)

        response = client.get('/api/recipes?cuisine=3')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json()['data']), 0)

        response = client.get('/api/recipes?cuisine=3&cuisine=1')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json()['data']), 0)

        response = client.get('/api/recipes?cuisine=3&cuisine=2&cuisine=1')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json()['data']), 0)
        
        response = client.get('/api/recipes?cuisine=400')
        self.assertEqual(response.status_code, 406)

        
    def test_equipment(self): 
        
        client = Client()       

        response = client.get('/api/recipes?equipment=1')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json()['data']), 1)

        response = client.get('/api/recipes?equipment=2')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json()['data']), 0)

        response = client.get('/api/recipes?equipment=3')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json()['data']), 0)

        response = client.get('/api/recipes?equipment=3&equipment=1')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json()['data']), 1)

        response = client.get('/api/recipes?equipment=3&equipment=2&equipment=1')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json()['data']), 1)
        
        response = client.get('/api/recipes?equipment=400')
        self.assertEqual(response.status_code, 406)

    def test_combinations(self): 
        
        client = Client()       

        response = client.get('/api/recipes?equipment=1&category=1')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json()['data']), 1)

        response = client.get('/api/recipes?equipment=1&category=3')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json()['data']), 0)

        response = client.get('/api/recipes?equipment=1&category=3&search=rito')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json()['data']), 0)

        response = client.get('/api/recipes?equipment=1&category=1&search=rito')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json()['data']), 1)

        response = client.get('/api/recipes?category=1&search=rito')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json()['data']), 1)
        
        response = client.get('/api/recipes?equipment=100&category=1&search=rito')
        self.assertEqual(response.status_code, 406)

    def test_has_video(self): 
        
        client = Client()       

        response = client.get('/api/recipes?has_video=true')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json()['data']), 1)

        response = client.get('/api/recipes?has_video=false')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json()['data']), 3)

    def test_ingredient(self): 
        
        client = Client()       

        response = client.get('/api/recipes?ingredient=1')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json()['data']), 1)

        response = client.get('/api/recipes?ingredient=16&ingredient=18')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json()['data']), 2)

        response = client.get('/api/recipes?ingredient=1&ingredient=16&ingredient=18')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json()['data']), 3)

    def test_missing_ingredients(self):         
        client = Client()       

        response = client.get('/api/recipes?ingredient=1')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json()['data']), 1)
        self.assertEqual(response.json()['data'][0]['missing_ingredients'], 3)

        response = client.get('/api/recipes?ingredient=1&ingredient=3')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json()['data']), 1)
        self.assertEqual(response.json()['data'][0]['missing_ingredients'], 2)

        response = client.get('/api/recipes?ingredient=1&ingredient=3&ingredient=3')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json()['data']), 1)
        self.assertEqual(response.json()['data'][0]['missing_ingredients'], 2)

        response = client.get('/api/recipes?ingredient=1&ingredient=2&ingredient=3&ingredient=4')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json()['data']), 1)
        self.assertEqual(response.json()['data'][0]['missing_ingredients'], 0)

        response = client.get('/api/recipes?ingredient=1&ingredient=16&ingredient=18')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json()['data']), 3)
        self.assertEqual(response.json()['data'][0]['missing_ingredients'], 3)
        self.assertEqual(response.json()['data'][1]['missing_ingredients'], 8)
        self.assertEqual(response.json()['data'][2]['missing_ingredients'], 14)
        
    
    def test_user_id(self):         
        client = Client()       

        response = client.get('/api/recipes?user_id=2')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json()['data']), 3)

        response = client.get('/api/recipes?user_id=1')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json()['data']), 0)

    def test_sort_id(self):         
        client = Client()       

        response = client.get('/api/recipes?sort_by=5')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json()['data']), 3)
        self.assertEqual(response.json()['data'][0]['id'], 1)
        self.assertEqual(response.json()['data'][1]['id'], 2)
        self.assertEqual(response.json()['data'][2]['id'], 3)

        response = client.get('/api/recipes?sort_by=5&search=a')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json()['data']), 2)
        self.assertEqual(response.json()['data'][0]['id'], 2)
        self.assertEqual(response.json()['data'][1]['id'], 3)

class NewRecipeTest(TestCase):
    
    fixtures = ['query']

    def test_single_word(self): 
        
        client = Client()       

        response = client.post('/api/recipe/create',{})
        self.assertEqual(response.status_code, 302)
        
        response = client.post('/login',{})
        client.post('/login/', {'username': 'delacruzpaulino@gmail.com', 'password': 'noimporta'})
        self.assertEqual(response.status_code, 200)

        # response = client.post('/api/recipe/create',"{}")
        # self.assertEqual(response.status_code, 406)
        response = client.post('/api/recipe/create',
                                json.dumps({}),
                                content_type="application/json")
        self.assertEqual(response.status_code, 406)
        


        response = client.post('/api/recipe/create',
                                json.dumps({'title':'One Recipe'}),
                                content_type="application/json", safe=False)
        self.assertEqual(response.status_code, 406)
        

        # response = client.post('/api/recipe/create',
        #                         json.dumps({'title':'One Recipe', 'time':2}),
        #                         safe=False, content_type="application/json")
        # self.assertEqual(response.status_code, 406)
        # 

        # self.assertEqual(len(response.json()['data']), 1)

        # response = client.get('/api/recipes?search=somEthing')
        # self.assertEqual(response.status_code, 200)
        # self.assertEqual(len(response.json()['data']), 1)

        # response = client.get('/api/recipes?search=omEth')
        # self.assertEqual(response.status_code, 200)
        # self.assertEqual(len(response.json()['data']), 1)

class RecipeDetailTest(TestCase):
    
    fixtures = ['query']

    def test_recipe_details_without_login(self):
        user = User(name='test_user', username='test@gmail.com')
        user.save()
        recipe = Recipe.objects.get(id=1)
        r = recipe.to_json_full(user)   
        self.assertEqual(recipe.id, 1)

class NotificationsTest(TestCase):

    def setUp(self):
        self.factory = RequestFactory()
    fixtures = ['query']

    def test_notifications(self):
        user = User(name='test_user', username='test@gmail.com')
        user.save()
        notification_text = 'test notification'
        notification = Notification(user=user, text=notification_text,read=False,link=None)
        notification.save()
        n = Notification.objects.get(user=user)
        self.assertEqual(n.text, notification_text)
        self.assertEqual(n.read, False)

        request = self.factory.get('/notifications')
        request.user = user;
        readNotifications(request)
        
        n = Notification.objects.get(user=user)
        self.assertEqual(n.text, notification_text)
        self.assertEqual(n.read, True)
