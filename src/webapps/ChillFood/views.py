from django.shortcuts import render

from ChillFood.models import *
from django.contrib.auth.decorators import login_required
from django.contrib.staticfiles.templatetags.staticfiles import static
from django.shortcuts import get_object_or_404, redirect, reverse
from mimetypes import guess_type
from django.http import HttpResponse
from django.http import JsonResponse
import os

from django.conf import settings



@login_required
def index(request):
    context = {}

    return render(request, 'index.html',context)

def recipe_image(request, recipe_id):
	recipe = get_object_or_404(Recipe, id=recipe_id)

	if recipe.pic:
		image = recipe.pic
		content_type = guess_type(image.name)

	else:
		url = settings.BASE_DIR + 'ChillFood' + static('images/empty_profile.gif')
		with open(url, "rb") as empty_recipe:
			image = empty_recipe.read()
			content_type = 'image/gif'

	return HttpResponse(image, content_type=content_type)	

def step_image(request, step_id):
	print()
	step = get_object_or_404(Step, id=step_id)

	if step.picture:
		image = step.picture.name
		content_type = guess_type(image)

	# else:
	# 	url = settings.BASE_DIR + '/ChillFood' + static('images/empty_profile.gif')
	# 	with open(url, "rb") as empty_recipe:
	# 		image = empty_recipe.read()
	# 		content_type = 'image/gif'

	return HttpResponse(image, content_type=content_type)	

def recipe_detail(request, recipe_id):
	recipe = get_object_or_404(Recipe, id=recipe_id)
	
	recipe.calories = str(recipe.nutrientvalue_set.get(nutrient__name='Calories').amount) + ' ' + recipe.nutrientvalue_set.get(nutrient__name='Calories').unit
	recipe.categories = recipe.category_set.all()
	recipe.equipment = recipe.equipment_set.all()
	recipe.ingredients = recipe.recipeingredient_set.all()
	recipe.steps = recipe.step_set.order_by('step_number')

	context = {'recipe': recipe}
	return render(request, 'recipe_detail.html', context)

def recipe_detail_json(request, recipe_id):
	print(recipe_id)
	recipe = get_object_or_404(Recipe, id=recipe_id)

	return JsonResponse(recipe.to_json_full())

def plz(request):
	return render(request, 'hi.html', {})
