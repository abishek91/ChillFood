from django import forms

from .models import *

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
    