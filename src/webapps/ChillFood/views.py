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
		url = settings.BASE_DIR + '/ChillFood' + static('images/food.jpg')
		with open(url, "rb") as empty_recipe:
			image = empty_recipe.read()
			content_type = 'image/jpg'

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
	recipe = get_object_or_404(Recipe, id=recipe_id)

	context = {'recipe': recipe, 'user_id': request.user.id}
	return render(request, 'recipe_detail.html', context)

@login_required
def recipe_detail_json(request, recipe_id):
	recipe = get_object_or_404(Recipe, id=recipe_id)

	return JsonResponse(recipe.to_json_full(request.user))

@login_required
def add_rating(request, recipe_id):
	recipe = Recipe.objects.get(id=recipe_id)

	rating,created = Rating.objects.get_or_create(recipe=recipe, user=request.user)

	tastiness = rating.tastiness
	difficulty = rating.difficulty
	notification_text = request.user.name + " has added a";
	appender = ""

	if 'tastiness' in request.POST and request.POST['tastiness']:
		tastiness = request.POST['tastiness']
		notification_text += appender + " tastiness rating of " + tastiness;
		appender = " and a "
	if 'difficulty' in request.POST and request.POST['difficulty']:
		difficulty = request.POST['difficulty']
		notification_text +=  appender + "difficulty rating of " + difficulty;
	if not tastiness and not difficulty:
		return JsonResponse({"error":"Invalid parameters"})

		

	rating.tastiness = tastiness
	rating.difficulty = difficulty
	rating.save()

	notification_text += " to your recipe " + recipe.title;
	notification = Notification(user=recipe.cook, text=notification_text,read=False,
								link=reverse('recipe_detail', kwargs={'recipe_id':recipe.id}) + '#/recipe/' + str(recipe.id))
	notification.save()

	return JsonResponse({"recipe":recipe.to_json_full(request.user)})

@login_required
def add_comment(request, recipe_id):
	recipe = Recipe.objects.get(id=recipe_id)
	if 'text' in request.POST and request.POST['text']:
		text = request.POST['text']
		new_comment = Comment( recipe=recipe, user=request.user, text=text)
		new_comment.save()
		notification_text = request.user.name + " has added a comment to your recipe " + recipe.title;

		notification = Notification(user=recipe.cook, text=notification_text,read=False,
									link=reverse('recipe_detail', kwargs={'recipe_id':recipe.id}) + '#/recipe/' + str(recipe.id))
		notification.save()

		return JsonResponse({"recipe":recipe.to_json_full(request.user)})
	return JsonResponse({"error":"Invalid parameters"})

@login_required
def recipe_pic(request, recipe_id):
    recipe = get_object_or_404(Recipe, id=recipe_id)
    
    
    if not recipe.pic:
        print(settings.MEDIA_ROOT+'/food.jpg')
        with open(settings.MEDIA_ROOT+'/food.jpg', "rb") as f:
            pic = f.read()
        content_type = 'image/png'
    else:
        pic = recipe.pic
        content_type = guess_type(pic.name)

    return HttpResponse(pic, content_type=content_type)

@login_required
def app(request):
    return render(request, 'app.html')

@login_required
def profile(request, user_id):
	user = get_object_or_404(User, id=user_id)
	context = {"profile": user}
	return render(request, 'profile.html',context)

@login_required
def follow(request, user_id):
	followee = User.objects.get(id=user_id)
	follower = User.objects.get(id=request.user.id)
	follower.following.add(followee)
	return JsonResponse({"user":followee.to_json()})

@login_required
def unfollow(request, user_id):
	followee = User.objects.get(id=user_id)
	follower = User.objects.get(id=request.user.id)
	
	follower.following.remove(followee)
	return JsonResponse({"user":followee.to_json()})

@login_required
def profile_json(request, user_id):
	user = get_object_or_404(User, id=user_id)
	return JsonResponse({"user":user.to_json()})

def display_users(request, user_id):
    return render(request, 'root.html')

@login_required
def notifications(request):
	return JsonResponse({"notifications": serializers.serialize("json", Notification.objects.filter(user=request.user).order_by('-id'))})

@login_required
def readNotifications(request):
	unread = Notification.objects.filter(read=False)
	for notification in unread:
		notification.read = True;
		notification.save()
	return notifications(request)

def party_confirm(request, party_id, user_id, token):
  guest = get_object_or_404(Guest, party_id = party_id, user_id = user_id)

  if len(guest.token) == 0:
    raise Http404("Invitation has already been answered.")

  [random_number,real_token] = guest.token.split(';')

  if token == real_token:
    guest.token = "";
    guest.status = 1;
    guest.save(); 
    return render(request, 'party_confirm.html', {})
  else:
    raise Http404("Token does not exist")

def party_decline(request, party_id, user_id, token):
  guest = get_object_or_404(Guest, party_id = party_id, user_id = user_id)

  if not guest.token:
    raise Http404("Token does not exist")

  [random_number,real_token] = guest.token.split(';')
  
  if token == real_token:
    guest.token = "";
    guest.status = -1;
    guest.save(); 
    return render(request, 'party_decline.html', {})
  else:
    raise Http404("Token does not exist")
