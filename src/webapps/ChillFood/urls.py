"""webapps URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.10/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.conf.urls import url, include
    2. Add a URL to urlpatterns:  url(r'^blog/', include('blog.urls'))
"""
from django.conf.urls import url

from . import data, views#, api
from .login import views as login
from django.contrib.auth.views import logout_then_login

urlpatterns = [
    url(r'^$', views.index, name='index'),    
    #Configuration
    url(r'^setup/$', data.setup),
    url(r'^plz/$', views.plz, name='plz'),
    #Recipe
    url(r'^recipe_image/(?P<recipe_id>\d+)/$', views.recipe_image, name='recipe_image'),
    url(r'^step_image/(?P<step_id>\d+)/$', views.step_image, name='step_image'),
    url(r'^recipe/(?P<recipe_id>\d+)/$', views.recipe_detail, name='recipe_detail'),
    #Login Module
    url(r'^login$', login.login, name='login'),
    url(r'^confirm/(?P<username>.+)/(?P<token>.+)$', login.confirm, name='confirm'),    
    url(r'^logout$',logout_then_login, name='logout'),
    url(r'^register$', login.register, name='register'),        
]

