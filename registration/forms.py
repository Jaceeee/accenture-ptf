from django import forms
from django.contrib.auth.forms import UserCreationForm


from django.contrib.auth.models import User
from .models import PasaHeroUser


class UserLoginForm(forms.Form):
    username = forms.CharField()
    password = forms.CharField(max_length=32, widget=forms.PasswordInput)


class UserSignUpForm(UserCreationForm):
    class Meta:
        model = User
        fields = ('first_name', 'last_name', 'email', 'username')


class PasaHeroUserSignupForm(forms.ModelForm):
    class Meta:
        model = PasaHeroUser
        fields = ('first_name', 'last_name')
