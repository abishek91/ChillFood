from django import forms
from .models import User

class LoginForm(forms.Form):
    username = forms.CharField(max_length=150,
                               label="Username")
    password = forms.CharField(label="Password",
                               widget=forms.PasswordInput(attrs={"placeholder": ""}))


class RegisterForm(forms.ModelForm):
    class Meta:
        model = User
        fields = ['name', 'birthdate', 'bio']
        widgets = {
            # 'username': forms.EmailField(max_length=64, help_text="The person's email address."),
            # forms.EmailField(),
             # forms.TextInput(attrs={'required': True,'label':"Email"}),
            'name': forms.TextInput(attrs={'required': True}),
            'bio': forms.Textarea(attrs={'class': 'materialize-textarea'})
        }
    username = forms.CharField(label="Email",
                                widget=forms.EmailInput())
            
    password = forms.CharField(widget=forms.PasswordInput())

    password2 = forms.CharField(label="Confirm Password",
                                widget=forms.PasswordInput())

    def clean(self):
        cleaned_data = super(RegisterForm, self).clean()

        password = cleaned_data.get('password')
        password2 = cleaned_data.get('password2')

        if password and password2 and password != password2:
            raise forms.ValidationError("Passwords did not match.")

        return cleaned_data
    
    def clean_firstname(self):
        firstname = self.cleaned_data['name']
        return firstname

    def clean_email(self):
        email = self.cleaned_data['username']
        return email

    def clean_username(self):
        username = self.cleaned_data.get('username')

        if User.objects.filter(username=username).count() == 1:
            raise forms.ValidationError("Username is already used.")

        return username

