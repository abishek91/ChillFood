from django.db import models
# from django.contrib.auth.models import User
from django.utils.timezone import datetime, now
from django.core import serializers
from django.contrib.postgres.fields import ArrayField
from django.utils.dateformat import DateFormat
from django.utils.formats import get_format
from django.db.models import Avg
from .login.models import User
from datetime import date, datetime


CATEGORIES = (
    ('Veg', 'Veg'),
    ('Vegan', 'Vegan'),
    ('Non-veg', 'Non-veg')
)

class Category(models.Model):
    name = models.CharField(max_length = 200, unique=True, choices=CATEGORIES)
    def to_json(self):
        return {"id": self.id,
                "text": self.name}
    
class Equipment(models.Model):
    name = models.CharField(max_length = 200, unique=True)
    def to_json(self):
        return {"id": self.id,
                "text": self.name}
    
class Cuisine(models.Model):
    name = models.CharField(max_length = 200, unique=True)
    def to_json(self):
        return {"id": self.id,
                "text": self.name}
    
class Recipe(models.Model):
    pic = models.ImageField(upload_to='recipes', blank=True)
    remote_pic = models.CharField(max_length = 2000, blank=True)
    title = models.CharField(max_length = 200, unique=True)
    cook = models.ForeignKey(User, on_delete=models.CASCADE, blank=True, null=True)
    time = models.IntegerField()
    calories = models.IntegerField(blank=True, null=True)
    video_link = models.CharField(max_length = 200, blank = True)
    date_time = models.DateTimeField(auto_now_add=True)
    views = models.IntegerField(default=0, blank=True)
    category_set = models.ManyToManyField(Category,related_name='recipes')
    equipment_set = models.ManyToManyField(Equipment,related_name='recipes')
    cuisine_set = models.ManyToManyField(Cuisine,related_name='recipes')
    
    def to_json(self):
        result = {
          "id": self.id,
          "title": self.title,
          "cook": self.cook.to_json(),
          "time": self.time,
          "video_link": self.video_link,
          "date_time": self.date_time,
          "views": self.views,
          "calories": self.calories,
          "remote_pic":self.remote_pic,
          "categories": list(map(lambda x: x.to_json(),self.category_set.all())),
          "equipments": list(map(lambda x: x.to_json(),self.equipment_set.all())),
        }

        if (hasattr(self,"tastiness")):
          result['tastiness'] = self.tastiness

        if (hasattr(self,"difficulty")):
          result['difficulty'] = self.difficulty
        
        if (hasattr(self,"found_ingredients")): 
          result['found_ingredients'] = self.found_ingredients
        
        if (hasattr(self,"missing_ingredients")): 
          result['missing_ingredients'] = self.missing_ingredients
        
        if (hasattr(self,"missing_ingredients") and hasattr(self,"found_ingredients")): 
          if (self.missing_ingredients + self.found_ingredients) != 0:
            result['completeness'] = self.found_ingredients/(self.missing_ingredients + self.found_ingredients)
          else:
            result['completeness'] = 0
          
        return result

    def to_json_full(self, user):
        result = {
          "id": self.id,
          "title": self.title,
          "cook": self.cook.to_json(),
          "time": self.time,
          "video_link": self.video_link,
          "date_time": DateFormat(self.date_time).format(get_format('DATETIME_FORMAT')),
          "views": self.views,
          "categories": serializers.serialize('json',self.category_set.all()),
          "equipment": serializers.serialize('json',self.equipment_set.all()),
          "ingredients": serializers.serialize('json',self.ingredients.all()),
          "steps": serializers.serialize('json',self.steps.order_by('step_number')),
          "difficulty": self.rating_set.all().aggregate(Avg('difficulty')),
          "tastiness": self.rating_set.all().aggregate(Avg('tastiness'))
        }

        calories = self.nutrientvalue_set.filter(nutrient__name='Calories')
        if(calories):
          result["calories"] = str(calories[0].amount) +  ' ' + self.nutrientvalue_set.get(nutrient__name='Calories').unit


        comments = []

        for comment in self.comment_set.all().exclude(text='').order_by('-date_time'):
            comments.append(comment.to_json());

        result["comments"] = comments

        user_rating = {"tastiness" : 0, "difficulty": 0}
        for rating in self.rating_set.filter(user=user):
            user_rating = {"tastiness" : rating.tastiness, "difficulty": rating.difficulty}
        result["user_rating"] = user_rating;

        return result
    
class Ingredient(models.Model):
    name = models.CharField(max_length = 200, unique=True)
    def to_json(self):
        return {"id": self.id,
                "text": self.name}
    
class RecipeIngredient(models.Model):
    recipe = models.ForeignKey(Recipe, on_delete=models.CASCADE, related_name="ingredients")
    ingredient = models.ForeignKey(Ingredient, on_delete=models.CASCADE)
    quantity = models.CharField(max_length = 200, blank = True)
    display = models.CharField(max_length = 200, blank = True)

    class Meta:
      unique_together = ('recipe', 'ingredient',)

class Step(models.Model):
    recipe = models.ForeignKey(Recipe, on_delete=models.CASCADE, related_name="steps")
    step_number = models.IntegerField(blank = True)
    instruction = models.CharField(max_length = 2000)
    picture = models.ImageField(upload_to='steps', blank=True)

class Nutrient(models.Model):
    name = models.CharField(max_length = 200)

class NutrientValue(models.Model):
    recipe = models.ForeignKey(Recipe, on_delete=models.CASCADE)
    nutrient = models.ForeignKey(Nutrient, on_delete=models.CASCADE)
    amount = models.DecimalField(decimal_places=3, max_digits=8)
    unit = models.CharField(max_length = 200)
    percentOfDailyNeeds = models.DecimalField(decimal_places=3, max_digits=6)


class Comment(models.Model):
    recipe = models.ForeignKey(Recipe, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    text = models.CharField(max_length = 200, blank = True, null=True)
    
    date_time = models.DateTimeField(auto_now_add=True)

    def to_json(self):
        result = {
          "text": self.text,
          "user": self.user.to_json(),
          "date_time": DateFormat(self.date_time).format(get_format('DATETIME_FORMAT')) 
        }

        return result

class Rating(models.Model):
    recipe = models.ForeignKey(Recipe, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    tastiness = models.DecimalField(blank = True, decimal_places=1, max_digits=2, null=True)
    difficulty = models.DecimalField(blank = True, decimal_places=1, max_digits=2, null=True)

PREFERENCE_SORT_TYPE = (
    (1, 'Views'),
    (2, 'Tastiness'),
    (3, 'Calories'),
    (4, 'Tastiness'),
    (5, 'Time')
)

class Preferences(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True)
    sort_by = models.IntegerField(choices=PREFERENCE_SORT_TYPE, default = 1) 
    has_video = models.BooleanField(default = False)
    category = models.ManyToManyField(Category)
    equipment = models.ManyToManyField(Equipment)
    cuisine = models.ManyToManyField(Cuisine)
    ingredient = models.ManyToManyField(Ingredient)
    
    def to_json(self):
      return {
        "sort_by": self.sort_by,
        "has_video": int(self.has_video),
        "categories": list(map(lambda x: x.id, self.category.all())),
        "equipments": list(map(lambda x: x.to_json(), self.equipment.all())),
        "cuisines": list(map(lambda x: x.to_json(), self.cuisine.all())),
        "ingredients": list(map(lambda x: x.to_json(), self.ingredient.all())),
      }

LIST_TYPE = (
    (1, 'Category'),
    (2, 'Applicance'),
    (3, 'Cuisine'),
)

class List(models.Model):
    description = models.CharField(max_length = 200)
    type = models.IntegerField(choices=LIST_TYPE)

class Notification(models.Model):
    text = models.CharField(max_length=200)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    link = models.CharField(max_length=200)
    read = models.BooleanField(default = False)
    date_time = models.DateTimeField(auto_now_add=True)
    

class Party(models.Model):
    name = models.CharField(max_length=200)
    date = models.DateField(default=date.today)
    recipe = models.ForeignKey(Recipe, on_delete=models.CASCADE)
    host = models.ForeignKey(User, on_delete=models.CASCADE, related_name="parties")
    guests = models.ManyToManyField(User, through='Guest', related_name="my_invitations")

    def to_json(self):
      guests = Guest.objects.filter(party_id=self.id);

      return {
        "id": self.id,
        "name": self.name,
        "date": self.date.strftime("%B %d, %Y"),
        "host": self.host.to_json(),
        "guests": list(map(lambda x: x.to_json(), guests)),
      }

class Guest(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    party = models.ForeignKey(Party, on_delete=models.CASCADE)
    status = models.IntegerField(blank = True, default = 0)
    token = models.CharField(max_length=200)

    def to_json(self):
      return {
        "user": self.user.to_json(),
        "status": self.status,
      }