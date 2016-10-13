from django.db import models
from django.contrib.auth.models import User
from django.utils.timezone import datetime, now
from django.contrib.postgres.fields import ArrayField

class Person(models.Model):
	first_name = models.CharField(max_length = 200, blank = True)
	last_name = models.CharField(max_length = 200, blank = True)
	email = models.EmailField(max_length = 200, blank = True)
	age = models.IntegerField(blank = True)
	bio = models.CharField(max_length = 420, blank = True)
	user = models.ForeignKey(User)
	following = models.ManyToManyField("self", symmetrical=False, related_name='followers')
	profile_pic = models.ImageField(upload_to='profile-pics', blank=True)
	isActive = models.BooleanField(default=False)
	Location = models.CharField(max_length = 200, blank = True)
	def __unicode__(self):
		return self.user

class Recipe(models.Model):
	title = models.CharField(max_length = 200, blank = True)
	cook = models.ForeignKey(Person, on_delete=models.CASCADE)
	likes = models.IntegerField(blank = True)
	calories = models.CharField(max_length = 200, blank = True)
	date_time = models.DateTimeField(auto_now_add=True)

class Ingredient(models.Model):
	name = models.CharField(max_length = 200, blank = True)
	quantity = models.CharField(max_length = 200, blank = True)
	price = models.CharField(max_length = 200, blank = True)

class Step(models.Model):
	recipe = models.ForeignKey(Recipe, on_delete=models.CASCADE)
	picture = models.ImageField(upload_to='steps', blank=True)
	instruction = models.CharField(max_length = 200, blank = True)

class Comment(models.Model):
	recipe = models.ForeignKey(Recipe, on_delete=models.CASCADE)
	text = models.CharField(max_length = 200, blank = True)
	upvotes = models.IntegerField(blank = True)
	date_time = models.DateTimeField(auto_now_add=True)

class Preferences(models.Model):
	person = models.ForeignKey(Person, on_delete=models.CASCADE)
	category = ArrayField(models.CharField(max_length = 50, blank = True))
	appliances = ArrayField(models.CharField(max_length = 50, blank = True))
	cuisine = ArrayField(models.CharField(max_length = 50, blank = True))
	price_range = models.CharField(max_length = 50, blank = True)
	videos = models.BooleanField()
	difficulty = models.CharField(max_length = 200, blank = True)
	calories = models.IntegerField(blank = True)
	rating = models.DecimalField(decimal_places = 1, max_digits = 2,blank = True)