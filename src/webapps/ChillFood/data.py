from django.shortcuts import render
from django.core.files.temp import NamedTemporaryFile
from django.core.files import File
import urllib.request
import requests
import json
import posixpath
from urllib.parse import urlparse

from ChillFood.models import *

headers={"X-Mashape-Authorization":"CLZCMTWiRnmsh6hwnaWlbRSJMNrip111oeMjsnUapPjA1H9k3K"};

def download_image(url):
	req = urllib.request.Request(
    url, 
    data=None, 
    headers={
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/35.0.1916.47 Safari/537.36'
    })
	img_temp = NamedTemporaryFile()
	with urllib.request.urlopen(req) as response:
		data = response.read() # a `bytes` object
		img_temp.write(data)
	return File(img_temp)

def get_filename_from_url(url):
	image_url = url
	path = urllib.parse.urlsplit(image_url).path
	filename = posixpath.basename(path)
	return filename

def save_steps(recipe_id, new_recipe):
	steps_url = "https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/" + str(recipe_id) + "/analyzedInstructions"
	steps_json =requests.get(steps_url, headers=headers);
	steps = []
	step_number = 1;
	for sub_steps in json.loads(steps_json.text):
		for step in sub_steps['steps']:
			steps.append(step)
	for step in steps:
		new_step = Step(recipe=new_recipe, step_number=step_number, instruction=step['step'])
		new_step.save()
		step_number += 1
		if step['equipment']:
			for e in step['equipment']:
				equipment, created = Equipment.objects.get_or_create(name=e['name'])
				equipment.recipes.add(new_recipe)	
	return steps

def save_nutrients(recipe_id, new_recipe):
	recipe_json = requests.get("https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/" + str(recipe_id) + "/information?includeNutrition=true", headers=headers);
	nutrition = json.loads(recipe_json.text)['nutrition']
	for nutrient in nutrition['nutrients']:
		saved_nutrient, created = Nutrient.objects.get_or_create(name=nutrient['title'])
		nutrient_value = NutrientValue(recipe=new_recipe, nutrient=saved_nutrient, amount=nutrient['amount'], unit=nutrient['unit'], percentOfDailyNeeds=nutrient['percentOfDailyNeeds'])
		nutrient_value.save()

def save_recipe(user):
	# with open('/home/abishek/Documents/Classes/Web App Development/Team213/src/webapps/ChillFood/templates/recipe.json') as data_file:    
	# 	recipe = json.load(data_file)
	# with open('/home/abishek/Documents/Classes/Web App Development/Team213/src/webapps/ChillFood/templates/steps.json') as data_file:    
	# 	steps = json.load(data_file)[0]['steps']
	recipe_json = requests.get("https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/random?limitLicense=false&number=1", headers=headers);
	recipe = json.loads(recipe_json.text)['recipes'][0];


	if(recipe['readyInMinutes'] >= 30):
		print('Recipe skipped')
		return False

	recipe_id = recipe['id']

	recipe_nutrition = requests.get("https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/" + str(recipe_id) + "/information?includeNutrition=true", headers=headers);

	new_recipe = Recipe(title=recipe['title'], time=recipe['readyInMinutes'], cook=user)
	new_recipe.save()
	
	image_url = recipe['image']

	new_recipe.pic.save(get_filename_from_url(image_url), download_image(image_url))

	if(recipe['vegan']):
		category = Category.objects.get(name='Vegan')
		category.recipes.add(new_recipe)
		category.save()

	if(recipe['vegetarian']):
		category = Category.objects.get(name='Veg')
		category.recipes.add(new_recipe)
	else:
		category = Category.objects.get(name='Non-veg')
		category.recipes.add(new_recipe)
	category.save()

	for cuisine_name in recipe['cuisines']:
		cuisine, created = Cuisine.objects.get_or_create(name=cuisine_name)
		cuisine.recipes.add(new_recipe)

	for ingredient in recipe['extendedIngredients']:
		quantity = str(ingredient['amount']) + " " + ingredient['unitLong']
		saved_ingredient, created = Ingredient.objects.get_or_create(name=ingredient['name'])
		new_ingredient = RecipeIngredient(recipe=new_recipe, ingredient=saved_ingredient, quantity=quantity, display=ingredient['originalString'])
		new_ingredient.save()
		# ingredient_url = ingredient['image']
		# new_ingredient.pic.save(get_filename_from_url(ingredient_url), download_image(ingredient_url))
	s = save_steps(recipe_id, new_recipe)
	save_nutrients(recipe_id, new_recipe)
	context = {'json': json.loads(recipe_nutrition.text) , 'steps': s}

	return context;

def setup(request):
	number_of_files = 10;
	i = 0;
	while(i < number_of_files):
		try:
			user = User.objects.get(name='ChillFood.com')
		except User.DoesNotExist:
			user = User(name="ChillFood.com")
			user.save()
		try:
			context = save_recipe(user)
		except:
			context = False
			print('Exception, Recipe skipped')
		if(context):
			i += 1
			print('Recipe ' + str(i) + ' downloaded')
	return render(request, 'setup.html', context)










