from django.db import models
from django.contrib.auth.models import User
from django.utils.timezone import datetime, now
from django.contrib.postgres.fields import ArrayField

class Person(models.Model):
	name = models.CharField(max_length = 200)
	email = models.EmailField(max_length = 200)
	birthdate = models.DateField(null=True, blank=True, validators=[no_future_dates])
	bio = models.CharField(max_length = 420, blank = True)
	user = models.ForeignKey(User)
	following = models.ManyToManyField("self", symmetrical=False, related_name='followers')
	profile_pic = models.ImageField(upload_to='profile-pics', blank=True)
	is_active = models.BooleanField(default=False)
	location = models.CharField(max_length = 200, blank = True)
	def __unicode__(self):
		return self.user

class Recipe(models.Model):
	title = models.CharField(max_length = 200)
	cook = models.ForeignKey(Person, on_delete=models.CASCADE)
	time = models.IntegerField()
	calories = models.IntegerField(blank = True)
	video_link = models.CharField(max_length = 200, blank = True)
	date_time = models.DateTimeField(auto_now_add=True)
	categories = ArrayField(models.CharField(max_length = 50, blank = True))
	appliances = ArrayField(models.CharField(max_length = 50, blank = True))
	cuisines = ArrayField(models.CharField(max_length = 50, blank = True))
	
class Ingredient(models.Model):
	recipe = models.ForeignKey(Recipe, on_delete=models.CASCADE)
	name = models.CharField(max_length = 200)
	quantity = models.CharField(max_length = 200, blank = True)
	price = models.IntegerField(blank = True)

class Step(models.Model):
	recipe = models.ForeignKey(Recipe, on_delete=models.CASCADE)
	instruction = models.CharField(max_length = 200)
	picture = models.ImageField(upload_to='steps', blank=True)
	
class Comment(models.Model):
	recipe = models.ForeignKey(Recipe, on_delete=models.CASCADE)
	person = models.ForeignKey(Person, on_delete=models.CASCADE)
	text = models.CharField(max_length = 200, blank = True)
	tastiness = models.IntegerField(blank = True)
	difficulty = models.IntegerField(blank = True)
	date_time = models.DateTimeField(auto_now_add=True)

PREFERENCE_SORT_TYPE = (
    (1, 'Difficulty'),
    (2, 'Tastiness')
)

class Preferences(models.Model):
	person = models.ForeignKey(Person, on_delete=models.CASCADE)
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