from django.db import models
# from django.contrib.auth.models import User
from django.utils.timezone import datetime, now
from django.core import serializers
from django.contrib.postgres.fields import ArrayField

from .login.models import User


class Recipe(models.Model):
    pic = models.ImageField(upload_to='recipes', blank=True)
    title = models.CharField(max_length = 200)
    cook = models.ForeignKey(User, on_delete=models.CASCADE, blank=True, null=True)
    time = models.IntegerField()
    calories = models.IntegerField(blank=True, null=True)
    video_link = models.CharField(max_length = 200, blank = True)
    date_time = models.DateTimeField(auto_now_add=True)
    views = models.IntegerField(default=0, blank=True)

    def to_json(self):
        result = {
          "id": self.id,
          "title": self.title,
          "cook": self.cook.to_json(),
          "time": self.time,
          "video_link": self.video_link,
          "date_time": self.date_time,
          "views": self.views,
        }

        if  hasattr(self, 'rating'):
            result["rating"] = self.rating 
        else:
            result["rating"] = 0

        return result

    def to_json_full(self):
        result = {
          "id": self.id,
          "title": self.title,
          "cook": self.cook.to_json(),
          "time": self.time,
          "video_link": self.video_link,
          "date_time": self.date_time,
          "views": self.views,
          "categories": serializers.serialize('json',self.category_set.all()),
          "equipment": serializers.serialize('json',self.equipment_set.all()),
          "ingredients": serializers.serialize('json',self.category_set.all()),
          "calories": str(self.nutrientvalue_set.get(nutrient__name='Calories').amount) + ' ' + self.nutrientvalue_set.get(nutrient__name='Calories').unit,
          "ingredients": serializers.serialize('json',self.category_set.all()),
          "steps": serializers.serialize('json',self.step_set.order_by('step_number'))
        }

        if  hasattr(self, 'rating'):
            result["rating"] = self.rating 
        else:
            result["rating"] = 0

        return result

CATEGORIES = (
    ('Veg', 'Veg'),
    ('Vegan', 'Vegan'),
    ('Non-veg', 'Non-veg')
)

class Category(models.Model):
    name = models.CharField(max_length = 200, choices=CATEGORIES)
    recipes = models.ManyToManyField(Recipe)

class Equipment(models.Model):
    name = models.CharField(max_length = 200)
    recipes = models.ManyToManyField(Recipe)

class Cuisine(models.Model):
    name = models.CharField(max_length = 200)
    recipes = models.ManyToManyField(Recipe)

    
class Ingredient(models.Model):
    name = models.CharField(max_length = 200)

class RecipeIngredient(models.Model):
    recipe = models.ForeignKey(Recipe, on_delete=models.CASCADE)
    ingredient = models.ForeignKey(Ingredient, on_delete=models.CASCADE)
    quantity = models.CharField(max_length = 200, blank = True)
    price = models.IntegerField(blank = True, null = True)
    display = models.CharField(max_length = 200, blank = True)



class Step(models.Model):
    recipe = models.ForeignKey(Recipe, on_delete=models.CASCADE)
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
    text = models.CharField(max_length = 200, blank = True)
    tastiness = models.IntegerField(blank = True)
    difficulty = models.IntegerField(blank = True)
    date_time = models.DateTimeField(auto_now_add=True)

PREFERENCE_SORT_TYPE = (
    (1, 'Difficulty'),
    (2, 'Tastiness')
)

class Preferences(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    categories = ArrayField(models.CharField(max_length = 50, blank = True))
    appliances = ArrayField(models.CharField(max_length = 50, blank = True))
    cuisines = ArrayField(models.CharField(max_length = 50, blank = True))
    price_min = models.IntegerField(blank = True)
    price_max = models.IntegerField(blank = True)
    has_video = models.BooleanField()
    calories = models.IntegerField(blank = True)
    sort_by = models.IntegerField(choices=PREFERENCE_SORT_TYPE, default = 1) 
    
LIST_TYPE = (
    (1, 'Category'),
    (2, 'Applicance'),
    (3, 'Cuisine'),
)

class List(models.Model):
    description = models.CharField(max_length = 200)
    type = models.IntegerField(choices=LIST_TYPE)