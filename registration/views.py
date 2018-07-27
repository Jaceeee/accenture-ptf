from django.shortcuts import render, redirect
from django.views.generic.edit import FormView
from django.views import generic
from django.db import transaction
from django.urls import reverse
from django.contrib.auth import authenticate, login, logout

from registration.forms import UserLoginForm, UserSignUpForm,\
    PasaHeroUserSignupForm


# Create your views here.
class LoginView(FormView):
    template_name = 'registration/login.html'
    form_class = UserLoginForm

    @transaction.atomic
    def post(self, request):
        username = request.POST['username']
        raw_password = request.POST['password']

        user = authenticate(
            request,
            username=username,
            password=raw_password
        )

        if user is not None:
            login(request, user)
            return redirect(reverse('tracer:main_tracer'))
        else:
            return render(request, 'registration/login.html')


class LogoutView(generic.View):

    def get(self, request):
        logout(request)
        return render(request, 'registration/login.html')


class UserSignUpView(FormView):
    template_name = 'registration/signup.html'

    @transaction.atomic
    def post(self, request):
        user_signup_form = UserSignUpForm(request.POST)
        pasahero_signup_form = PasaHeroUserSignupForm(request.POST)

        if user_signup_form.is_valid() and pasahero_signup_form.is_valid():
            new_user = user_signup_form.save()
            new_user.save()

            pasahero_signup_form = PasaHeroUserSignupForm(
                request.POST
            )

            new_pasahero = pasahero_signup_form.save(commit=False)

            new_pasahero.first_name = request.POST['first_name']
            new_pasahero.last_name = request.POST['last_name']
            new_pasahero.user = new_user
            new_pasahero.save()            

            user_to_authenticate = authenticate(
                request,
                username=request.POST['username'],
                password=request.POST['password1']
            )

            user_to_authenticate.save()
            login(request, user_to_authenticate)

            return redirect(reverse('tracer:main_tracer'))
        else:
            user_signup_form = UserSignUpForm(
                request.POST or None,
                request.FILES or None,
            )

            pasahero_signup_form = PasaHeroUserSignupForm(
                request.POST or None,
                request.FILES or None,
            )

            messages.error(request, 'Error')

        return render(
            request,
            'registration/signup.html',
            {
                'user_signup_form': user_signup_form,
                'pasahero_signup_form': pasahero_signup_form
            }
        )

    def get(self, request):
        user_signup_form = UserSignUpForm()
        pasahero_signup_form = PasaHeroUserSignupForm()

        return render(
            request,
            'registration/signup.html',
            {
                'user_signup_form': user_signup_form,
                'pasahero_signup_form': pasahero_signup_form
            }
        )
