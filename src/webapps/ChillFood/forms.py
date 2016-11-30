from django import forms

from .models import *

from enum import IntEnum
from django.core.validators import RegexValidator


class Sort(IntEnum):
    views = 1
    difficulty = 2
    calories = 3
    tastiness = 4
    time = 5

initial = {
            'skip': 0,
            'user_id': 0,
            'sort_id': Sort.views
        }
        
class SearchForm(forms.ModelForm): 
    category=forms.ModelMultipleChoiceField(queryset=Category.objects.all(),required=False)
    equipment=forms.ModelMultipleChoiceField(queryset=Equipment.objects.all(),required=False)
    cuisine=forms.ModelMultipleChoiceField(queryset=Cuisine.objects.all(),required=False)
    ingredient=forms.ModelMultipleChoiceField(queryset=Ingredient.objects.all(),required=False)
    sort_by = forms.IntegerField(initial=Sort.views,required=False) 

    class Meta:
        model = Preferences
        exclude = ['user','price_min','price_max']    
        
        
    search = forms.CharField(required=False)
    skip = forms.IntegerField(initial=0,required=False)
    user_id = forms.IntegerField(initial=0,required=False)
    # sort_id = forms.IntegerField(initial=Sort.views,required=False)
    # price_min = models.IntegerField(blank = True, default = 0)
    # price_max = models.IntegerField(blank = True, default = ~0)
    has_video = forms.BooleanField(required = False)
    
    # category_choices = [(c.id, c.name) for c in Category.objects.all()]
    # equipment_choices = [(c.id, c.name) for c in Equipment.objects.all()]
    # cuisine_choices = [(c.id, c.name) for c in Cuisine.objects.all()]
    
    # categories = forms.MultipleChoiceField(required = False, choices=category_choices)
    # equipments = forms.MultipleChoiceField(required = False, choices=equipment_choices)
    # cuisines = forms.MultipleChoiceField(required = False, choices=cuisine_choices)
    
    location_lat = forms.DecimalField(initial = 0,required=False)
    location_lon = forms.DecimalField(initial = 0,required=False)


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
        model = Ingredient
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
    category_set=forms.ModelMultipleChoiceField(queryset=Category.objects.all(),required=False)
    equipment_set=forms.ModelMultipleChoiceField(queryset=Equipment.objects.all(),required=False)
    cuisine_set=forms.ModelMultipleChoiceField(queryset=Cuisine.objects.all(),required=False)
    video_link = forms.CharField(required=False, 
                                 validators=[RegexValidator(regex=r"^https?\:\/\/www\.youtube\.com\/watch\?v=\w*$",
                                                            message='Invalid youtube link.',
                                                            code='invalid_username')])
    class Meta:
        model = Recipe
        exclude = ['pic', 'cook','ingredients']
    
    def clean_video_link(self):
        video_link = self.cleaned_data.get('video_link')

        if video_link:
            video_link = video_link.replace('watch?v=','embed/')
        
        return video_link

class PartyForm(forms.ModelForm):
    class Meta:
        model = Party
        exclude = ['host']

class ForgotPasswordForm(forms.Form):
    email = forms.EmailField(max_length = 200, label='Email id')

class ChangePasswordForm(forms.Form):
    old_password = forms.CharField(max_length = 200, 
                                label='Old Password', 
                                widget = forms.PasswordInput())
    password1 = forms.CharField(max_length = 200, 
                                label='New Password', 
                                widget = forms.PasswordInput())
    password2 = forms.CharField(max_length = 200, 
                                label='Confirm new password',  
                                widget = forms.PasswordInput())
    def clean(self):
        cleaned_data = super(ChangePasswordForm, self).clean()
        password1 = cleaned_data.get('password1')
        password2 = cleaned_data.get('password2')
        if password1 and password2 and password1 != password2:
            raise forms.ValidationError("New Passwords did not match.")
        return cleaned_data


class EditProfileForm(forms.ModelForm):
    class Meta:
        model = User
        fields = ['name', 'birthdate', 'bio', 'photo']
        
