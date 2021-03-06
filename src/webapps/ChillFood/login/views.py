# Django Libraries
from django.shortcuts import render, redirect, reverse, get_object_or_404
from django.core.mail import send_mail
from django.http import HttpResponse, Http404
from django.db import transaction

# Django Authentication Libraries
from django.contrib.auth import login as authLogin, authenticate
from django.contrib.auth.decorators import login_required
from django.contrib.auth.tokens import default_token_generator

# Python Libraries
from mimetypes import guess_type
import re
import os
# Local Libraries
from .models import *
from .forms import *
from ..models import *
from django.conf import settings

# Views
def login(request):
    context = {}

    if request.user.is_authenticated():
        return redirect(reverse('index'))

    if request.method == "GET":
        context['form'] = LoginForm()
        return render(request, 'login.html', context)

    form = LoginForm(request.POST)
    context['form'] = form

    if not form.is_valid():
        return render(request, 'login.html', context)

    authenticated_user = authenticate(username=form.cleaned_data['username'],
                                      password=form.cleaned_data['password'])

    if not authenticated_user:
        context['error'] = 'Incorrect username or password.'
        return render(request, 'login.html', context)

    authLogin(request, authenticated_user)

    next_page = request.GET.get('next')

    if not next_page:
        next_page = reverse('index')

    return redirect(next_page)


@transaction.atomic
def register(request):
    context = {}

    if request.method == "GET":
        context['form'] = RegisterForm()
        return render(request, 'register.html', context)

    form = RegisterForm(request.POST)
    context['form'] = form

    if not form.is_valid():
        return render(request, 'login.html', context)

    new_user = User.objects.create_user(username=form.cleaned_data['username'],
                                        email=form.cleaned_data['username'],
                                        name=form.cleaned_data['name'],
                                        first_name=form.cleaned_data['name'],
                                        password=form.cleaned_data['password'],
                                        bio=form.cleaned_data['bio'],
                                        birthdate=form.cleaned_data['birthdate'],
                                        location_lon=0,
                                        location_lat=0,
                                        )

    new_user.save()

    preferences = Preferences(user=new_user)
    preferences.save()

    new_user = authenticate(username=form.cleaned_data['username'],
                            password=form.cleaned_data['password'])

    authLogin(request, new_user)

    send_registration_mail(request, new_user)

    return redirect(reverse('index'))


def send_registration_mail(request, user):
    token = default_token_generator.make_token(user)

    email_body = "Verify your account clicking here: http://%s%s" % (
        request.get_host(), reverse('confirm', args=(user.name, token)))

    send_mail(subject="Verify your email address",
              message=email_body,
              from_email='chillfood@chillfood.com',
              recipient_list=[user.username])
    context = {'email': user.username}
    return render(request, 'needs_confirmation.html', context)


def confirm(request, name, token):
    user = get_object_or_404(User, name=name)
    real_token = default_token_generator.make_token(user)
    if token == real_token:
        user.is_confirmed = True
        user.save()

        return render(request, 'confirm.html', {})
    else:
        raise Http404("Token does not exist")
