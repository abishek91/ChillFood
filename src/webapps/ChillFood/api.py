from django.views.decorators.csrf import csrf_exempt
# Django Libraries
import datetime
from django.shortcuts import render, redirect, reverse, get_object_or_404
from django.core import serializers
from django.core.mail import send_mail
from django.http import JsonResponse,HttpResponseBadRequest
from django.http import HttpResponse
from django.contrib.auth.decorators import login_required
from django.db.models import Avg
from django.db.models.functions import Coalesce
from django.db import transaction
from django.db.models import Q
from django.http import Http404
from django.core.paginator import Paginator,EmptyPage,PageNotAnInteger
from django.db.models import Count, Sum, Case, When, IntegerField, F

import hashlib  
import random 
import re
import json, sys
from functools import reduce

# Local Libraries
from .models import *
from .forms import *

 
@transaction.atomic
@login_required
def recipes(request):
    form = SearchForm(request.GET);

    if not form.is_valid():
        return JsonResponse(dict(form.errors.items()),status=406)        
    
    print('start');
    limit = 6
    query = Q()
    v_next = None

    preferences = Preferences.objects.get(pk=request.user.id);
    preferences.sort_by = form.cleaned_data['sort_by'] if form.cleaned_data['sort_by'] else 1;
    preferences.has_video = form.cleaned_data['has_video'];

    preferences.category.clear();
    preferences.cuisine.clear();
    preferences.equipment.clear();
    preferences.ingredient.clear();
    preferences.save();
    
    categories = Category.objects.filter(pk__in=form.cleaned_data['category']);
    preferences.category.set(categories)

    cuisines = Cuisine.objects.filter(pk__in=form.cleaned_data['cuisine']);
    preferences.cuisine.set(cuisines)

    equipments = Equipment.objects.filter(pk__in=form.cleaned_data['equipment']);
    preferences.equipment.set(equipments)

    ingredients = Ingredient.objects.filter(pk__in=form.cleaned_data['ingredient']);
    preferences.ingredient.set(ingredients)

    preferences.save();

    #Update Location
    if form.cleaned_data['location_lat'] and form.cleaned_data['location_lon']:
        request.user.location_lat = form.cleaned_data['location_lat'] 
        request.user.location_lon = form.cleaned_data['location_lon']
        request.user.save();
        
    #Filter
    if form.cleaned_data['search']:
        print('search',form.cleaned_data['search']);
        lista = form.cleaned_data['search'].split()
        query = reduce(lambda x, y: x | y, [Q(title__icontains=word) for word in lista])

    if form.cleaned_data['user_id']:
        query &= Q(cook__id=form.cleaned_data['user_id'])

    if form.cleaned_data['has_video']:
        query &= ~Q(video_link="")

    
    if form.cleaned_data['category']:
        lista = form.cleaned_data['category']
        query &= reduce(lambda x, y: x | y, [Q(category_set__id=int(category.id)) for category in lista])

    if form.cleaned_data['equipment']:
        lista = form.cleaned_data['equipment']
        query &= Q(equipment_set__id__in=lista)

    if form.cleaned_data['cuisine']:
        lista = form.cleaned_data['cuisine']
        query &= reduce(lambda x, y: x | y, [Q(cuisine_set__id=int(cuisine.id)) for cuisine in lista])


    # if form.cleaned_data['price_min']:
    #     query &= Q(price__gte=form.cleaned_data['price_min'])
        
    # if form.cleaned_data['price_max']:
    #     query &= Q(price__lte=form.cleaned_data['price_max'])

    if form.cleaned_data['has_video']:
        query &= ~Q(video_link="")


    #Order
    print('sort_by', form.cleaned_data['sort_by']);
    if form.cleaned_data['sort_by'] == Sort.difficulty:
        sort = 'difficulty'
    elif form.cleaned_data['sort_by'] == Sort.calories:
        sort = '-calories'       
    elif form.cleaned_data['sort_by'] == Sort.tastiness:
        sort = '-tastiness'
    elif form.cleaned_data['sort_by'] == Sort.time:
        sort = 'time'
    else:    
        sort = '-views'

    #Execute Query
    recipes = Recipe

    if query:
        print('query',query)

        recipes = Recipe.objects.filter(query) 
    else:
        recipes = Recipe.objects.filter() 

    #Remove recipes that have ingredients which are not included in the list
    if form.cleaned_data['ingredient']:

        lista = form.cleaned_data['ingredient']

        #Get the names of the selected ingredients
        temp_names = Ingredient.objects.filter(id__in=lista).values_list('name')
        ingredient_names = []
        for i in temp_names:
            ingredient_names.append(str(i[0]))
        
        #Include to the list other ingredients with similar names
        ingredient_query = reduce(lambda x, y: x | y, [Q(name__icontains=name) for name in ingredient_names])
        temp_ids = Ingredient.objects.filter(ingredient_query).values_list('id')
        ingredients_id = []
        for i in temp_ids:
            ingredients_id.append(str(i[0]))

        print('Original', lista, 'New Ingredient',ingredients_id)
        
        recipes = recipes.annotate(
                found_ingredients = Count(
                                        Case(
                                            When(ingredients__ingredient_id__in = ingredients_id, then=1), 
                                            output_field=IntegerField()
                                            )
                                        ),
                missing_ingredients = Count(
                                        Case(
                                            When(~Q(ingredients__ingredient_id__in = ingredients_id), then=1), 
                                            output_field=IntegerField()
                                            )
                                        )
                        )\
                .exclude(found_ingredients = 0)

        sort ="missing_ingredients"

    new_recipes = recipes \
                 .annotate(difficulty=Coalesce(Avg('rating__difficulty'),10), \
                          tastiness=Coalesce(Avg('rating__tastiness'),-1),) \
                 .order_by(sort)    
    print("----->" , recipes.query)
        
    print(new_recipes)
    
    #TODO: More elaborate query for homepage
    skip = form.cleaned_data['skip']
    print(skip)
    data = new_recipes[skip:skip+limit]
    next_url_filters = []
    if (len(new_recipes[skip+limit:])):
        v_next = request.get_full_path()
        re.sub(r'skip=\d+\&',v_next,'')
        print(v_next)
        v_next += '&skip=%d' % (skip+limit)
        print(v_next)
        re.sub(r'\\&',v_next,'?')
        print(request.path,v_next)

        # next_url_filters.append('skip=%d' % (skip+limit))
        # if form.cleaned_data['search']:
        #     next_url_filters.append('search=%s' % form.cleaned_data['search'] )
        # if form.cleaned_data['user_id']:
        #     next_url_filters.append('user_id=%d' % form.cleaned_data['user_id'] )
        # if form.cleaned_data['sort_by']

        # if next_url_filters:
        # v_next = '%s?%s' % (request.path,v_next)

    result = {
        "data": list(map(lambda x: x.to_json(), data)),
        "next": v_next,
    }

    return JsonResponse(result,safe=False)
    
@csrf_exempt
@transaction.atomic
@login_required
def recipe_create(request, recipe_id = 0):
    context={}
    recipe = Recipe()
    
    if recipe_id:
        recipe = get_object_or_404(Recipe, pk=recipe_id)
    else:
        recipe.cook = request.user

    if request.method == "GET":
        return JsonResponse(recipe.to_json(), safe=False);

    try:
        body_unicode = request.body.decode('utf-8')
        body = json.loads(body_unicode)
    except Exception:
        return JsonResponse({'error':'Body malformed'},status=406)        
    
    
    try:
        body_unicode = request.body.decode('utf-8')
        body = json.loads(body_unicode)
    except Exception:
        return JsonResponse({'error':'Body malformed'},status=406)        
    
    #Validations
    form = RecipeForm(body, instance=recipe)

    if not form.is_valid():
        return JsonResponse(dict(form.errors.items()),status=406)        
    

    if 'ingredients' not in body:
        return JsonResponse([{'ingredients': 'Ingredients are required.'}],status=406)        
    
    if 'steps' not in body:
        return JsonResponse([{'steps': 'Steps are required.'}],status=406)        
    
    recipe_ingredients = []
    for recipe_ingredient in body['ingredients']:
        rp_form = RecipeIngredientForm(recipe_ingredient)
        if not rp_form.is_valid():
            return JsonResponse(dict(rp_form.errors.items()),status=406)
        recipe_ingredients.append(rp_form);

    steps = []
    for step in body['steps']:
        st_form = StepForm(step)
        if not st_form.is_valid():
            return JsonResponse(dict(st_form.errors.items()),status=406)
        steps.append(st_form);

    #Recipe - Categories
    
    #Save Parent
    recipe.save()
    recipe.category_set.set(form.cleaned_data['category_set'])
    recipe.equipment_set.set(form.cleaned_data['equipment_set'])
    recipe.cuisine_set.set(form.cleaned_data['cuisine_set'])
    recipe.save()
    print('Categories',recipe.category_set)
    print('Categories 2',form.cleaned_data['category_set'])

    #Saving nested elements 
    for rp in recipe_ingredients:
        # my_ingredient = rp.ingredient_id

        # If the ingredient is new, save it to the database
        if not rp.cleaned_data['ingredient_id']:
            my_ingredient = Ingredient(name=rp.cleaned_data['ingredient_name']);
            my_ingredient.save()
            ingredient_id = my_ingredient.id
        else:
            ingredient_id = rp.cleaned_data['ingredient_id']

        recipe_ingredient = RecipeIngredient(recipe_id = recipe.id,
                                             ingredient_id = ingredient_id,
                                             quantity = rp.cleaned_data['quantity'],
                                             price = rp.cleaned_data['price'],
                                             display = rp.cleaned_data['display']);

        recipe_ingredient.save()
        # recipe.ingredients.add(recipe_ingredient)
    
    for step in steps:
        
        step = Step(recipe_id = recipe.id,
                     step_number = step.cleaned_data['step_number'],
                     instruction = step.cleaned_data['instruction'],
                     picture = step.cleaned_data['picture']);

        step.save()
        # recipe.steps.add(step)
    
    user = User.objects.get(id=request.user.id)
    notification_text = user.name + " has uploaded a new recipe " + recipe.title;
    for follower in user.followers.all():
        notification = Notification(user=follower, text=notification_text,read=False,
                                        link=reverse('recipe_detail', kwargs={'recipe_id':recipe.id}) + '#/recipe/' + str(recipe.id))
        notification.save()

    return JsonResponse(recipe.to_json(), safe=False);

@login_required
def lists(request):    
    categories = [c.to_json() for c in Category.objects.all()]
    equipments = [c.to_json() for c in Equipment.objects.all()]
    cuisines = [c.to_json() for c in Cuisine.objects.all()]

    return JsonResponse({'categories':categories,\
                         'equipments':equipments,\
                         'cuisines':cuisines}, safe=False);


@login_required
def ingredients(request): 
    #Variables
    result = {}  
    PAGE_SIZE = 9
        
    #Set page number
    page = request.GET.get('page','1')
    name = request.GET.get('name','')
    exact = request.GET.get('exact','N')

    #Get Data
    if exact == 'Y':
        lista = [c.to_json() for c in Ingredient.objects.filter(name__iexact = name).order_by('name')]
    else:
        lista = [c.to_json() for c in Ingredient.objects.filter(name__icontains = name).order_by('name')]
    
    #Paginate the result
    paginated_list = Paginator(lista, PAGE_SIZE)

    try:
        current_page = paginated_list.page(page)
    except (EmptyPage, PageNotAnInteger) as error:
        return JsonResponse({'error':str(error)},status=400)

    result['data'] = current_page.object_list

    if current_page.has_next():
        result['next'] = '%s?page=%d' % (request.path,current_page.next_page_number())

    return JsonResponse(result,safe=False)


@transaction.atomic
@login_required
@csrf_exempt
def ingredient_create(request):
    context={}
    ingredient = Ingredient()

    if request.method == "GET":
        raise Http404("Url does not exist")

    try:
        body_unicode = request.body.decode('utf-8')
        body = json.loads(body_unicode)
    except Exception:
        return JsonResponse({'error':'Body malformed'},status=406)        

    #Validations
    form = IngredientForm(body, instance=ingredient)

    if not form.is_valid():
        return JsonResponse(dict(form.errors.items()),status=406)        
    
    ingredient.save();
    
    return JsonResponse(ingredient.to_json(), safe=False);

@login_required
def preferences(request):
    preference = Preferences.objects.filter(user=request.user)
    if not len(preference):
        preferences = Preferences(user=request.user)
        preferences.save()
    else:
        preferences = preference[0]
        
    return JsonResponse(preferences.to_json(), safe=False);

@transaction.atomic
@login_required
def party_create(request):
    context={}
    party = Party()

    if request.method == "GET":
        raise Http404("Url does not exist")

    try:
        body_unicode = request.body.decode('utf-8')
        body = json.loads(body_unicode)
    except Exception:
        return JsonResponse({'error':'Body malformed'},status=406)        
    
    #Validations
    form = PartyForm(body, instance=party)
    print(request.user)

    if not form.is_valid():
        return JsonResponse(dict(form.errors.items()),status=406)        
    
    party.host = request.user
    party.save();
    
    for guest_id in body['guests']:  
      print('a') 
      guest = Guest(user_id=guest_id, party=party)
      guest.save()
    
    #Save Parent
    print('guests',party.guests)
    print('guests',form['guests'])
    print('guests',len(party.guests.all()))
    
    # for guest in party.guests.all():TODO: Ask OH
    for guest in Guest.objects.filter(party_id=party.id):
        print('tests', guest.status)
        random_number = str(random.randrange(1000))
        hash = hashlib.sha256()

        # for i in range(ROUNDS):
        key = str(party.id) + str(guest.id)
        print(key)
        hash.update(key.encode('utf-8'))
        hash.update(random_number.encode('utf-8'))

        token =  hash.hexdigest();
        guest.token = random_number + ';' + token
        guest.save()
        send_invitation(request.get_host(), party.host.name,\
         guest, party.recipe.title, party.date, token)

    party.save();

    return JsonResponse(party.to_json(), safe=False);

def send_invitation(host, from_name, guest, recipe_title, date, token):

    email_body = ("Hi, is me %s. \n I want to cook %s on %s. "+\
                 "Do you want to do it together?\n\n"+\
                 "Click here to confirm: http://%s%s" \
                 "\n\n\n\n"+\
                 "Click here to decline: http://%s%s" )\
                 % (from_name, 
                    recipe_title,
                    str(date),
                    host, 
                    reverse('party_confirm', args=[guest.party_id,guest.user_id,token]),
                    host, 
                    reverse('party_decline', args=[guest.party_id,guest.user_id,token]))

    send_mail(subject="Do you want to cook %s?" % recipe_title,
              message=email_body,
              from_email="cdelacru@andrew.cmu.edu",
              recipient_list=[guest.user.username])

@login_required
def parties(request): 
    #Variables
    result = {}  
    PAGE_SIZE = 3
        
    #Set page number
    page = request.GET.get('page','1')

    # if re.match(r'^\d+$',page):
    #     page = int(page)
    # else:
    #     page = 1

    #Get Data
    lista = [c.to_json() for c in Party.objects.filter(host_id = request.user.id).order_by('-date','-id')]
    
    #Paginate the result
    paginated_list = Paginator(lista, PAGE_SIZE)

    try:
        current_page = paginated_list.page(page)
    except (EmptyPage, PageNotAnInteger) as error:
        return JsonResponse({'error':str(error)},status=400)

    result['data'] = current_page.object_list

    if current_page.has_next():
        result['next'] = '%s?page=%d' % (request.path,current_page.next_page_number())

    return JsonResponse(result,safe=False)

@login_required
def user_query(request): 
    name = request.GET.get('name')

    # near = request.GET.get('near')
    # if near:
    #     #TODO: Some cool logic

    users = request.user.following.filter(name__icontains=name)
    lista = [{'id':c.id, 'text':c.name}for c in users]

    return JsonResponse(lista, safe=False);

@login_required
def user(request): 
    name = request.GET.get('name')

    # near = request.GET.get('near')
    # if near:
    #     #TODO: Some cool logic
    lon = request.user.location_lon
    lat = request.user.location_lat

    #TODO: Find a better way to do this
    # users = User.objects.all()
    users = User.objects.filter(name__icontains=name).exclude(pk=request.user.id)
    # users = request.user.following.filter(name__icontains=name)
    print('hey',len(users))
    lista = []
    if lon and lat:
        for u in users:
            user_dic ={'id':u.id, 'text':u.name}
            user_dic['distance'] = u.distance(lon,lat)
            if user_dic['distance'] != None:
                user_dic['text'] ="%s (%0.2f km)" % (u.name, u.distance(lon,lat))
            lista.append(user_dic)

        lista = sorted(lista,key=lambda x: x['distance'] if  x['distance'] else sys.maxsize)
    else:
        lista = [{'id':c.id, 'text':c.name, 'distance':None}for c in users]
        
    return JsonResponse(lista, safe=False);


#Profile
@csrf_exempt
@login_required
def edit_profile(request):
    context = {}

    user = get_object_or_404(User, pk=request.user.id)

    if request.method == "GET":
        return JsonResponse(user.to_json(), safe=False);

    try:
        body_unicode = request.body.decode('utf-8')
        body = json.loads(body_unicode)
    except Exception:
        return JsonResponse({'error':'Body malformed'},status=406)        
    
    form = EditProfileForm(body, instance=user)
    
    if not form.is_valid():
        return JsonResponse(dict(form.errors.items()),status=406)        

    form.save()

    return JsonResponse(user.to_json(), safe=False);
