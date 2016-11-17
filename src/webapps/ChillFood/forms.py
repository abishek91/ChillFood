from django import forms

from .models import *

from enum import IntEnum

class Sort(IntEnum):
    views = 1
    difficulty = 2
    calories = 3
    tastiness = 4

initial = {
            'skip': 0,
            'user_id': 0,
            'sort_id': Sort.views
        }
        
class SearchForm(forms.Form):
    search = forms.CharField(required=False)
    skip = forms.IntegerField(initial=0,required=False)
    user_id = forms.IntegerField(initial=0,required=False)
    sort_id = forms.IntegerField(initial=Sort.views,required=False)
    
    def clean(self):
        cleaned_data = super(SearchForm, self).clean()
        for key, value in cleaned_data.items():
            # print(1,key,value, initial)
            if not value and key in initial:
                # print(2,key,value)
                cleaned_data[key] = initial[key]
        print(cleaned_data);
        return cleaned_data

class IngredientForm(forms.ModelForm):
    class Meta:
        model = RecipeIngredient
        exclude = []    

class StepForm(forms.ModelForm):
    class Meta:
        model = Step
        exclude = ['recipe'] 

class RecipeIngredientForm(forms.Form):    
    ingredient_id = forms.IntegerField()
    ingredient_name = forms.CharField(max_length=150)
    quantity = forms.CharField(max_length = 200)
    price = forms.IntegerField()
    display = forms.CharField(max_length = 200)

    
class RecipeForm(forms.ModelForm):
    class Meta:
        model = Recipe
        exclude = ['cook','pic','ingredients']
    
    def clean(self):
        cleaned_data = super(RecipeForm, self).clean()

        #TODO: Add cook
        # password = cleaned_data.get('password')
        # password2 = cleaned_data.get('password2')

        # if password and password2 and password != password2:
        #     raise forms.ValidationError("Passwords did not match.")

        return cleaned_data
    