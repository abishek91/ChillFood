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

from . import data, views, api
from .login import views as login
from django.contrib.auth.views import logout_then_login

urlpatterns = [
    url(r'^$', views.index, name='index'),    
    #Configuration
    url(r'^setup/$', data.setup),
    #Recipe
    url(r'^recipe_image/(?P<recipe_id>\d+)/$', views.recipe_image, name='recipe_image'),
    url(r'^profile_image/(?P<user_id>\d+)/$', views.profile_image, name='profile_image'),
    url(r'^step_image/(?P<step_id>\d+)/$', views.step_image, name='step_image'),
    url(r'^recipe/(?P<recipe_id>\d+)/$', views.recipe_detail, name='recipe_detail'),
    url(r'^recipe_json/(?P<recipe_id>\d+)/$', views.recipe_detail_json, name='recipe_detail_json'),
    url(r'^app', views.app,name='app'),
    url(r'^recipe/(?P<recipe_id>\d+)/pic$', views.recipe_pic,name='recipe_pic'),
    #Login Module
    url(r'^login$', login.login, name='login'),
    url(r'^confirm/(?P<username>.+)/(?P<token>.+)$', login.confirm, name='confirm'),    
    url(r'^logout$',logout_then_login, name='logout'),
    url(r'^register$', login.register, name='register'), 
    #API
    #List of Recipes 
    url(r'^api/recipes$', api.recipes, name='recipes'),
    url(r'^api/lists$', api.lists, name='lists'),
    url(r'^api/preferences$', api.preferences, name='preferences'),
    url(r'^profile/(?P<user_id>\d+)$', views.profile),
    url(r'^profile_json/(?P<user_id>\d+)$', views.profile_json),
    url(r'^profile/(?P<user_id>\d+)/followers$', views.display_users),
    url(r'^profile/(?P<user_id>\d+)/following$', views.display_users),
    #Recipe Creation
    url(r'^api/recipe/create$', api.recipe_create,name='recipe_create'),
    #Comments
    url(r'^add_comment/(?P<recipe_id>\d+)$', views.add_comment, name='add_comment'),
    url(r'^add_rating/(?P<recipe_id>\d+)$', views.add_rating, name='add_rating'),
    #User
    url(r'^follow/(?P<user_id>\d+)$', views.follow, name='follow'),
    url(r'^unfollow/(?P<user_id>\d+)$', views.unfollow, name='unfollow'),
    url(r'^notifications$',views.notifications, name='notifications'),
    url(r'^readNotifications$',views.readNotifications, name='readNotifications'),
    #Party
    url(r'^api/party/create$', api.party_create),
    url(r'^api/party/confirm/(?P<party_id>.+)/(?P<user_id>.+)/(?P<token>.+)$', views.party_confirm, name='party_confirm'),
    url(r'^api/party/decline/(?P<party_id>\d+)/(?P<user_id>\d+)/(?P<token>.+)$', views.party_decline, name='party_decline'),
    url(r'^api/parties$', api.parties),
    url(r'^api/user$', api.user),

]

