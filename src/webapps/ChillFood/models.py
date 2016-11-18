from django.db import models
# from django.contrib.auth.models import User
from django.utils.timezone import datetime, now
from django.core import serializers
from django.contrib.postgres.fields import ArrayField
from django.utils.dateformat import DateFormat
from django.utils.formats import get_format
from django.db.models import Avg
from .login.models import User


CATEGORIES = (
    ('Veg', 'Veg'),
    ('Vegan', 'Vegan'),
    ('Non-veg', 'Non-veg')
)

class Category(models.Model):
    name = models.CharField(max_length = 200, choices=CATEGORIES)

class Equipment(models.Model):
    name = models.CharField(max_length = 200)

class Cuisine(models.Model):
    name = models.CharField(max_length = 200)

class Recipe(models.Model):
    pic = models.ImageField(upload_to='recipes', blank=True)
    title = models.CharField(max_length = 200)
    cook = models.ForeignKey(User, on_delete=models.CASCADE, blank=True, null=True)
    time = models.IntegerField()
    calories = models.IntegerField(blank=True, null=True)
    video_link = models.CharField(max_length = 200, blank = True)
    date_time = models.DateTimeField(auto_now_add=True)
    views = models.IntegerField(default=0, blank=True)
    category = models.ManyToManyField(Category)
    equipment = models.ManyToManyField(Equipment)
    cuisine = models.ManyToManyField(Cuisine)

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
          "tastiness": self.tastiness,
          "difficulty": self.difficulty,
          # "tastiness": self.rating_set.all().aggregate(Avg('tastiness'))['tastiness__avg']
          # "tastiness": self.rating_set.all().aggregate(Avg('tastiness'))['tastiness__avg']
        }

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
    name = models.CharField(max_length = 200)

class RecipeIngredient(models.Model):
    recipe = models.ForeignKey(Recipe, on_delete=models.CASCADE, related_name="ingredients")
    ingredient = models.ForeignKey(Ingredient, on_delete=models.CASCADE)
    quantity = models.CharField(max_length = 200, blank = True)
    price = models.IntegerField(blank = True, null = True)
    display = models.CharField(max_length = 200, blank = True)

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
    price_min = models.IntegerField(blank = True, default = 0)
    price_max = models.IntegerField(blank = True, default = ~0)
    has_video = models.BooleanField(default = False)
    category = models.ManyToManyField(Category)
    equipment = models.ManyToManyField(Equipment)
    cuisine = models.ManyToManyField(Cuisine)
    
LIST_TYPE = (
    (1, 'Category'),
    (2, 'Applicance'),
    (3, 'Cuisine'),
)

class List(models.Model):
    description = models.CharField(max_length = 200)
    type = models.IntegerField(choices=LIST_TYPE)