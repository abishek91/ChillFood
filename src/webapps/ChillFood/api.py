# Django Libraries
import datetime
from django.core import serializers
from django.http import JsonResponse,HttpResponseBadRequest
from django.http import HttpResponse
from django.contrib.auth.decorators import login_required
from django.db.models import Avg
from django.db.models.functions import Coalesce
from django.db import transaction
from django.db.models import Q
import re
import json
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
    preferences.sort_by = form.cleaned_data['sort_id'];
    preferences.save();

    #Filter
    if form.cleaned_data['search']:
        print('search',form.cleaned_data['search']);
        lista = form.cleaned_data['search'].split()
        query = reduce(lambda x, y: x | y, [Q(title__icontains=word) for word in lista])

    if form.cleaned_data['user_id']:
        query &= Q(cook__id=form.cleaned_data['user_id'])

    #Order
    print('sort_id', form.cleaned_data['sort_id']);
    if form.cleaned_data['sort_id'] == Sort.difficulty:
        sort = 'difficulty'
    elif form.cleaned_data['sort_id'] == Sort.calories:
        sort = '-calories'       
    elif form.cleaned_data['sort_id'] == Sort.tastiness:
        sort = '-tastiness'
    elif form.cleaned_data['sort_id'] == Sort.time:
        sort = 'time'
    else:    
        sort = '-views'

    #Execute Query
    recipes = Recipe

    if query:
        recipes = Recipe.objects.filter(query) 
    else:
        recipes = Recipe.objects.filter() 

    print('time',sort)
    print(sort);
    new_recipes = recipes \
             .annotate(difficulty=Coalesce(Avg('rating__difficulty'),10), \
                       tastiness=Coalesce(Avg('rating__tastiness'),-1),) \
             .order_by(sort)    
    print(new_recipes)
    
    #TODO: More elaborate query for homepage
    skip = form.cleaned_data['skip']
    print(skip)
    data = new_recipes[skip:skip+limit]
    next_url_filters = []
    if (len(new_recipes[skip+limit:])):
        next_url_filters.append('skip=%d' % (skip+limit))
        if form.cleaned_data['search']:
            next_url_filters.append('search=%s' % form.cleaned_data['search'] )
        if form.cleaned_data['user_id']:
            next_url_filters.append('user_id=%d' % form.cleaned_data['user_id'] )

        if next_url_filters:
            v_next = '%s?%s' % (request.path,'&'.join(next_url_filters))

    result = {
        "data": list(map(lambda x: x.to_json(), data)),
        "next": v_next,
    }

    return JsonResponse(result,safe=False)
    
@transaction.atomic
@login_required
def recipe_create(request, recipe_id = 0):
    context={}
    recipe = Recipe()
    #request.user.id
    if recipe_id:
        recipe = get_object_or_404(Recipe, pk=recipe_id)
    else:
        recipe.cook = request.user

    # context['lists'] = {
    #     "categories": Category.objects.all(),
    #     "appliances": Equipment.objects.all()
    # }

    if request.method == "GET":
        return JsonResponse(recipe.to_json(), safe=False);
        # return render(request, 'recipe_create.html', context)

    body_unicode = request.body.decode('utf-8')
    body = json.loads(body_unicode)
    print(body)
    #Validations
    form = RecipeForm(body, instance=recipe)
    print('ingre',body['ingredients'])

    if not form.is_valid():
        return JsonResponse(dict(form.errors.items()),status=406)        
    
    if 'ingredients' not in body:
        return JsonResponse([{'ingredients': 'Ingredients are required.'}],status=406)        
    
    if 'steps' not in body:
        return JsonResponse([{'steps': 'Steps are required.'}],status=406)        
    
    recipe_ingredients = []
    for recipe_ingredient in body['ingredients']:
        print('Ingredients')
        # recipe_ingredient['recipe_id'] = recipe.id;

        # if 'ingredient' not in recipe_ingredient:# my_ingredient.id:
        #     print('hey')
        #     return JsonResponse([{'ingredients.ingredient': 'Ingredient is required.'}],status=406)        
        # else:
        #     my_ingredient = IngredientForm(recipe_ingredient['ingredient']);
        #     recipe_ingredient['ingredient'] = my_ingredient

        form = RecipeIngredientForm(recipe_ingredient)
        if not form.is_valid():
            return JsonResponse(dict(form.errors.items()),status=406)
        recipe_ingredients.append(form);

    steps = []
    for step in body['steps']:
        print('Steps')
        # form['recipe_id'] = recipe.id;
        form = StepForm(step)
        if not form.is_valid():
            return JsonResponse(dict(form.errors.items()),status=406)
        # form.recipe_id = recipe.id;
        steps.append(form);

    #Save Parent
    recipe.save()

    #Saving nested elements 
    for rp in recipe_ingredients:
        # my_ingredient = rp.ingredient_id

        #If the ingredient is new, save it to the database
        # if not rp.ingredient_id:
        my_ingredient = Ingredient(name=rp.cleaned_data['ingredient_name']);
        my_ingredient.save()

        recipe_ingredient = RecipeIngredient(recipe_id = recipe.id,
                             ingredient_id = my_ingredient.id,
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
    
    # recipe = Recipe.get(pk=recipe.id)

    return JsonResponse(recipe.to_json(), safe=False);