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
from django.contrib import admin

import ChillFood.data
import ChillFood.views


urlpatterns = [
    url(r'^admin/', admin.site.urls),
    url(r'^setup/$', ChillFood.data.setup),
    url(r'^recipe_image/(?P<recipe_id>\d+)/$', ChillFood.views.recipe_image, name='recipe_image'),
    url(r'^step_image/(?P<step_id>\d+)/$', ChillFood.views.step_image, name='step_image'),
    url(r'^recipe/(?P<recipe_id>\d+)/$', ChillFood.views.recipe_detail, name='recipe_detail'),

]
