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

def profile_image(request, user_id):
	user = get_object_or_404(User, id=user_id)

	if user.photo:
		image = user.photo
		content_type = guess_type(image.name)

	else:
		url = settings.BASE_DIR + '/ChillFood' + static('images/empty_profile.png')
		with open(url, "rb") as empty_profie:
			image = empty_profie.read()
			content_type = 'image/png'

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

@login_required
def recipe_detail(request, recipe_id):
	print(1)
	recipe = get_object_or_404(Recipe, id=recipe_id)
	context = {'recipe': recipe, 'user_id': request.user.id}
	return render(request, 'recipe_detail.html', context)

@login_required
def recipe_detail_json(request, recipe_id):
	print(2)

	recipe = get_object_or_404(Recipe, id=recipe_id)

	return JsonResponse(recipe.to_json_full(request.user))

@login_required
def add_rating(request, recipe_id):
	recipe = Recipe.objects.get(id=recipe_id)

	rating,created = Rating.objects.get_or_create(recipe=recipe, user=request.user)

	tastiness = rating.tastiness
	difficulty = rating.difficulty

	if 'tastiness' in request.POST and request.POST['tastiness']:
		tastiness = request.POST['tastiness']
	if 'difficulty' in request.POST and request.POST['difficulty']:
		difficulty = request.POST['difficulty']
	if not tastiness and not difficulty:
		return JsonResponse({"error":"Invalid parametersq"})
	rating.tastiness = tastiness
	rating.difficulty = difficulty
	rating.save()

	return JsonResponse({"recipe":recipe.to_json_full(request.user)})

@login_required
def add_comment(request, recipe_id):
	recipe = Recipe.objects.get(id=recipe_id)
	if 'text' in request.POST and request.POST['text']:
		text = request.POST['text']
		new_comment = Comment( recipe=recipe, user=request.user, text=text)
		new_comment.save()
		return JsonResponse({"recipe":recipe.to_json_full(request.user)})
	return JsonResponse({"error":"Invalid parameters"})

@login_required
def recipe_pic(request, recipe_id):
    recipe = get_object_or_404(Recipe, id=recipe_id)
    
    
    if not recipe.pic:
        print(settings.MEDIA_ROOT+'\\food.jpg')
        with open(settings.MEDIA_ROOT+'\\food.jpg', "rb") as f:
            pic = f.read()
        content_type = 'image/png'
    else:
        pic = recipe.pic
        content_type = guess_type(pic.name)

    return HttpResponse(pic, content_type=content_type)

@login_required
def app(request):

    return render(request, 'app.html')

