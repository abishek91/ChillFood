from django import forms

from .models import *

class RecipeIngredientForm(forms.ModelForm):
    class Meta:
        model = RecipeIngredient
        exclude = []    

class RecipeForm(forms.ModelForm):
    class Meta:
        model = Recipe
        exclude = ['cook','pic']
    
    def clean(self):
        cleaned_data = super(RecipeForm, self).clean()

        #TODO: Add cook
        # password = cleaned_data.get('password')
        # password2 = cleaned_data.get('password2')

        # if password and password2 and password != password2:
        #     raise forms.ValidationError("Passwords did not match.")

        return cleaned_data
    